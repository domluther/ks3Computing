// ITSkillsGame.tsx
import React, { useState } from 'react';

import FileSimulation from '../components/FileSimulation';
import GameButton from '../components/GameButton';
import MouseSkillsChallenge from '../components/MouseSkillsChallenge';

// --- TYPE DEFINITIONS ---
// For the main game router
type GameSelection = 'intro' | 'mouseSkills' | 'fileSim';

const ITSkillsGame: React.FC = () => {
    const [game, setGame] = useState<GameSelection>('intro');

    const renderContent = () => {
        switch (game) {
            case 'intro':
                return (
                    <div className="text-center p-8">
                        <h2 className="text-4xl font-bold text-slate-800 mb-4">IT Skills Hub</h2>
                        <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                            Welcome! Choose an activity below to practice your IT skills.
                        </p>
                        <div className="flex justify-center gap-8">
                            <GameButton onClick={() => setGame('mouseSkills')}>Mouse Skills Challenge</GameButton>
                            <GameButton onClick={() => setGame('fileSim')}>File & Folder Simulation</GameButton>
                        </div>
                    </div>
                );
            case 'mouseSkills':
                return <MouseSkillsChallenge />;
            case 'fileSim':
                return <FileSimulation onExit={() => setGame('intro')} />;
        }
    };

    return (
        <div className="w-full bg-slate-100 p-4 rounded-lg shadow-inner min-h-[85vh] flex flex-col items-center justify-center">
            {renderContent()}
        </div>
    );
};

export default ITSkillsGame;
