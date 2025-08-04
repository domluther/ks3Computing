// MouseSkillsGame.tsx
import React, { useState } from 'react';
import TraceStage from '../components/TraceStage';
import ClickStage from '../components/ClickStage';
import DragStage from '../components/DragStage';
import GameButton from '../components/GameButton';
import DragDropStage from '../components/DragDropStage';

// --- TYPE DEFINITIONS ---
type GameStage = 'intro' | 'tracing' | 'clicking' | 'dragging' | 'dragDropping' |'results';

interface TimeRecord {
  tracing: number | null;
  clicking: number | null;
  dragging: number | null;
  dragDropping: number | null;
}

const MouseSkillsGame: React.FC = () => {
  const [stage, setStage] = useState<GameStage>('intro');
  const [times, setTimes] = useState<TimeRecord>({ tracing: null, clicking: null, dragging: null, dragDropping: null });

  const handleTraceComplete = (time: number) => {
    setTimes(prev => ({ ...prev, tracing: time }));
    setStage('clicking');
  };

  const handleClickComplete = (time: number) => {
    setTimes(prev => ({ ...prev, clicking: time }));
    setStage('dragging');
  };

  const handleDragComplete = (time: number) => {
    setTimes(prev => ({ ...prev, dragging: time }));
    setStage('dragDropping');
  };

  const handleDragDropComplete = (time: number) => {
    setTimes(prev => ({ ...prev, dragDropping: time }));
    setStage('results');
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
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              Get ready to test your mouse skills! This game has three stages to help you practice tracing, clicking, and dragging. Click the button below to start.
            </p>
            <GameButton onClick={() => setStage('tracing')}>Start Game</GameButton>
          </div>
        );
      case 'tracing':
        return <TraceStage onComplete={handleTraceComplete} onRestart={resetGame} />;
      case 'clicking':
        return <ClickStage onComplete={handleClickComplete} onRestart={resetGame} />;
      case 'dragging':
        return <DragStage onComplete={handleDragComplete} onRestart={resetGame} />;
      case 'dragDropping':
        return <DragDropStage onComplete={handleDragDropComplete} onRestart={resetGame} />;
      case 'results':
        return (
          <div className="text-center p-8">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">🏆 Well Done! 🏆</h2>
            <p className="text-lg text-slate-600 mb-8">You completed all the stages. Here are your times:</p>
            <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto space-y-3 text-left">
              <div className="flex justify-between text-xl"><span className="font-bold">1. Tracing:</span> <span>{times.tracing?.toFixed(2)} seconds</span></div>
              <div className="flex justify-between text-xl"><span className="font-bold">2. Clicking:</span> <span>{times.clicking?.toFixed(2)} seconds</span></div>
              <div className="flex justify-between text-xl"><span className="font-bold">3. Dragging:</span> <span>{times.dragging?.toFixed(2)} seconds</span></div>
              <div className="flex justify-between text-xl"><span className="font-bold">4. Drag and Drop:</span> <span>{times.dragDropping?.toFixed(2)} seconds</span></div>
            </div>
            <GameButton onClick={resetGame} className="mt-8">Play Again</GameButton>
          </div>
        );
    }
  };

  return (
    <div className="w-full bg-slate-100 p-4 rounded-lg shadow-inner min-h-[70vh]">
      {renderStage()}
    </div>
  );
};

export default MouseSkillsGame;
