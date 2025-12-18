
export enum Status {
    Pending = 'ยังไม่เริ่ม',
    Approved = 'ผ่านการตรวจสอบเอกสาร',
    Rejected = 'ไม่ผ่าน มีการแก้ไข',
    NotApplicable = 'ไม่ต้องผ่านขั้นตอนนี้'
}

export enum DirectorStatus {
    InProgress = 'กำลังดำเนินการ',
    Approved = 'อนุมัติ',
    Rejected = 'ไม่อนุมัติ'
}

export interface Document {
    id: string;
    submissionDate: string; // ISO 8601 format
    docNumber: string;
    proposer: string;
    departmentGroup: string;
    objective: string;
    statusDept1: Status; // ฝ่ายแผนงานและบริหาร
    statusDept2: Status; // ฝ่ายพัสดุ
    statusDept3: Status; // ฝ่ายการเงิน
    statusDept4: Status; // ฝ่ายงบประมาณ
    directorStatus: DirectorStatus;
    notes?: string;
}

export type View = 'home' | 'form' | 'all-documents' | 'dashboard' | 'proposals' | 'manual' | 'app-views';
