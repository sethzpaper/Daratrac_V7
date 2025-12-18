
import React, { useState } from 'react';
import { Document } from '../types';
import { formatThaiDate } from '../utils/helpers';
import { defaultConfig } from '../constants';
import StatusBadge from './StatusBadge';

interface DocumentListProps {
    documents: Document[];
    title: string;
    onEdit: (doc: Document) => void;
    onDelete: (id: string) => void;
}

const DocumentItem: React.FC<{ doc: Document; onEdit: (doc: Document) => void; onDelete: (id: string) => void; }> = ({ doc, onEdit, onDelete }) => {
    const [confirmDelete, setConfirmDelete] = useState(false);

    const handleDeleteClick = () => {
        if (confirmDelete) {
            onDelete(doc.id);
            setConfirmDelete(false);
        } else {
            setConfirmDelete(true);
        }
    };

    // FIX: Removed unused import of `getDirectorStatusClass` which caused a compilation error as it is not exported from `../utils/helpers`.
    // This function remains to style the header, while StatusBadge styles the detailed status in the table view.
    const getDirectorHeaderClass = (status: string): string => {
        switch (status) {
            case 'อนุมัติ': return 'bg-green-500';
            case 'ไม่อนุมัติ': return 'bg-red-500';
            default: return 'bg-yellow-500';
        }
    }


    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
            <div className={`p-4 text-white font-bold ${getDirectorHeaderClass(doc.directorStatus)}`}>
                {defaultConfig.director_name}: {doc.directorStatus}
            </div>
            <div className="p-4 space-y-3">
                <p className="text-lg font-semibold text-gray-800">{doc.objective}</p>
                <p className="text-sm text-gray-600"><strong>ผู้เสนอ:</strong> {doc.proposer}</p>
                <p className="text-sm text-gray-600"><strong>กลุ่มสาระ:</strong> {doc.departmentGroup}</p>
                <p className="text-sm text-gray-500"><strong>วันที่เสนอ:</strong> {formatThaiDate(doc.submissionDate)}</p>
                {doc.notes && <p className="text-sm text-gray-700 bg-gray-100 p-2 rounded"><strong>หมายเหตุ:</strong> {doc.notes}</p>}
                
                <div className="flex justify-end space-x-2 pt-2">
                    {confirmDelete ? (
                        <>
                            <button onClick={handleDeleteClick} className="px-3 py-1 bg-red-600 text-white rounded-md text-sm">ยืนยันลบ</button>
                            <button onClick={() => setConfirmDelete(false)} className="px-3 py-1 bg-gray-300 rounded-md text-sm">ยกเลิก</button>
                        </>
                    ) : (
                         <>
                            <button onClick={() => onEdit(doc)} className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600">แก้ไข</button>
                            <button onClick={handleDeleteClick} className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600">ลบ</button>
                         </>
                    )}
                </div>
            </div>
        </div>
    );
};


const DocumentList: React.FC<DocumentListProps> = ({ documents, title, onEdit, onDelete }) => {
    if (documents.length === 0) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">{title}</h2>
                <p>ไม่พบเอกสาร</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">{title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {documents.map(doc => (
                    <DocumentItem key={doc.id} doc={doc} onEdit={onEdit} onDelete={onDelete} />
                ))}
            </div>
        </div>
    );
};

export default DocumentList;
