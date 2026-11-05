/**
 * Luna Civic Strategies: contact form → Google Sheet
 *
 * Paste this into the sheet's Apps Script editor (Extensions → Apps Script)
 * and deploy it as a Web app. The website posts each contact form
 * submission here and this appends one row to the "Submissions" tab:
 *
 *   Timestamp | First Name | Last Name | Email | Organization |
 *   Interested In | Phone | Working Toward
 *
 * Only requests carrying the shared secret are accepted. Save the secret in
 * Project Settings → Script Properties as SHARED_SECRET, and the same value
 * in Vercel as SHEETS_WEBHOOK_SECRET. See docs/CONTACT_FORM_SETUP.md.
 */

var SHEET_NAME = 'Submissions';
var HEADERS = [
  'Timestamp',
  'First Name',
  'Last Name',
  'Email',
  'Organization',
  'Interested In',
  'Phone',
  'Working Toward',
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    var data = JSON.parse((e && e.postData && e.postData.contents) || '{}');

    var secret = PropertiesService.getScriptProperties().getProperty('SHARED_SECRET');
    if (!secret || data.secret !== secret) {
      return reply({ ok: false, error: 'unauthorized' });
    }

    // One submission at a time, so rows never overwrite each other
    lock.waitLock(10000);
    var sheet = getSheet();
    sheet.appendRow([
      new Date(),
      clean(data.firstName),
      clean(data.lastName),
      clean(data.email),
      clean(data.organization),
      clean(data.interestedIn),
      clean(data.phone),
      clean(data.workingToward),
    ]);
    return reply({ ok: true });
  } catch (err) {
    return reply({ ok: false, error: String(err) });
  } finally {
    try {
      lock.releaseLock();
    } catch (ignored) {}
  }
}

// The "Submissions" tab, created with a bold, frozen header row if needed
function getSheet() {
  var book = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = book.getSheetByName(SHEET_NAME) || book.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// Plain text only: anything starting with = + - @ is kept as text so the
// sheet never runs it as a formula
function clean(value) {
  var text = value == null ? '' : String(value);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// Run this once from the editor (select "testRow", press Run) to check the
// sheet and the headers. Delete the test row afterwards.
function testRow() {
  getSheet().appendRow([new Date(), 'Test', 'Row', 'test@example.com', 'Test Org', 'Training', '', 'Checking the setup']);
}
