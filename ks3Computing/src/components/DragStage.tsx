// DraggingStage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import GameButton from './GameButton';

interface DragStageProps {
  onComplete: (time: number) => void;
  onRestart: () => void;
}

const DragStage: React.FC<DragStageProps> = ({ onComplete, onRestart }) => {
  const [ducks, setDucks] = useState<{ id: number; x: number; y: number }[]>([]);
  const [pondPos, setPondPos] = useState({ x: 45, y: 40 });
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState<number>(0);

  const generateDucks = useCallback(() => {
    const newDucks = [];
    for (let i = 0; i < 10; i++) {
      newDucks.push({
        id: i,
        x: Math.random() * 85,
        y: Math.random() * 80,
      });
    }
    setDucks(newDucks);
    setStartTime(Date.now());
  }, []);

  useEffect(() => {
    generateDucks();
    const interval = setInterval(() => {
      setPondPos({ x: 30 + Math.random() * 40, y: 30 + Math.random() * 40 });
    }, 2500); // moves more frequently
    return () => clearInterval(interval);
  }, [generateDucks]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (startTime) {
        setElapsed((Date.now() - startTime) / 1000);
      }
    }, 100);
    return () => clearInterval(timer);
  }, [startTime]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: number) => {
    e.dataTransfer.setData('duckId', id.toString());
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const duckId = parseInt(e.dataTransfer.getData('duckId'));
    const newDucks = ducks.filter(d => d.id !== duckId);
    setDucks(newDucks);
    e.currentTarget.classList.remove('bg-cyan-300');
    if (newDucks.length === 0) {
      const endTime = Date.now();
      const timeTaken = (endTime - (startTime ?? endTime)) / 1000;
      onComplete(timeTaken);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-cyan-300');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-cyan-300');
  };

  return (
    <div className="w-full h-[60vh] flex flex-col items-center p-4">
      <h3 className="text-2xl font-bold text-slate-700 mb-2">Stage 3: Drag and Drop</h3>
      <p className="text-lg text-slate-500 mb-2 bg-yellow-100 p-2 rounded-lg">Drag all the ducks to the pond!</p>
      <div className="mb-2 text-lg font-semibold text-slate-700">Time: {elapsed.toFixed(1)}s</div>
      <div className="w-full h-full border-4 border-slate-300 rounded-lg relative bg-green-200 overflow-hidden">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className="absolute w-48 h-48 bg-blue-400 rounded-full transition-all duration-1000"
          style={{ left: `${pondPos.x}%`, top: `${pondPos.y}%` }}
        ></div>
        {ducks.map(duck => (
          <div
            key={duck.id}
            draggable
            onDragStart={(e) => handleDragStart(e, duck.id)}
            className="absolute text-5xl cursor-grab active:cursor-grabbing"
            style={{ left: `${duck.x}%`, top: `${duck.y}%` }}
          >
            🦆
          </div>
        ))}
      </div>
      <GameButton onClick={onRestart} className="mt-4">Restart Game</GameButton>
    </div>
  );
};

export default DragStage;
