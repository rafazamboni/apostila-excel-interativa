function setStatus(type, text) {
  const el = document.getElementById("status");
  el.classList.remove("muted", "ok", "bad");
  el.classList.add(type);
  el.textContent = text;
}

function buildSheetData() {
  const celldata = [];
  const push = (r, c, v) => celldata.push({ r, c, v });

  push(0, 0, { v: "Despesas do mês", m: "Despesas do mês", bl: 1, fs: 14 });

  push(1, 0, { v: "Aluguel", m: "Aluguel" });
  push(2, 0, { v: "Mercado", m: "Mercado" });
  push(3, 0, { v: "Transporte", m: "Transporte" });
  push(4, 0, { v: "Internet", m: "Internet" });
  push(5, 0, { v: "Lazer", m: "Lazer" });

  push(1, 1, { v: 1200, m: "1200" });
  push(2, 1, { v: 650,  m: "650"  });
  push(3, 1, { v: 280,  m: "280"  });
  push(4, 1, { v: 120,  m: "120"  });
  push(5, 1, { v: 300,  m: "300"  });

  push(7, 0, { v: "Total", m: "Total", bl: 1 });
  push(8, 0, { v: "Média", m: "Média", bl: 1 });
  push(9, 0, { v: "Status", m: "Status", bl: 1 });

  const hintBg = "#f3f4f6";
  push(7, 1, { v: "", m: "", bg: hintBg });
  push(8, 1, { v: "", m: "", bg: hintBg });
  push(9, 1, { v: "", m: "", bg: hintBg });

  return [{
    name: "Aula 01",
    index: 0,
    status: 1,
    order: 0,
    celldata
  }];
}

function createSheetWithLang(lang) {
  window.luckysheet.create({
    container: "luckysheet",
    // ✅ "pt" causava o erro functionlist undefined. "en" é seguro.
    lang,
    showinfobar: false,
    showsheetbar: true,
    showstatisticBar: true,
    enableAddRow: false,
    enableAddCol: false,
    data: buildSheetData(),
    column: 6,
    row: 18,
    columnlen: { 0: 200, 1: 160, 2: 140, 3: 140 },
    defaultColWidth: 120,
    defaultRowHeight: 26
  });
}

function initLuckysheet() {
  if (!window.luckysheet || typeof window.luckysheet.create !== "function") {
    setStatus("bad", "❌ Luckysheet não carregou (verifique Console/F12 e Network por erros/404).");
    return;
  }

  // limpa container (importante em reset / reload)
  const container = document.getElementById("luckysheet");
  container.innerHTML = "";

  try {
    createSheetWithLang("en");
    setStatus("muted", "✅ Planilha carregada. Faça o exercício e clique em “Verificar respostas”.");
  } catch (e) {
    // fallback final: tenta sem lang
    try {
      container.innerHTML = "";
      window.luckysheet.create({
        container: "luckysheet",
        showinfobar: false,
        showsheetbar: true,
        showstatisticBar: true,
        enableAddRow: false,
        enableAddCol: false,
        data: buildSheetData()
      });
      setStatus("muted", "✅ Planilha carregada (fallback).");
    } catch (e2) {
      console.error(e2);
      setStatus("bad", "❌ Erro ao iniciar planilha. Veja Console (F12) para detalhes.");
    }
  }
}

// Helpers
function safeNumber(v) {
  if (v === null || v === undefined) return NaN;
  if (typeof v === "number") return v;
  const s = String(v).replace(/\./g, "").replace(",", ".");
  const n = Number(s);
  return Number.isFinite(n) ? n : NaN;
}

function expectedTotal() {
  const vals = [1,2,3,4,5].map(r => safeNumber(window.luckysheet.getCellValue(r, 1)));
  if (!vals.every(n => Number.isFinite(n))) return NaN;
  return vals.reduce((a,b) => a + b, 0);
}
function expectedAverage() {
  const t = expectedTotal();
  if (!Number.isFinite(t)) return NaN;
  return t / 5;
}

function checkAnswers() {
  const totalAluno = safeNumber(window.luckysheet.getCellValue(7, 1));
  const mediaAluno = safeNumber(window.luckysheet.getCellValue(8, 1));
  const statusAluno = String(window.luckysheet.getCellValue(9, 1) ?? "").trim().toUpperCase();

  const totalEsperado = expectedTotal();
  const mediaEsperada = expectedAverage();

  if (!Number.isFinite(totalEsperado) || !Number.isFinite(mediaEsperada)) {
    setStatus("bad", "Os valores em B2:B6 precisam ser numéricos para validar.");
    return;
  }

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
  initLuckysheet();
  setStatus("muted", "Exercício resetado. Edite e verifique novamente.");
}

window.addEventListener("load", () => {
  initLuckysheet();
  document.getElementById("btnCheck").addEventListener("click", checkAnswers);
  document.getElementById("btnReset").addEventListener("click", resetExercise);
});
