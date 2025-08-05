import { useState } from 'react';

import ClickStage from '../components/ClickStage';
import DragStage from '../components/DragStage';
import GameButton from '../components/GameButton';
import DragDropStage from '../components/DragDropStage';
import TraceStage from '../components/TraceStage';

const MouseSkillsChallenge = () => {
    type MouseGameStage = 'intro' | 'tracing' | 'clicking' | 'dragging' | 'dragDropping' | 'results';
    interface TimeRecord { tracing: number | null; clicking: number | null; dragging: number | null; dragDropping: number | null; }

    const [stage, setStage] = useState<MouseGameStage>('intro');
    const [times, setTimes] = useState<TimeRecord>({ tracing: null, clicking: null, dragging: null, dragDropping: null });

    const handleComplete = (stageName: keyof TimeRecord, time: number, nextStage: MouseGameStage) => {
        setTimes(prev => ({ ...prev, [stageName]: time }));
        setStage(nextStage);
    };

    const resetGame = () => {
        setTimes({ tracing: null, clicking: null, dragging: null, dragDropping: null });
        setStage('intro');
    };

    const renderStage = () => {
        switch (stage) {
            case 'intro':
                return (
                    <div className="text-center p-8">
                        <h2 className="text-4xl font-bold text-slate-800 mb-4">Mouse Skills Challenge</h2>
                        <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">Get ready to test your mouse skills! This game has four stages to help you practice tracing, clicking, dragging and dropping. Click the button below to start.</p>
                        <GameButton onClick={() => setStage('dragging')}>Start Challenge</GameButton>
                    </div>
                );
            case 'tracing':
                return <TraceStage onComplete={(time) => handleComplete('tracing', time, 'clicking')} onRestart={resetGame} />;
            case 'clicking':
                return <ClickStage onComplete={(time) => handleComplete('clicking', time, 'dragging')} onRestart={resetGame} />;
            case 'dragging':
                return <DragStage onComplete={(time) => handleComplete('dragging', time, 'dragDropping')} onRestart={resetGame} />;
            case 'dragDropping':
                return <DragDropStage onComplete={(time) => handleComplete('dragDropping', time, 'results')} onRestart={resetGame} />;
            case 'results':
                return (
                    <div className="text-center p-8">
                        <h2 className="text-4xl font-bold text-slate-800 mb-4">🏆 Well Done! 🏆</h2>
                        <p className="text-lg text-slate-600 mb-8">You completed all the stages. Here are your times:</p>
                        <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto space-y-3 text-left">
                            {Object.entries(times).map(([key, value]) => (
                                <div key={key} className="flex justify-between text-xl capitalize">
                                    <span className="font-bold">{key}:</span>
                                    <span>{value?.toFixed(2)} seconds</span>
                                </div>
                            ))}
                        </div>
                        <GameButton onClick={resetGame} className="mt-8">Play Again</GameButton>
                    </div>
                );
        }
    };
    return <>{renderStage()}</>;
}

export default MouseSkillsChallenge;