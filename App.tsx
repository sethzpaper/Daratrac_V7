
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import DocumentForm from './components/DocumentForm';
import DocumentList from './components/DocumentList';
import { Document, View } from './types';
import { getDocuments, saveDocument, deleteDocument } from './services/googleScriptService';
import { DEPARTMENT_GROUPS } from './constants';
import DocumentTable from './components/DocumentTable';

const App: React.FC = () => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [currentView, setCurrentView] = useState<View>('home');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingDocument, setEditingDocument] = useState<Document | null>(null);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [groupFilter, setGroupFilter] = useState<string>('all');
    const [monthFilter, setMonthFilter] = useState<string>('all');
    
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    const fetchDocuments = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getDocuments();
            setDocuments(data.sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime()));
        } catch (err: any) {
            setError('ไม่สามารถโหลดข้อมูลเอกสารได้: ' + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);

    const handleMenuClick = (view: View) => {
        setCurrentView(view);
        setEditingDocument(null);
        if (view !== 'home' && isSearching) {
            setIsSearching(false);
            setSearchTerm('');
        }
    };

    const handleAddDocument = () => {
        setEditingDocument(null);
        setCurrentView('form');
    };

    const handleEditDocument = (doc: Document) => {
        setEditingDocument(doc);
        setCurrentView('form');
    };

    const handleDeleteDocument = async (id: string) => {
        try {
            await deleteDocument(id);
            await fetchDocuments(); // โหลดข้อมูลใหม่หลังลบ
        } catch (err: any) {
            setError('ไม่สามารถลบเอกสารได้: ' + err.message);
            console.error(err);
        }
    };

    const handleSaveDocument = async (doc: Omit<Document, 'id' | 'docNumber'>) => {
        try {
            let docToSave: Document | Omit<Document, 'id' | 'docNumber'>;
            
            if (editingDocument) {
                // ถ้าเป็นการแก้ไข ส่งข้อมูลทั้งหมดพร้อม id ไป
                docToSave = { ...editingDocument, ...doc };
            } else {
                // ถ้าเป็นเอกสารใหม่ ส่งแค่ข้อมูลจากฟอร์ม
                // Backend จะจัดการสร้าง id และ docNumber เอง
                docToSave = doc;
            }

            await saveDocument(docToSave);
            await fetchDocuments(); // โหลดข้อมูลใหม่หลังบันทึก
            setCurrentView('home');
            setEditingDocument(null);
        } catch (err: any) {
            setError('ไม่สามารถบันทึกเอกสารได้: ' + err.message);
            console.error(err);
        }
    };
    
    const handleSearch = (term: string) => {
        setSearchTerm(term);
        setIsSearching(term !== '');
        setCurrentPage(1);
        setCurrentView('home');
    };

    const filteredDocuments = useMemo(() => {
        return documents.filter(doc => {
            const searchTermLower = searchTerm.toLowerCase();
            const searchMatch = searchTerm
                ? doc.objective.toLowerCase().includes(searchTermLower) ||
                  doc.proposer.toLowerCase().includes(searchTermLower) ||
                  doc.departmentGroup.toLowerCase().includes(searchTermLower)
                : true;

            const groupMatch = groupFilter !== 'all' ? doc.departmentGroup === groupFilter : true;
            
            const monthMatch = monthFilter !== 'all' 
                ? (new Date(doc.submissionDate).getMonth() + 1).toString() === monthFilter 
                : true;

            return searchMatch && groupMatch && monthMatch;
        });
    }, [documents, searchTerm, groupFilter, monthFilter]);

    const paginatedDocuments = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredDocuments.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredDocuments, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);

    const renderContent = () => {
        if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div></div>;
        if (error) return <div className="text-center text-red-500 p-4 bg-red-100 rounded-md">{error}</div>;

        switch (currentView) {
            case 'dashboard':
                return <Dashboard documents={documents} />;
            case 'form':
                return <DocumentForm 
                    onSave={handleSaveDocument} 
                    onCancel={() => { setCurrentView('home'); setEditingDocument(null); }} 
                    initialData={editingDocument}
                />;
            case 'all-documents':
                 return <DocumentTable
                    documents={documents}
                    onEdit={handleEditDocument}
                    onDelete={handleDeleteDocument}
                 />;
            case 'home':
            default:
                return (
                    <div>
                        <div className="bg-yellow-100 border-2 border-orange-400 rounded-lg p-4 mb-6 shadow-lg">
                            <div className="flex flex-col md:flex-row gap-2">
                                <input
                                    type="text"
                                    placeholder="ค้นหาตามวัตถุประสงค์, กลุ่มสาระ, ผู้เสนอ..."
                                    className="flex-grow p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch(e.currentTarget.value)}
                                />
                                <button
                                    onClick={() => handleSearch(searchTerm)}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-md shadow-md border-b-4 border-orange-600 hover:border-orange-700 transition duration-150 transform hover:scale-105"
                                >
                                    ค้นหา
                                </button>
                            </div>
                        </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label htmlFor="groupFilter" className="block text-sm font-medium text-gray-700 mb-1">กรองตามกลุ่มสาระ</label>
                                <select 
                                    id="groupFilter"
                                    value={groupFilter} 
                                    onChange={(e) => { setGroupFilter(e.target.value); setCurrentPage(1); }}
                                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                >
                                    <option value="all">ทั้งหมด</option>
                                    {DEPARTMENT_GROUPS.map(group => <option key={group} value={group}>{group}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="monthFilter" className="block text-sm font-medium text-gray-700 mb-1">กรองตามเดือน</label>
                                <select 
                                    id="monthFilter"
                                    value={monthFilter} 
                                    onChange={(e) => { setMonthFilter(e.target.value); setCurrentPage(1); }}
                                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                >
                                    <option value="all">ทั้งหมด</option>
                                    {Array.from({length: 12}, (_, i) => 
                                        <option key={i+1} value={i+1}>
                                            {new Date(0, i).toLocaleString('th-TH', { month: 'long' })}
                                        </option>
                                    )}
                                </select>
                            </div>
                        </div>

                        <DocumentList
                            documents={paginatedDocuments}
                            title={isSearching ? 'ผลการค้นหา' : 'เอกสารล่าสุด'}
                            onEdit={handleEditDocument}
                            onDelete={handleDeleteDocument}
                        />

                        {totalPages > 1 && (
                            <div className="flex justify-center items-center mt-6 space-x-2">
                                <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50">ก่อนหน้า</button>
                                <span>หน้า {currentPage} จาก {totalPages}</span>
                                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages} className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50">ถัดไป</button>
                            </div>
                        )}
                    </div>
                );
        }
    };
    
    const documentDates = useMemo(() => documents.map(doc => doc.submissionDate), [documents]);

    return (
        <Layout
            onMenuClick={handleMenuClick}
            onAddDocument={handleAddDocument}
            activeView={currentView}
            documentDates={documentDates}
        >
            {renderContent()}
        </Layout>
    );
};

export default App;
