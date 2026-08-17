/**
 * GOOGLE SHEETS RSVP RECEIVER
 *
 * Cách dùng:
 * 1) Mở Google Sheet bạn muốn lưu RSVP.
 * 2) Extensions -> Apps Script.
 * 3) Xóa code mẫu và dán toàn bộ file này.
 * 4) Save.
 * 5) Deploy -> New deployment -> Web app.
 * 6) Execute as: Me.
 * 7) Who has access: Anyone.
 * 8) Deploy và copy URL kết thúc bằng /exec.
 * 9) Dán URL đó vào googleSheetsEndpoint trong config.js.
 */

const DEFAULT_SHEET_NAME = 'RSVP';

function doGet() {
  return jsonResponse({
    ok: true,
    service: 'Wedding RSVP Google Sheets endpoint'
  });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) throw new Error('Không tìm thấy Google Sheet đang liên kết với Apps Script.');

    const p = (e && e.parameter) ? e.parameter : {};
    const sheetName = cleanText(p.sheetTab) || DEFAULT_SHEET_NAME;
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) sheet = ss.insertSheet(sheetName);

    ensureHeaders(sheet);

    const submittedAt = cleanText(p.submittedAt);
    let submittedDate = new Date();
    if (submittedAt) {
      const parsed = new Date(submittedAt);
      if (!isNaN(parsed.getTime())) submittedDate = parsed;
    }

    sheet.appendRow([
      submittedDate,
      cleanText(p.name),
      cleanText(p.attendance),
      cleanText(p.guestCount),
      cleanText(p.message),
      cleanText(p.groom),
      cleanText(p.bride),
      cleanText(p.eventDate),
      cleanText(p.eventTime),
      cleanText(p.venue),
      cleanText(p.invitationUrl)
    ]);

    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1).setNumberFormat('dd/MM/yyyy HH:mm:ss');

    return jsonResponse({ok: true, row: lastRow});
  } catch (error) {
    return jsonResponse({ok: false, error: String(error)});
  } finally {
    lock.releaseLock();
  }
}

function ensureHeaders(sheet) {
  const headers = [
    'Thời gian gửi',
    'Họ và tên',
    'Tham dự',
    'Số người',
    'Lời chúc',
    'Út Nam',
    'Út Nữ',
    'Ngày tiệc',
    'Giờ tiệc',
    'Địa điểm',
    'Link thiệp'
  ];

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    formatHeader(sheet, headers.length);
    return;
  }

  const firstRow = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  const isBlank = firstRow.every(value => String(value).trim() === '');
  if (isBlank) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    formatHeader(sheet, headers.length);
  }
}

function formatHeader(sheet, width) {
  const header = sheet.getRange(1, 1, 1, width);
  header.setFontWeight('bold');
  header.setWrap(true);
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, width);
}

function cleanText(value) {
  if (value === undefined || value === null) return '';
  return String(value).trim();
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
