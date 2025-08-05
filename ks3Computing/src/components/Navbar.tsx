import React from 'react';
import type { Page } from '../types/types';
import { navItems } from '../data/pages';

interface NavbarProps {
    activePage: Page;
    setActivePage: (page: Page) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activePage, setActivePage }) => {

    return (
        <nav className="bg-slate-800 flex justify-center flex-wrap">
            {navItems.map(item => (
                <button
                    key={item.id}
                    onClick={() => setActivePage(item.id)}
                    className={`flex-1 min-w-[150px] p-4 text-white font-semibold text-lg cursor-pointer transition-all duration-300
                        ${activePage === item.id ? 'bg-red-500' : 'bg-slate-700 hover:bg-blue-600'}`}
                >
                    {item.title}
                </button>
            ))}
        </nav>
    );
};

export default Navbar;