import React from 'react';
import type { Page } from '../types/types';

interface NavbarProps {
    activePage: Page;
    setActivePage: (page: Page) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activePage, setActivePage }) => {
    // Note: 'Programming' has been changed to 'IT Skills' as requested.
    const navItems: { id: Page; label: string; }[] = [
        { id: 'home', label: 'Home' },
        { id: 'input-output', label: 'Input & Output' },
        { id: 'networks', label: 'Networks' },
        { id: 'algorithms', label: 'Algorithms' },
        { id: 'it-skills', label: 'IT Skills' },
    ];

    return (
        <nav className="bg-slate-800 flex justify-center flex-wrap">
            {navItems.map(item => (
                <button
                    key={item.id}
                    onClick={() => setActivePage(item.id)}
                    className={`flex-1 min-w-[150px] p-4 text-white font-semibold text-lg transition-all duration-300
                        ${activePage === item.id ? 'bg-red-500' : 'bg-slate-700 hover:bg-blue-600'}`}
                >
                    {item.label}
                </button>
            ))}
        </nav>
    );
};

export default Navbar;