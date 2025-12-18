
const SHEET_ID = '1MIbQVwTdMnjyO4rFoLtkegzS353DAd0BMQfWCgW7j-o';
const SHEET_NAME = 'เอกสารงบประมาณ';
const HEADERS = [
  'id', 'submissionDate', 'docNumber', 'proposer', 'departmentGroup',
  'objective', 'statusDept1', 'statusDept2', 'statusDept3', 'statusDept4',
  'directorStatus', 'notes'
];

/**
 * ให้บริการ Web App
 */
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('index.html')
      .setTitle("ระบบติดตามเอกสารงบประมาณ")
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Helper: ดึงชีตที่ต้องการ หากไม่มีจะสร้างใหม่พร้อม Header
 */
function getSheet_() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      sheet.appendRow(HEADERS);
    }
    // Check if headers are correct
    const currentHeaders = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
    if (JSON.stringify(currentHeaders) !== JSON.stringify(HEADERS)) {
        // If headers are incorrect/missing, overwrite them. This is a simple recovery mechanism.
        sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    }
    return sheet;
  } catch (e) {
    Logger.log('Failed to get sheet: ' + e.toString());
    throw new Error('ไม่สามารถเข้าถึง Google Sheet ได้ กรุณาตรวจสอบ ID และสิทธิ์การเข้าถึง');
  }
}

/**
 * Helper: แปลงข้อมูลจาก Sheet (Array 2 มิติ) เป็น Array ของ Object
 */
function sheetDataToObjects_(data) {
  const headers = data[0];
  const objects = [];
  for (let i = 1; i < data.length; i++) {
    const obj = {};
    // ตรวจสอบว่าแถวไม่ว่างเปล่า
    if(data[i].join('').length > 0) {
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = data[i][j];
      }
      objects.push(obj);
    }
  }
  return objects;
}

/**
 * Helper: แปลง Object เป็น Array สำหรับบันทึกลง Sheet
 */
function objectToRowArray_(obj) {
  return HEADERS.map(header => obj[header] !== undefined ? obj[header] : '');
}


/**
 * API: ดึงข้อมูลเอกสารทั้งหมด
 */
function getDocuments() {
  try {
    const sheet = getSheet_();
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return []; // ถ้ามีแต่ Header หรือว่างเปล่า
    return sheetDataToObjects_(data);
  } catch (e) {
    Logger.log(e);
    throw new Error('เกิดข้อผิดพลาดในการดึงข้อมูล: ' + e.message);
  }
}

/**
 * API: บันทึกเอกสาร (สร้างใหม่ หรือ อัปเดต)
 */
function saveDocument(doc) {
  try {
    const sheet = getSheet_();
    const data = sheet.getDataRange().getValues();
    
    if (doc.id) { // อัปเดตเอกสารเดิม
      const rowIndex = data.findIndex(row => row[0] === doc.id);
      if (rowIndex > 0) { // เจอข้อมูล (index > 0 เพื่อข้าม header)
        const rowArray = objectToRowArray_(doc);
        sheet.getRange(rowIndex + 1, 1, 1, HEADERS.length).setValues([rowArray]);
        return doc;
      }
    }
    
    // สร้างเอกสารใหม่
    const newDoc = { ...doc };
    newDoc.id = Utilities.getUuid(); // สร้าง ID ที่ไม่ซ้ำกัน
    
    // สร้างเลขที่เอกสาร
    const objects = sheetDataToObjects_(data);
    const currentYear = new Date().getFullYear();
    const yearDocs = objects.filter(d => d.submissionDate && new Date(d.submissionDate).getFullYear() === currentYear);
    const nextId = yearDocs.length + 1;
    const formattedId = nextId.toString().padStart(3, '0');
    newDoc.docNumber = `SPK-${currentYear}-${formattedId}`;
    
    const newRow = objectToRowArray_(newDoc);
    sheet.appendRow(newRow);
    
    return newDoc; // ส่งข้อมูลเอกสารที่สมบูรณ์กลับไป
    
  } catch (e) {
    Logger.log(e);
    throw new Error('เกิดข้อผิดพลาดในการบันทึกข้อมูล: ' + e.message);
  }
}

/**
 * API: ลบเอกสาร
 */
function deleteDocument(id) {
  try {
    const sheet = getSheet_();
    const data = sheet.getDataRange().getValues();
    const rowIndex = data.findIndex(row => row[0] === id);
    
    if (rowIndex > 0) { // เจอข้อมูล (index > 0 เพื่อข้าม header)
      sheet.deleteRow(rowIndex + 1);
      return { success: true, id: id };
    } else {
      throw new Error('ไม่พบเอกสารที่ต้องการลบ');
    }
  } catch (e) {
    Logger.log(e);
    throw new Error('เกิดข้อผิดพลาดในการลบข้อมูล: ' + e.message);
  }
}
