// ---------------------------------------------------------
// Google Apps Script - License Management API
// Deploy as Web App (Execute as: Me, Access: Anyone)
// ---------------------------------------------------------

const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID"; // Replace with your Sheet ID
const SECRET_KEY = "YOUR_SUPER_SECRET_KEY_FOR_HMAC"; // Secure key

function doGet(e) {
  return handleRequest(e, "GET");
}

function doPost(e) {
  return handleRequest(e, "POST");
}

function handleRequest(e, method) {
  try {
    const action = e.parameter.action;
    
    if (action === "ValidateLicense") {
      return validateLicense(e.parameter);
    } else if (action === "ActivateLicense") {
      return activateLicense(e.parameter);
    } else if (action === "RegisterDevice") {
      return registerDevice(e.parameter);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: "Unknown action"
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function validateLicense(params) {
  const serial = params.serial;
  const hwid = params.hwid;
  
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName("Licenses");
  const data = sheet.getDataRange().getValues();
  
  // Skip header
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const rowSerial = row[4]; // Assuming column E is Serial
    const rowStatus = row[7]; // Status
    const expDate = new Date(row[8]); // Expiration Date
    const allowedDevices = row[12];
    
    if (rowSerial === serial) {
      if (rowStatus !== "Active") {
        return jsonResponse({ success: false, message: "License is disabled." });
      }
      if (expDate < new Date()) {
        return jsonResponse({ success: false, message: "License expired." });
      }
      
      // Check device in Devices sheet
      const isValidDevice = checkDevice(serial, hwid);
      if (!isValidDevice) {
         return jsonResponse({ success: false, message: "Device not registered for this license." });
      }
      
      // Create Signed Token
      const tokenPayload = {
        serial: serial,
        hwid: hwid,
        exp: expDate.getTime(),
        type: row[6],
        timestamp: new Date().getTime()
      };
      
      const tokenStr = Utilities.base64Encode(JSON.stringify(tokenPayload));
      const signature = Utilities.computeHmacSha256Signature(tokenStr, SECRET_KEY);
      const signatureHex = signature.map(function(byte) {
          return ('0' + (byte & 0xFF).toString(16)).slice(-2);
      }).join('');
      
      return jsonResponse({
        success: true,
        message: "Valid",
        token: tokenStr + "." + signatureHex,
        details: tokenPayload
      });
    }
  }
  
  return jsonResponse({ success: false, message: "Invalid Serial Number." });
}

function checkDevice(serial, hwid) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName("Devices");
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === serial && data[i][1] === hwid) {
      return true; // Device found
    }
  }
  return false;
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
