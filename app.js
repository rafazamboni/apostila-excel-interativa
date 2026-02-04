// Aula 01 — POC
// Objetivo: aluno edita fórmulas em células (tipo Excel), e a página valida respostas.

function buildSheetData() {
  // Monta uma “planilha” simples (linhas/colunas 0-based).
  // Usamos strings/fórmulas no padrão do Luckysheet.
  // Campos importantes: v (valor), m (display), f (fórmula), bg (cor), bl (bold)
  const cell = (r, c, obj) => ({ r, c, ...obj });

  const rows = [];

  function setCell(r, c, valueObj) {
    if (!rows[r]) rows[r] = { row: r, column: c, ...{} };
    if (!rows[r].data) rows[r].data = {};
    rows[r].data[c] = valueObj;
  }

  // Cabeçalho
  setCell(0, 0, { v: "Despesas do mês", m: "Despesas do mês", bl: 1, fs: 14 });
  setCell(1, 0, { v: "Aluguel", m: "Aluguel" });
  setCell(2, 0, { v: "Mercado", m: "Mercado" });
  setCell(3, 0, { v: "Transporte", m: "Transporte" });
  setCell(4, 0, { v: "Internet", m: "Internet" });
  setCell(5, 0, { v: "Lazer", m: "Lazer" });

  // Valores iniciais (editáveis)
  setCell(1, 1, { v: 1200, m: "1200" });
  setCell(2, 1, { v: 650, m: "650" });
  setCell(3, 1, { v: 280, m: "280" });
  setCell(4, 1, { v: 120, m: "120" });
  setCell(5, 1, { v: 300, m: "300" });

  // Labels
  setCell(7, 0, { v: "Total", m: "Total", bl: 1 });
  setCell(8, 0, { v: "Média", m: "Média", bl: 1 });
  setCell(9, 0, { v: "Status", m: "Status", bl: 1 });

  // Células de resposta (o aluno deve preencher)
  // Deixamos vazio para o aluno digitar a fórmula
  setCell(7, 1, { v: "", m: "" }); // B8
  setCell(8, 1, { v: "", m: "" }); // B9
  setCell(9, 1, { v: "", m: "" }); // B10

  // Dicas visuais (fundo suave)
  const hintBg = "#f3f4f6";
  for (const r of [7,8,9]) {
    setCell(r, 1, { ...rows[r]?.data?.[1], bg: hintBg });
  }

  // Ajustes de layout (coluna A maior)
  // Isso é configurado nas opções do Luckysheet (columnlen/rowlen),
  // então aqui não mexemos.

  // Luckysheet usa "celldata": [{r,c,v:{...}}]
  const celldata = [];
  for (let r = 0; r < rows.length; r++) {
    if (!rows[r] || !rows[r].data) continue;
    Object.keys(rows[r].data).forEach((cStr) => {
      const c = parseInt(cStr, 10);
      celldata.push(cell(r, c, { v: rows[r].data[c] }));
    });
  }

  return [{
    name: "Aula 01",
    index: 0,
    status: 1,
    order: 0,
    celldata
  }];
}

function initLuckysheet() {
  // Atenção: em GitHub Pages (https), funciona normalmente.
  // Se você abrir localmente via file:// pode dar comportamento estranho; prefira testar via "Live Server" ou Pages.
  window.luckysheet.create({
    container: "luckysheet",
    lang: "pt",
    showinfobar: false,
    allowUpdate: false,
    showsheetbar: true,
    showstatisticBar: true,
    enableAddRow: false,
    enableAddCol: false,
    data: buildSheetData(),
    column: 6,
    row: 18,
    columnlen: { 0: 200, 1: 140, 2: 140, 3: 140 },
    rowlen: { 0: 32 },
    defaultColWidth: 120,
    defaultRowHeight: 26
  });
}

function setStatus(type, text) {
  const el = document.getElementById("status");
  el.classList.remove("muted", "ok", "bad");
  el.classList.add(type);
  el.textContent = text;
}

// Helpers para ler valores
function getCellValue(r, c) {
  // getCellValue retorna o "m" (display) em muitos casos; se precisar do objeto, use getCell.
  return window.luckysheet.getCellValue(r, c);
}

function safeNumber(v) {
  if (v === null || v === undefined) return NaN;
  if (typeof v === "number") return v;
  // tenta converter string com vírgula
  const s = String(v).replace(/\./g, "").replace(",", ".");
  const n = Number(s);
  return Number.isFinite(n) ? n : NaN;
}

function expectedTotal() {
  const vals = [1,2,3,4,5].map(r => safeNumber(getCellValue(r, 1)));
  const ok = vals.every(n => Number.isFinite(n));
  if (!ok) return NaN;
  return vals.reduce((a,b) => a + b, 0);
}

function expectedAverage() {
  const t = expectedTotal();
  if (!Number.isFinite(t)) return NaN;
  return t / 5;
}

function checkAnswers() {
  // B8 = (r=7,c=1), B9=(8,1), B10=(9,1)
  const totalAluno = safeNumber(getCellValue(7, 1));
  const mediaAluno = safeNumber(getCellValue(8, 1));
  const statusAluno = String(getCellValue(9, 1) ?? "").trim().toUpperCase();

  const totalEsperado = expectedTotal();
  const mediaEsperada = expectedAverage();

  if (!Number.isFinite(totalEsperado) || !Number.isFinite(mediaEsperada)) {
    setStatus("bad", "Os valores em B2:B6 precisam ser numéricos para validar.");
    return;
  }

  // tolerância pequena por arredondamentos
  const tol = 0.0001;
  const okTotal = Number.isFinite(totalAluno) && Math.abs(totalAluno - totalEsperado) < tol;
  const okMedia = Number.isFinite(mediaAluno) && Math.abs(mediaAluno - mediaEsperada) < tol;

  const statusEsperado = (totalEsperado > 2500) ? "ACIMA DO LIMITE" : "OK";
  const okStatus = statusAluno === statusEsperado;

  if (okTotal && okMedia && okStatus) {
    setStatus("ok", "✅ Perfeito! Total, Média e SE estão corretos.");
  } else {
    const erros = [];
    if (!okTotal) erros.push("Total (B8)");
    if (!okMedia) erros.push("Média (B9)");
    if (!okStatus) erros.push("Status/SE (B10)");
    setStatus("bad", `❌ Ajuste: ${erros.join(", ")}.`);
  }
}

function resetExercise() {
  // Recria tudo
  const container = document.getElementById("luckysheet");
  container.innerHTML = "";
  initLuckysheet();
  setStatus("muted", "Exercício resetado. Edite e verifique novamente.");
}

document.addEventListener("DOMContentLoaded", () => {
  initLuckysheet();

  document.getElementById("btnCheck").addEventListener("click", checkAnswers);
  document.getElementById("btnReset").addEventListener("click", resetExercise);
});
