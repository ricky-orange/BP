const TERMS = {
  '0100': '即期-現金', '0200': '即期-支票', '0300': '即期-電匯',
  '0301': '工程-5日/20日電匯', 'K215': '月結15天支票', 'K230': '月結30天支票',
  'K245': '月結45天支票', 'K260': '月結60天支票', 'K290': '月結90天支票',
  'K315': '月結15天電匯款', 'K330': '月結30天電匯款', 'K345': '月結45天電匯款',
  'K360': '月結60天電匯款', 'K390': '月結90天電匯款', 'K3C0': '月結120天電匯款',
  'K3NN': '保留款'
};

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('SAP 廠商付款條件查詢')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function displaySupplierId(value) {
  const id = value.trim();
  return /^00\d{8}$/.test(id) ? id.slice(2) : id;
}

function searchSuppliers(idQuery, nameQuery) {
  const idKeyword = displaySupplierId(typeof idQuery === 'string' ? idQuery : '').toLowerCase();
  const nameKeyword = typeof nameQuery === 'string' ? nameQuery.trim().toLowerCase() : '';
  if ((!idKeyword && !nameKeyword) || idKeyword.length > 100 || nameKeyword.length > 100 ||
      (nameKeyword && nameKeyword.length < 2)) {
    throw new Error('請輸入有效的查詢條件。');
  }
  const properties = PropertiesService.getScriptProperties();
  const spreadsheet = SpreadsheetApp.openById(properties.getProperty('SPREADSHEET_ID'));
  const sheet = spreadsheet.getSheetByName(properties.getProperty('SUPPLIER_TAB') || 'M_BP_Supplier');
  if (!sheet) throw new Error('找不到廠商資料分頁。');

  const [headers, ...rows] = sheet.getDataRange().getDisplayValues();
  const [idIndex, nameIndex, termsIndex] = ['SD_SUPPLIER', 'COM_NAME', 'PAY_TERMS']
    .map(header => headers.findIndex(value => value.trim() === header));
  if ([idIndex, nameIndex, termsIndex].includes(-1)) throw new Error('廠商資料缺少必要欄位。');

  const results = [];
  for (const row of rows) {
    const id = displaySupplierId(row[idIndex]);
    const name = row[nameIndex].trim();
    if (!id) continue;
    if (idKeyword && id.toLowerCase() !== idKeyword) continue;
    if (nameKeyword && !name.toLowerCase().includes(nameKeyword)) continue;

    const rawCode = row[termsIndex].trim().toUpperCase();
    const code = /^\d{1,4}$/.test(rawCode) ? rawCode.padStart(4, '0') : rawCode;
    const terms = TERMS[code || '0301'] || ('未對照（' + code + '）');
    results.push([id, name, terms]);
    if (results.length === 51) break;
  }
  return { rows: results.slice(0, 50), truncated: results.length > 50 };
}
