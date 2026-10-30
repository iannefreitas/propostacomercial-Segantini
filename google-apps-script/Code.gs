/**
 * Segantini · Registro de respostas da apresentação comercial
 * ------------------------------------------------------------
 * Cole este código em: Planilha → Extensões → Apps Script.
 * Passo a passo completo no README.md do projeto (seção "Google Sheets").
 *
 * 1. Rode a função `setup` uma vez (botão ▶ Executar) e autorize.
 *    Ela cria as abas "Respostas" e "Painel" e gera o SEGREDO.
 *    O segredo aparece no "Registro de execução" — copie-o.
 * 2. Implantar → Nova implantação → Tipo "App da Web"
 *      Executar como: Eu  |  Quem pode acessar: Qualquer pessoa
 *    Copie a URL que termina em /exec.
 * 3. Cadastre URL e segredo na Vercel (SHEETS_WEBHOOK_URL e SHEETS_SECRET).
 *
 * A planilha continua PRIVADA: o script grava como você, e só aceita
 * chamadas que tragam o segredo (que fica guardado apenas na Vercel).
 */

var SHEET_NAME = 'Respostas';
var HEADERS = [
  'Data/Hora', 'Nome', 'Empresa', 'Contato', 'Nº de colaboradores', 'Estrutura de RH',
  'Desafios', 'Qtde. desafios', 'Soluções de interesse', 'Soluções sugeridas',
  'O que quer melhorar', 'Vendedor (link)', 'Origem', 'Dispositivo', 'Tempo na apresentação (min)',
  'Status comercial', 'Observações do comercial'
];
var STATUS = ['Novo', 'Em contato', 'Reunião agendada', 'Proposta enviada', 'Fechado', 'Perdido'];

function setup() {
  var props = PropertiesService.getScriptProperties();
  if (!props.getProperty('SECRET')) {
    props.setProperty('SECRET', Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, ''));
  }
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME, 0);
  sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS])
    .setFontWeight('bold').setBackground('#CE4717').setFontColor('#FFFFFF').setWrap(true);
  sh.setFrozenRows(1);
  sh.setColumnWidths(1, HEADERS.length, 160);
  sh.setColumnWidth(7, 320); sh.setColumnWidth(9, 280); sh.setColumnWidth(11, 320);
  var rule = SpreadsheetApp.newDataValidation().requireValueInList(STATUS, true).build();
  sh.getRange(2, 16, sh.getMaxRows() - 1, 1).setDataValidation(rule);
  buildDashboard_(ss);
  Logger.log('SEGREDO (copie para a variável SHEETS_SECRET na Vercel): ' + props.getProperty('SECRET'));
}

/** Mostra o segredo novamente, se precisar. */
function mostrarSegredo() {
  Logger.log(PropertiesService.getScriptProperties().getProperty('SECRET'));
}

/** Opcional: receber um e-mail a cada novo lead. Edite o e-mail e rode uma vez. */
function ativarAvisoPorEmail() {
  PropertiesService.getScriptProperties().setProperty('NOTIFY_EMAIL', 'comercial@segantiniconsultoria.com');
  MailApp.getRemainingDailyQuota(); // força a autorização de envio de e-mail
}

function doPost(e) {
  try {
    var req = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    var secret = PropertiesService.getScriptProperties().getProperty('SECRET');
    if (!secret || req.secret !== secret) return json_({ ok: false, error: 'unauthorized' });

    var d = req.data || {};
    var row = [
      new Date(),
      d.nome, d.empresa, d.contato, d.porte, d.rh,
      (d.desafios || []).join(' • '), (d.desafios || []).length,
      (d.solucoes || []).join(' • '), (d.recomendadas || []).join(' • '),
      d.melhoria, d.vendedor, d.origem, d.dispositivo,
      Math.round(((Number(d.duracao_seg) || 0) / 60) * 10) / 10,
      'Novo', d.reenvio ? 'Reenviado automaticamente após falha de conexão' : ''
    ].map(safe_);

    var lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
      sh.appendRow(row);
      sh.getRange(sh.getLastRow(), 1).setNumberFormat('dd/MM/yyyy HH:mm');
    } finally {
      lock.releaseLock();
    }

    notify_(d);
    return json_({ ok: true });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: 'server_error' });
  }
}

function doGet() {
  return json_({ ok: true, service: 'segantini-leads' });
}

/* ---------- auxiliares ---------- */

