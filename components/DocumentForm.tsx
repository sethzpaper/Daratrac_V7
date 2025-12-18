
import React, { useState, useEffect } from 'react';
import { Document, Status, DirectorStatus } from '../types';
import { DEPARTMENT_GROUPS, defaultConfig } from '../constants';

interface DocumentFormProps {
    onSave: (doc: Omit<Document, 'id' | 'docNumber'>) => void;
    onCancel: () => void;
    initialData?: Document | null;
}

const DocumentForm: React.FC<DocumentFormProps> = ({ onSave, onCancel, initialData }) => {
    const [formData, setFormData] = useState<Omit<Document, 'id' | 'docNumber'>>({
        submissionDate: new Date().toISOString().split('T')[0],
        proposer: '',
        departmentGroup: DEPARTMENT_GROUPS[0],
        objective: '',
        statusDept1: Status.Pending,
        statusDept2: Status.Pending,
        statusDept3: Status.Pending,
        statusDept4: Status.Pending,
        directorStatus: DirectorStatus.InProgress,
        notes: '',
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                submissionDate: new Date(initialData.submissionDate).toISOString().split('T')[0],
            });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        // Add a small delay to show loading state
        setTimeout(() => {
            onSave(formData);
            setIsSaving(false);
        }, 500);
    };

    const statusOptions = Object.values(Status).map(s => <option key={s} value={s}>{s}</option>);
    const directorStatusOptions = Object.values(DirectorStatus).map(s => <option key={s} value={s}>{s}</option>);

    const renderStatusSelect = (id: string, name: keyof Omit<Document, 'id' | 'docNumber'>, label: string) => (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
            <select id={id} name={name} value={formData[name] as string} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                {statusOptions}
            </select>
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg space-y-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800">{initialData ? 'แก้ไขเอกสาร' : 'เพิ่มเอกสารใหม่'}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="submissionDate" className="block text-sm font-medium text-gray-700">วันที่เสนอ</label>
                    <input type="date" id="submissionDate" name="submissionDate" value={formData.submissionDate} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="proposer" className="block text-sm font-medium text-gray-700">ชื่อผู้เสนอ</label>
                    <input type="text" id="proposer" name="proposer" value={formData.proposer} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="departmentGroup" className="block text-sm font-medium text-gray-700">กลุ่มสาระ</label>
                    <select id="departmentGroup" name="departmentGroup" value={formData.departmentGroup} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                        {DEPARTMENT_GROUPS.map(group => <option key={group} value={group}>{group}</option>)}
                    </select>
                </div>
                <div className="md:col-span-2">
                    <label htmlFor="objective" className="block text-sm font-medium text-gray-700">วัตถุประสงค์</label>
                    <input type="text" id="objective" name="objective" value={formData.objective} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>
            </div>

            <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">สถานะการตรวจสอบ</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {renderStatusSelect('statusDept1', 'statusDept1', defaultConfig.department_1_name)}
                    {renderStatusSelect('statusDept2', 'statusDept2', defaultConfig.department_2_name)}
                    {renderStatusSelect('statusDept3', 'statusDept3', defaultConfig.department_3_name)}
                    {renderStatusSelect('statusDept4', 'statusDept4', defaultConfig.department_4_name)}
                    
                    <div>
                        <label htmlFor="directorStatus" className="block text-sm font-medium text-gray-700">สถานะ {defaultConfig.director_name}</label>
                        <select id="directorStatus" name="directorStatus" value={formData.directorStatus} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                            {directorStatusOptions}
                        </select>
                    </div>
                </div>
            </div>
            
            <div className="border-t pt-6">
                 <label htmlFor="notes" className="block text-sm font-medium text-gray-700">หมายเหตุ (รวมข้อความแก้ไข)</label>
                 <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">ยกเลิก</button>
                <button type="submit" disabled={isSaving} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-green-300 flex items-center">
                    {isSaving && <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>}
                    {isSaving ? 'กำลังบันทึก...' : 'บันทึกเอกสาร'}
                </button>
            </div>
        </form>
    );
};

export default DocumentForm;
