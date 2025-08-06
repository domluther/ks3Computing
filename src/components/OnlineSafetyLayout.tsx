// OnlineSafetyLayout.tsx
import React from 'react';
import { useNavigate, useLocation, Outlet } from '@tanstack/react-router';
import GameButton from './GameButton';

const OnlineSafetyLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Show intro page if we're at the base Online Safety route
    if (location.pathname === '/online-safety') {
        return (
            <div className="w-full bg-slate-100 p-4 rounded-lg shadow-inner min-h-[85vh] flex flex-col items-center justify-center">
                <div className="text-center p-8">
                    <h2 className="text-4xl font-bold text-slate-800 mb-4">Online Safety Hub</h2>
                    <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                        Staying safe online is a vital skill. These activities will help you think critically about your digital footprint and online interactions.
                    </p>
                    <div className="flex flex-col md:flex-row justify-center gap-6">
                        <GameButton onClick={() => navigate({ to: '/online-safety/social-credit' as any })}>
                            The Social Credit Game
                        </GameButton>
                        <GameButton onClick={() => navigate({ to: '/online-safety/phishing' as any })}>
                            Spot the Phish!
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

export default OnlineSafetyLayout;