// Evita que textos digitados pelo visitante virem fórmulas na planilha
function safe_(v) {
  if (v === null || v === undefined) return '';
  if (typeof v !== 'string') return v;
  return /^[=+\-@\t\r]/.test(v) ? "'" + v : v;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function notify_(d) {
  var to = PropertiesService.getScriptProperties().getProperty('NOTIFY_EMAIL');
  if (!to) return;
  try {
    MailApp.sendEmail({
      to: to,
      subject: 'Novo lead na apresentação: ' + d.empresa + ' (' + d.nome + ')',
      body: [
        'Nome: ' + d.nome, 'Empresa: ' + d.empresa, 'Contato: ' + (d.contato || '—'),
        'Colaboradores: ' + d.porte, 'RH: ' + d.rh,
        'Desafios: ' + (d.desafios || []).join(', '),
        'Interesse: ' + (d.solucoes || []).join(', '),
        'Quer melhorar: ' + (d.melhoria || '—'),
        'Vendedor: ' + (d.vendedor || '—'),
        '', 'Planilha: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl()
      ].join('\n')
    });
  } catch (err) { console.error('Falha no e-mail', err); }
}

function buildDashboard_(ss) {
  var sh = ss.getSheetByName('Painel') || ss.insertSheet('Painel');
  sh.clear();
  var R = SHEET_NAME + '!';
  var rows = [
    ['PAINEL COMERCIAL · APRESENTAÇÃO SEGANTINI', ''],
    ['Atualiza sozinho a cada nova resposta.', ''],
    ['', ''],
    ['Total de leads', '=COUNTA(' + R + 'B2:B)'],
    ['Leads nos últimos 7 dias', '=COUNTIFS(' + R + 'A2:A,">="&(TODAY()-7))'],
    ['Leads com contato informado', '=COUNTIF(' + R + 'D2:D,"?*")'],
    ['Tempo médio na apresentação (min)', '=IFERROR(ROUND(AVERAGE(' + R + 'O2:O),1),0)'],
    ['', ''],
    ['FUNIL (coluna "Status comercial")', ''],
  ];
  STATUS.forEach(function (s) { rows.push([s, '=COUNTIF(' + R + 'P2:P,"' + s + '")']); });
  rows.push(['Taxa de conversão (Fechado / total)', '=IFERROR(COUNTIF(' + R + 'P2:P,"Fechado")/COUNTA(' + R + 'B2:B),0)']);
  rows.push(['', '']);
  rows.push(['PORTE DAS EMPRESAS', '']);
  ['Até 10', 'De 11 a 30', 'De 31 a 60', 'De 61 a 100', 'Mais de 100'].forEach(function (p) {
    rows.push([p, '=COUNTIF(' + R + 'E2:E,"' + p + '")']);
  });
  sh.getRange(1, 1, rows.length, 2).setValues(rows);
  var conv = 9 + STATUS.length + 1;
  sh.getRange(conv, 2).setNumberFormat('0.0%');
  sh.getRange('A1').setFontSize(14).setFontWeight('bold').setFontColor('#CE4717');
  sh.getRange('A2').setFontColor('#9A8074');
  [9, conv + 2].forEach(function (r) { sh.getRange(r, 1).setFontWeight('bold').setFontColor('#CE4717'); });
  sh.setColumnWidth(1, 320); sh.setColumnWidth(2, 120);

  // Ranking de desafios e soluções (texto contém o item)
  var start = rows.length + 2;
  sh.getRange(start, 1, 1, 2).setValues([['DESAFIOS MAIS CITADOS', 'Leads']]).setFontWeight('bold').setFontColor('#CE4717');
  sh.getRange(start + 1, 1).setFormula(
    '=IFERROR(QUERY(FLATTEN(ARRAYFORMULA(TRIM(SPLIT(FILTER(' + R + 'G2:G,' + R + 'G2:G<>"")," • ",FALSE)))),' +
    '"select Col1, count(Col1) where Col1 <> \'\' group by Col1 order by count(Col1) desc label count(Col1) \'\'",0),"Sem dados ainda")');
  sh.getRange(start, 4, 1, 2).setValues([['SOLUÇÕES DE MAIOR INTERESSE', 'Leads']]).setFontWeight('bold').setFontColor('#CE4717');
  sh.getRange(start + 1, 4).setFormula(
    '=IFERROR(QUERY(FLATTEN(ARRAYFORMULA(TRIM(SPLIT(FILTER(' + R + 'I2:I,' + R + 'I2:I<>"")," • ",FALSE)))),' +
    '"select Col1, count(Col1) where Col1 <> \'\' group by Col1 order by count(Col1) desc label count(Col1) \'\'",0),"Sem dados ainda")');
  sh.setColumnWidth(4, 300);
}
