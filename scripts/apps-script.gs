/**
 * PeraWays — Google Apps Script Webhook
 *
 * Installation:
 * 1. Create or open a Google Sheet
 * 2. Extensions → Apps Script
 * 3. Paste this entire file
 * 4. Replace SHEET_ID
 * 5. Deploy → New Deployment → Web App
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Copy the webhook URL → set as NEXT_PUBLIC_WEBHOOK_URL in .env.local
 */

var SHEET_ID = "YOUR_SHEET_ID_HERE";

function doPost(e) {
  console.log("doPost gestartet");
  console.log("e vorhanden: " + (e !== null && e !== undefined));

  var params = e.parameter;
  console.log("Email aus Formular: " + params.Email);
  console.log("Name aus Formular: " + params.Name);

  var lang = params.lang || "de";
  var now = new Date();
  var name = params.Name || "Interessent";
  var email = params.Email;

  // Notification
  MailApp.sendEmail(
    "team@peraways.de",
    "NEU: Anfrage von " + name,
    "Name: " + name + "\nEmail: " + email + "\nNachricht: " + (params.Nachricht || "")
  );
  console.log("Notification gesendet");

  // Auto-response
  if (email) {
    MailApp.sendEmail(
      email,
      "Eingangsbestätigung — PeraWays",
      "Hallo " + name + ",\n\nDanke für Ihre Anfrage. Wir melden uns in 24h."
    );
    console.log("Auto-response gesendet an: " + email);
  }

  // Sheet
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getActiveSheet();
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, 8).setValues([[
      "Timestamp", "Name", "Email", "Telefon", "Nachricht",
      "Sprache", "IP", "Honey"
    ]]);
    sheet.setFrozenRows(1);
  }
  sheet.appendRow([now, params.Name || "", email || "", params.Telefon || "", params.Nachricht || "", lang, params._ip || "", params._honey || ""]);
  console.log("Sheet aktualisiert");

  return ContentService.createTextOutput("OK");
}

function doGet() {
  return HtmlService.createHtmlOutput(
    "<h1>PeraWays Contact Form API</h1><p>This endpoint accepts POST requests.</p>"
  );
}

// Test manual : exécutez cette fonction depuis l'éditeur pour vérifier MailApp
function testMail() {
  var quota = MailApp.getRemainingDailyQuota();
  Logger.log("Quota restant aujourd'hui: " + quota);

  try {
    MailApp.sendEmail(
      "team@peraways.de",
      "Test PeraWays",
      "Ceci est un test. Si vous lisez ce message, MailApp fonctionne."
    );
    Logger.log("Email de test envoye avec succes");
  } catch (err) {
    Logger.log("ERREUR: " + err);
  }
}
