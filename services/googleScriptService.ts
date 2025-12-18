
import { Document } from '../types';
import * as mockService from './mockSheetService';

declare const google: any;

const isLocalEnvironment = typeof google === 'undefined' || typeof google.script === 'undefined';

if (isLocalEnvironment) {
    console.warn("Running in local development mode. Using mock service for data persistence (localStorage).");
}

/**
 * ฟังก์ชันครอบ (Wrapper) สำหรับเรียก google.script.run ให้ทำงานแบบ Promise
 * @param functionName ชื่อฟังก์ชันใน Code.gs ที่จะเรียก
 * @param args อาร์กิวเมนต์ที่จะส่งไป
 * @returns Promise ที่จะ resolve หรือ reject ตามผลลัพธ์จาก server
 */
const servercall = <T>(functionName: string, ...args: any[]): Promise<T> => {
    return new Promise((resolve, reject) => {
        google.script.run
            .withSuccessHandler(resolve)
            .withFailureHandler(reject)
            [functionName](...args);
    });
};

export const getDocuments = async (): Promise<Document[]> => {
    if (isLocalEnvironment) {
        return mockService.getDocuments();
    }
    return servercall<Document[]>('getDocuments');
};

export const saveDocument = async (doc: Document | Omit<Document, 'id' | 'docNumber'>): Promise<Document> => {
    if (isLocalEnvironment) {
        return mockService.saveDocument(doc);
    }
    // Backend จะจัดการสร้าง id และ docNumber สำหรับเอกสารใหม่
    return servercall<Document>('saveDocument', doc);
};

export const deleteDocument = async (id: string): Promise<{success: boolean; id: string}> => {
    if (isLocalEnvironment) {
        return mockService.deleteDocument(id);
    }
    return servercall<{success: boolean; id: string}>('deleteDocument', id);
};
