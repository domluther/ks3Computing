// ITSkillsLayout.tsx
import React from 'react';
import { useNavigate, useLocation, Outlet } from '@tanstack/react-router';
import GameButton from '../components/GameButton';

const ITSkillsLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Show intro page if we're at the base IT Skills route
    if (location.pathname === '/it-skills') {
        return (
            <div className="w-full bg-slate-100 p-4 rounded-lg shadow-inner min-h-[85vh] flex flex-col items-center justify-center">
                <div className="text-center p-8">
                    <h2 className="text-4xl font-bold text-slate-800 mb-4">IT Skills Hub</h2>
                    <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                        Welcome! Choose an activity below to practice your IT skills.
                    </p>
                    <div className="flex justify-center gap-8">
                        <GameButton onClick={() => navigate({ to: '/it-skills/mouse-skills' as any })}>
                            Mouse Skills Challenge
                        </GameButton>
                        <GameButton onClick={() => navigate({ to: '/it-skills/file-simulation' as any })}>
                            File & Folder Simulation
                        </GameButton>
                    </div>
                </div>
            </div>
        );
    }

    // Render child routes for sub-pages
    return (
        <div className="w-full bg-slate-100 p-4 rounded-lg shadow-inner min-h-[85vh] flex flex-col items-center justify-center">
            <Outlet />
        </div>
    );
};

export default ITSkillsLayout;
