// DragStage.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import GameButton from './GameButton';

// --- TYPE DEFINITIONS ---
type DragLevel = 'open' | 'simple' | 'zigzag' | 'narrow' | 'maze';

interface DragDropStageProps {
  onComplete: (time: number) => void;
  onRestart: () => void;
}

const DragDropStage: React.FC<DragDropStageProps> = ({ onComplete, onRestart }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [level, setLevel] = useState<DragLevel>('open');
  const [isDragging, setIsDragging] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState<number>(0);
  const [message, setMessage] = useState('Drag the duck to the pond!');
  const [duckPos, setDuckPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [goalPos, setGoalPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const levels: DragLevel[] = ['open', 'simple', 'zigzag', 'narrow', 'maze'];

  useEffect(() => {
    const timer = setInterval(() => {
      if (startTime) {
        setElapsed((Date.now() - startTime) / 1000);
      }
    }, 100);
    return () => clearInterval(timer);
  }, [startTime]);

  const drawWalls = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.fillStyle = '#8b5cf6';
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 30;
    ctx.lineCap = 'round';

    switch (level) {
      case 'open':
        // No walls
        break;
      case 'simple':
        // Single wall in the middle
        ctx.fillRect(w * 0.4, h * 0.2, 30, h * 0.6);
        break;
      case 'zigzag':
        // Zigzag pattern
        ctx.fillRect(w * 0.3, h * 0.1, 30, h * 0.4);
        ctx.fillRect(w * 0.6, h * 0.5, 30, h * 0.4);
        break;
      case 'narrow':
        // More complex narrow passages
        ctx.fillRect(w * 0.25, h * 0.1, 30, h * 0.3);
        ctx.fillRect(w * 0.25, h * 0.6, 30, h * 0.3);
        ctx.fillRect(w * 0.65, h * 0.1, 30, h * 0.3);
        ctx.fillRect(w * 0.65, h * 0.6, 30, h * 0.3);
        ctx.fillRect(w * 0.45, h * 0.1, 30, h * 0.25);
        ctx.fillRect(w * 0.45, h * 0.65, 30, h * 0.25);
        break;
      case 'maze':
        // Much more complex maze
        ctx.fillRect(w * 0.15, 0, 30, h * 0.4);
        ctx.fillRect(w * 0.35, h * 0.25, 30, h * 0.4);
        ctx.fillRect(w * 0.55, 0, 30, h * 0.35);
        ctx.fillRect(w * 0.75, h * 0.5, 30, h * 0.5);
        ctx.fillRect(w * 0.25, h * 0.7, w * 0.4, 30);
        ctx.fillRect(w * 0.05, h * 0.6, w * 0.2, 30);
        break;
    }
  }, [level]);

  const isPointInWall = useCallback((x: number, y: number, w: number, h: number): boolean => {
    const duckRadius = 25;
    
    // Check collision geometrically instead of using pixel detection
    switch (level) {
      case 'open':
        return false;
      case 'simple':
        return x + duckRadius > w * 0.4 && x - duckRadius < w * 0.4 + 30 && 
               y + duckRadius > h * 0.2 && y - duckRadius < h * 0.8;
      case 'zigzag':
        return (x + duckRadius > w * 0.3 && x - duckRadius < w * 0.3 + 30 && 
                y + duckRadius > h * 0.1 && y - duckRadius < h * 0.5) ||
               (x + duckRadius > w * 0.6 && x - duckRadius < w * 0.6 + 30 && 
                y + duckRadius > h * 0.5 && y - duckRadius < h * 0.9);
      case 'narrow':
        return (x + duckRadius > w * 0.25 && x - duckRadius < w * 0.25 + 30 && 
                y + duckRadius > h * 0.1 && y - duckRadius < h * 0.4) ||
               (x + duckRadius > w * 0.25 && x - duckRadius < w * 0.25 + 30 && 
                y + duckRadius > h * 0.6 && y - duckRadius < h * 0.9) ||
               (x + duckRadius > w * 0.65 && x - duckRadius < w * 0.65 + 30 && 
                y + duckRadius > h * 0.1 && y - duckRadius < h * 0.4) ||
               (x + duckRadius > w * 0.65 && x - duckRadius < w * 0.65 + 30 && 
                y + duckRadius > h * 0.6 && y - duckRadius < h * 0.9) ||
               (x + duckRadius > w * 0.45 && x - duckRadius < w * 0.45 + 30 && 
                y + duckRadius > h * 0.1 && y - duckRadius < h * 0.35) ||
               (x + duckRadius > w * 0.45 && x - duckRadius < w * 0.45 + 30 && 
                y + duckRadius > h * 0.65 && y - duckRadius < h * 0.9);
      case 'maze':
        return ( // Wall 1: vertical left
                (x + duckRadius > w * 0.15 && x - duckRadius < w * 0.15 + 30 &&
                y + duckRadius > 0 && y - duckRadius < h * 0.4) ||

                // Wall 2: vertical mid
                (x + duckRadius > w * 0.35 && x - duckRadius < w * 0.35 + 30 &&
                y + duckRadius > h * 0.25 && y - duckRadius < h * 0.65) ||

                // Wall 3: vertical right-top
                (x + duckRadius > w * 0.55 && x - duckRadius < w * 0.55 + 30 &&
                y + duckRadius > 0 && y - duckRadius < h * 0.35) ||

                // Wall 4: vertical right-bottom
                (x + duckRadius > w * 0.75 && x - duckRadius < w * 0.75 + 30 &&
                y + duckRadius > h * 0.5 && y - duckRadius < h * 1.0) ||

                // Wall 5: horizontal mid-bottom
                (x + duckRadius > w * 0.25 && x - duckRadius < w * 0.25 + w * 0.4 &&
                y + duckRadius > h * 0.7 && y - duckRadius < h * 0.7 + 30) ||

                // Wall 6: horizontal left-bottom
                (x + duckRadius > w * 0.05 && x - duckRadius < w * 0.05 + w * 0.2 &&
                y + duckRadius > h * 0.6 && y - duckRadius < h * 0.6 + 30)
              );

      default:
        return false;
    }
  }, [level]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const parent = canvas.parentElement;
    if (parent) {
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
    }

    const w = canvas.width;
    const h = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, w, h);

    // Set positions for this level
    const newStartPos = { x: w * 0.1, y: h * 0.5 };
    const newGoalPos = { x: w * 0.85, y: h * 0.5 };

    if (startPos.x !== newStartPos.x || startPos.y !== newStartPos.y) {
      setStartPos(newStartPos);
      setDuckPos(newStartPos);
    }
    if (goalPos.x !== newGoalPos.x || goalPos.y !== newGoalPos.y) {
      setGoalPos(newGoalPos);
    }

    // Draw walls
    drawWalls(ctx, w, h);

    // Draw pond (goal)
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(goalPos.x, goalPos.y, 75, 0, 2 * Math.PI);
    ctx.fill();
    
    // Add pond label
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    // ctx.fillText('POND', goalPos.x, goalPos.y);

    // Draw duck emoji
    ctx.font = '50px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🐥', duckPos.x, duckPos.y);

  }, [duckPos, startPos, goalPos, drawWalls]);

  useEffect(() => {
    draw();
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, [draw]);

  const isPointNear = (x1: number, y1: number, x2: number, y2: number, radius = 30) => {
    return Math.hypot(x2 - x1, y2 - y1) < radius;
  };

  const resetDuckToStart = () => {
    setDuckPos(startPos);
    setIsDragging(false);
    setMessage('Oops! The duck hit a wall and flew back. Try again!');
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isPointNear(x, y, duckPos.x, duckPos.y)) {
      setIsDragging(true);
      if (!startTime) setStartTime(Date.now());
      setMessage('Dragging the duck! Avoid the purple walls.');
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if new position would hit a wall
    if (isPointInWall(x, y, canvas.width, canvas.height)) {
      resetDuckToStart();
      return;
    }

    // Update duck position
    setDuckPos({ x, y });

    // Check if reached goal area (but don't complete until mouse up)
    if (isPointNear(x, y, goalPos.x, goalPos.y, 60)) {
      setMessage('Great! Now drop the duck in the pond to complete the level!');
    } else {
      setMessage('Keep going! Drag the duck to the middle of the pond.');
    }
  };

  const handleMouseUp = () => {
    if (isDragging && isPointNear(duckPos.x, duckPos.y, goalPos.x, goalPos.y, 60)) {
      // Duck was dropped in the pond - complete level
      const timeTaken = (Date.now() - (startTime ?? Date.now())) / 1000;
      const currentIndex = levels.indexOf(level);
      if (currentIndex < levels.length - 1) {
        setLevel(levels[currentIndex + 1]);
        setIsDragging(false);
        setDuckPos(startPos);
        setMessage('Great! Level complete. Try the next one!');
      } else {
        onComplete(timeTaken);
      }
    } else {
      setIsDragging(false);
      if (!isPointNear(duckPos.x, duckPos.y, goalPos.x, goalPos.y, 60)) {
        setMessage('Click and drag the duck to the pond, then drop it!');
      }
    }
  };

  return (
    <div className="w-full h-[60vh] flex flex-col items-center justify-center p-4">
      <h3 className="text-2xl font-bold text-slate-700 mb-2">Stage 3: Duck Dragging</h3>
      <p className="text-lg text-slate-500 mb-2 bg-yellow-100 p-2 rounded-lg">{message}</p>
      <div className="mb-2 text-lg font-semibold text-slate-700">Time: {elapsed.toFixed(1)}s</div>
      <div className="mb-2 text-md text-slate-600">
        Level: {levels.indexOf(level) + 1} of {levels.length} - {level.charAt(0).toUpperCase() + level.slice(1)}
      </div>
      <div className="w-full h-full border-4 border-slate-300 rounded-lg overflow-hidden">
        <canvas 
          ref={canvasRef} 
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="w-full h-full bg-slate-50 cursor-pointer" 
        />
      </div>
      <GameButton onClick={onRestart} className="mt-4">Restart Game</GameButton>
    </div>
  );
};

export default DragDropStage;