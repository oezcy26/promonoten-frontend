
import React from 'react';
import { Page } from '../types';
import { Icons } from '../constants';

interface SidebarProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

// Fixed NavLink by properly typing it and moving it outside to handle React's reserved props like 'key' correctly.
interface NavLinkProps {
  item: {
    id: Page;
    label: string;
    icon: React.FC;
  };
  isActive: boolean;
  onClick: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ item, isActive, onClick }) => {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
        isActive
          ? 'bg-blue-600 text-white shadow-md'
          : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
      }`}
    >
      <Icon />
      <span className="font-medium">{item.label}</span>
    </button>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange }) => {
  const navItems = [
    { id: Page.NOTEN_EINFUEGEN, label: 'Noten Einfügen', icon: Icons.Grade },
    { id: Page.MAILS_GENERIEREN, label: 'Mails Generieren', icon: Icons.Mail },
  ];

  const bottomItems = [
    { id: Page.SCHUELER_EINFUEGEN, label: 'Schüler einfügen', icon: Icons.Student },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">L</div>
          Assist
        </h1>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink 
            key={item.id} 
            item={item} 
            isActive={currentPage === item.id}
            onClick={() => onPageChange(item.id)}
          />
        ))}

        <div className="py-4">
          <div className="border-t border-gray-100" />
        </div>

        {bottomItems.map((item) => (
          <NavLink 
            key={item.id} 
            item={item} 
            isActive={currentPage === item.id}
            onClick={() => onPageChange(item.id)}
          />
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="bg-blue-50 p-4 rounded-xl">
          <p className="text-xs text-blue-600 font-semibold mb-1 uppercase tracking-wider">Status</p>
          <p className="text-sm text-blue-900">Verbunden mit Gemini AI</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
