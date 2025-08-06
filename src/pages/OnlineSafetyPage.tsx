import { useState } from 'react';

import GameButton from '../components/GameButton';
import SocialCreditGame from '../components/SocialCreditGame';
import PhishingGame from '../components/PhishingGame';

// --- MAIN PAGE COMPONENT ---
// This is the new landing page for the Online Safety section.

const OnlineSafetyPage = () => {
    // --- TYPE DEFINITIONS ---
    type GameSelection = 'intro' | 'socialCredit' | 'phishing';

    // --- STATE MANAGEMENT ---
    const [game, setGame] = useState<GameSelection>('intro');

    const renderContent = () => {
        switch (game) {
            case 'intro':
                return (
                    <div className="text-center p-8">
                        <h2 className="text-4xl font-bold text-slate-800 mb-4">Online Safety Hub</h2>
                        <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                           Staying safe online is a vital skill. These activities will help you think critically about your digital footprint and online interactions.
                        </p>
                        <div className="flex flex-col md:flex-row justify-center gap-6">
                            <GameButton onClick={() => setGame('socialCredit')}>The Social Credit Game</GameButton>
                            <GameButton onClick={() => setGame('phishing')}>Spot the Phish!</GameButton>
                        </div>
                    </div>
                );
            case 'socialCredit':
                return <SocialCreditGame onExit={() => setGame('intro')} />;
            case 'phishing':
                return <PhishingGame onExit={() => setGame('intro')} />;
        }
    };

    return (
        <div className="w-full bg-slate-100 p-4 rounded-lg shadow-inner min-h-[85vh] flex flex-col items-center justify-center">
            {renderContent()}
        </div>
    );
};

export default OnlineSafetyPage;
