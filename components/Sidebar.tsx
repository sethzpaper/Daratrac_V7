
import React from 'react';
import { View } from '../types';
import { HomeIcon, PlusIcon, TableIcon, ChartIcon, LightBulbIcon, BookOpenIcon, ViewGridIcon } from './icons';
import Calendar from './Calendar';

interface SidebarProps {
    isOpen: boolean;
    onMenuClick: (view: View) => void;
    activeView: View;
    documentDates: string[];
}

// FIX: Define an interface for menu items to ensure `item.view` is strongly typed as `View`, preventing type errors when calling `onMenuClick`.
interface MenuItem {
    view: View;
    text: string;
    icon: React.FC<{className?: string}>;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onMenuClick, activeView, documentDates }) => {
    const menuItems: MenuItem[] = [
        { view: 'home', text: 'หน้าหลัก', icon: HomeIcon },
        { view: 'form', text: 'เพิ่มเอกสาร', icon: PlusIcon },
        { view: 'all-documents', text: 'รายการทั้งหมด', icon: TableIcon },
        { view: 'dashboard', text: 'Dashboard', icon: ChartIcon },
        { view: 'proposals', text: 'ข้อเสนอพัฒนา', icon: LightBulbIcon },
        { view: 'manual', text: 'คู่มือ', icon: BookOpenIcon },
        { view: 'app-views', text: 'App Views', icon: ViewGridIcon },
    ];
    
    return (
        <aside className={`bg-[#283148] text-gray-300 transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'} flex flex-col flex-shrink-0`}>
            <div className="sidebar-header p-4 flex items-center justify-center h-20 border-b border-gray-700">
                <img 
                    src="https://www.spk.ac.th/home/wp-content/uploads/2022/10/spk-logo-png-new-1.png"
                    alt="Logo"
                    className={`transition-all duration-300 ${isOpen ? 'h-12' : 'h-10'}`}
                />
            </div>
            <nav className="flex-1 mt-4">
                <ul>
                    {menuItems.map(item => (
                        <li key={item.view}>
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onMenuClick(item.view);
                                }}
                                className={`flex items-center p-4 my-1 mx-2 rounded-lg transition-colors duration-200 hover:bg-gray-700 hover:text-white ${activeView === item.view ? 'bg-blue-600 text-white' : ''}`}
                            >
                                <item.icon className="h-6 w-6" />
                                <span className={`ml-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>{item.text}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className={`p-4 border-t border-gray-700 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 h-0 invisible'}`}>
                {isOpen && <Calendar documentDates={documentDates} />}
            </div>
        </aside>
    );
};

export default Sidebar;
