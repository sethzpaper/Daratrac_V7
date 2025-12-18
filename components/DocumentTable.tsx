
import React, { useState } from 'react';
import { Document } from '../types';
import { formatThaiDate } from '../utils/helpers';
import { defaultConfig } from '../constants';
import StatusBadge from './StatusBadge';

interface DocumentTableProps {
    documents: Document[];
    onEdit: (doc: Document) => void;
    onDelete: (id: string) => void;
}

const DocumentTable: React.FC<DocumentTableProps> = ({ documents, onEdit, onDelete }) => {
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    const handleDelete = (id: string) => {
        onDelete(id);
        setConfirmDeleteId(null);
    }
    
    return (
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md overflow-x-auto">
             <h2 className="text-2xl font-bold text-gray-800 mb-4">รายการเอกสารทั้งหมด</h2>
            <table className="w-full min-w-[1200px] text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-4 py-3">วันที่เสนอ</th>
                        <th scope="col" className="px-4 py-3">ผู้เสนอ / วัตถุประสงค์</th>
                        <th scope="col" className="px-4 py-3 text-center">{defaultConfig.department_1_name}</th>
                        <th scope="col" className="px-4 py-3 text-center">{defaultConfig.department_2_name}</th>
                        <th scope="col" className="px-4 py-3 text-center">{defaultConfig.department_3_name}</th>
                        <th scope="col" className="px-4 py-3 text-center">{defaultConfig.department_4_name}</th>
                        <th scope="col" className="px-4 py-3 text-center">{defaultConfig.director_name}</th>
                        <th scope="col" className="px-4 py-3">หมายเหตุ</th>
                        <th scope="col" className="px-4 py-3"></th>
                    </tr>
                </thead>
                <tbody>
                    {documents.map(doc => (
                        <tr key={doc.id} className="bg-white border-b hover:bg-gray-50">
                            <td className="px-4 py-4">{formatThaiDate(doc.submissionDate)}</td>
                            <td className="px-4 py-4">
                                <div className="font-medium text-gray-900">{doc.proposer}</div>
                                <div className="text-gray-500">{doc.objective}</div>
                                <div className="text-xs text-gray-400">{doc.departmentGroup}</div>
                            </td>
                            <td className="px-4 py-4 text-center"><StatusBadge status={doc.statusDept1} /></td>
                            <td className="px-4 py-4 text-center"><StatusBadge status={doc.statusDept2} /></td>
                            <td className="px-4 py-4 text-center"><StatusBadge status={doc.statusDept3} /></td>
                            <td className="px-4 py-4 text-center"><StatusBadge status={doc.statusDept4} /></td>
                            <td className="px-4 py-4 text-center"><StatusBadge status={doc.directorStatus} /></td>
                            <td className="px-4 py-4 max-w-xs truncate">{doc.notes}</td>
                            <td className="px-4 py-4">
                                {confirmDeleteId === doc.id ? (
                                    <div className="flex items-center space-x-1">
                                        <button onClick={() => handleDelete(doc.id)} className="text-red-600 hover:text-red-900 text-xs">ยืนยัน</button>
                                        <button onClick={() => setConfirmDeleteId(null)} className="text-gray-600 hover:text-gray-900 text-xs">ยกเลิก</button>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <button onClick={() => onEdit(doc)} className="font-medium text-blue-600 hover:underline">แก้ไข</button>
                                        <button onClick={() => setConfirmDeleteId(doc.id)} className="font-medium text-red-600 hover:underline">ลบ</button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {documents.length === 0 && <p className="text-center py-8 text-gray-500">ไม่พบเอกสาร</p>}
        </div>
    );
};

export default DocumentTable;
