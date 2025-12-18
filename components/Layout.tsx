
import React, { useState, useEffect } from 'react';
import { View } from '../types';
import Sidebar from './Sidebar';
import { defaultConfig } from '../constants';
import { MenuIcon, PlusIcon } from './icons';

interface LayoutProps {
    children: React.ReactNode;
    onMenuClick: (view: View) => void;
    onAddDocument: () => void;
    activeView: View;
    documentDates: string[];
}

const Layout: React.FC<LayoutProps> = ({ children, onMenuClick, onAddDocument, activeView, documentDates }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setIsSidebarOpen(true);
            } else {
                setIsSidebarOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <Sidebar 
                isOpen={isSidebarOpen} 
                onMenuClick={onMenuClick} 
                activeView={activeView}
                documentDates={documentDates}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="flex justify-between items-center p-4 bg-white border-b">
                    <button onClick={toggleSidebar} className="text-gray-500 focus:outline-none focus:text-gray-700">
                        <MenuIcon className="h-6 w-6" />
                    </button>
                    <h1 className="text-xl font-semibold text-gray-700">{defaultConfig.system_title}</h1>
                    <button 
                        onClick={onAddDocument} 
                        className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                    >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        เพิ่มเอกสาร
                    </button>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-6">
                    <div className="container mx-auto">
                        {children}
                    </div>
                </main>
                <footer className="bg-white p-4 border-t text-center text-sm text-gray-600">
                    <div className="relative">
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"></div>
                        <p className="pt-4">{defaultConfig.footer_text}</p>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Layout;
