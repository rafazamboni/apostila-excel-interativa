<!doctype html>
<html lang="pt-br">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Apostila Interativa - Excel (Intermediário)</title>

  <!-- Luckysheet (fixe a versão) -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/luckysheet@2.1.13/dist/plugins/css/pluginsCss.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/luckysheet@2.1.13/dist/plugins/plugins.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/luckysheet@2.1.13/dist/css/luckysheet.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/luckysheet@2.1.13/dist/assets/iconfont/iconfont.css">

  <link rel="stylesheet" href="./style.css" />
</head>
<body>
  <header class="topbar">
    <div class="brand">
      <div class="dot"></div>
      <div>
        <div class="title">Apostila Interativa — Excel (Intermediário)</div>
        <div class="subtitle">Aula 01 — SOMA, MÉDIA e SE (com planilha editável)</div>
      </div>
    </div>

    <div class="actions">
      <button id="btnReset" class="btn" type="button">Resetar exercício</button>
      <button id="btnCheck" class="btn primary" type="button">Verificar respostas</button>
    </div>
  </header>

  <main class="layout">
    <aside class="panel">
      <section class="card">
        <h2>Objetivo</h2>
        <p>
          Nesta aula, o colaborador vai praticar <b>SOMA</b>, <b>MÉDIA</b> e <b>SE</b>
          direto em uma planilha (estilo Excel).
        </p>
      </section>

      <section class="card">
        <h2>Instruções do exercício</h2>

        <ol class="steps">
          <li>Preencha ou ajuste os valores em <b>B2:B6</b> (se quiser testar).</li>
          <li>Em <b>B8</b>, calcule o <b>Total</b> com <code>=SOMA(B2:B6)</code>.</li>
          <li>Em <b>B9</b>, calcule a <b>Média</b> com <code>=MÉDIA(B2:B6)</code>.</li>
          <li>Em <b>B10</b>, escreva uma <b>SE</b> que mostre:
            <ul>
              <li><code>“OK”</code> se o total (B8) for <b>≤ 2500</b></li>
              <li><code>“ACIMA DO LIMITE”</code> se for <b>&gt; 2500</b></li>
            </ul>
            Ex.: <code>=SE(B8&gt;2500;"ACIMA DO LIMITE";"OK")</code>
          </li>
        </ol>
      </section>

      <section class="card">
        <h2>Status</h2>
        <div id="status" class="status muted">Carregando planilha…</div>
        <div class="hint">
          Se a planilha não aparecer, abra o Console (F12) e veja se há erro/404.
        </div>
      </section>

      <footer class="footnote">
        Publicado via GitHub Pages • Sem backend • 100% gratuito
      </footer>
    </aside>

    <section class="sheetWrap">
      <div id="luckysheet" class="sheet"></div>
    </section>
  </main>

  <!-- Dependências do Luckysheet -->
  <script src="https://cdn.jsdelivr.net/npm/luckysheet@2.1.13/dist/plugins/js/plugin.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/luckysheet@2.1.13/dist/luckysheet.umd.js"></script>

  <script src="./app.js"></script>
</body>
</html>
