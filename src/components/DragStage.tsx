// DragStage.tsx
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import GameButton from "./GameButton";

// --- TYPE DEFINITIONS ---
type DuckSpeed = "slow" | "default" | "fast";

interface DragStageProps {
	onComplete: (time: number) => void;
	onRestart: () => void;
}

interface Duck {
	id: number;
	x: number; // Starting x position
	y: number; // Starting y position
	vx: number; // velocity x
	vy: number; // velocity y
}

const DragStage: React.FC<DragStageProps> = ({ onComplete, onRestart }) => {
	const DUCK_COUNT = 15; // Number of ducks to generate

	const [ducks, setDucks] = useState<Duck[]>([]);
	const [pondPos, setPondPos] = useState({ x: 45, y: 40 });
	const [startTime, setStartTime] = useState<number | null>(null);
	const [elapsed, setElapsed] = useState<number>(0);
	const [duckSpeed, setDuckSpeed] = useState<DuckSpeed>("default");

	const generateDucks = useCallback(() => {
		const speedMultiplier =
			duckSpeed === "fast" ? 2 : duckSpeed === "slow" ? 0.5 : 1;
		const newDucks = [];
		for (let i = 0; i < DUCK_COUNT; i++) {
			// Generate 5 ducks
			newDucks.push({
				id: i,
				x: Math.random() * 85,
				y: Math.random() * 80,
				vx: (Math.random() - 0.5) * speedMultiplier, // Use speed multiplier
				vy: (Math.random() - 0.5) * speedMultiplier, // Use speed multiplier
			});
		}
		setDucks(newDucks);
		setStartTime(Date.now());
	}, [duckSpeed]);

	useEffect(() => {
		generateDucks();

		// Pond movement interval
		const pondInterval = setInterval(() => {
			setPondPos({ x: 30 + Math.random() * 40, y: 30 + Math.random() * 40 });
		}, 2000);

		// Duck movement interval
		const duckInterval = setInterval(() => {
			const speedMultiplier =
				duckSpeed === "fast" ? 2 : duckSpeed === "slow" ? 0.5 : 1;
			setDucks((prevDucks) =>
				prevDucks.map((duck) => {
					let newX = duck.x + duck.vx;
					let newY = duck.y + duck.vy;
					let newVx = duck.vx;
					let newVy = duck.vy;

					// Bounce off walls and reverse direction
					if (newX <= 0 || newX >= 85) {
						newVx = -duck.vx;
						newX = Math.max(0, Math.min(85, newX));
					}
					if (newY <= 0 || newY >= 80) {
						newVy = -duck.vy;
						newY = Math.max(0, Math.min(80, newY));
					}

					// Occasionally change direction randomly (10% chance each update)
					if (Math.random() < 0.1) {
						newVx = (Math.random() - 0.5) * speedMultiplier; // Use speed multiplier
						newVy = (Math.random() - 0.5) * speedMultiplier; // Use speed multiplier
					}

					return {
						...duck,
						x: newX,
						y: newY,
						vx: newVx,
						vy: newVy,
					};
				}),
			);
		}, 100); // Update duck positions every 100ms

		return () => {
			clearInterval(pondInterval);
			clearInterval(duckInterval);
		};
	}, [generateDucks, duckSpeed]);

	useEffect(() => {
		const timer = setInterval(() => {
			if (startTime) {
				setElapsed((Date.now() - startTime) / 1000);
			}
		}, 100);
		return () => clearInterval(timer);
	}, [startTime]);

	const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: number) => {
		e.dataTransfer.setData("duckId", id.toString());
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		const duckId = parseInt(e.dataTransfer.getData("duckId"));
		const newDucks = ducks.filter((d) => d.id !== duckId);
		setDucks(newDucks);
		e.currentTarget.classList.remove("bg-cyan-300");
		if (newDucks.length === 0) {
			const endTime = Date.now();
			const timeTaken = (endTime - (startTime ?? endTime)) / 1000;
			onComplete(timeTaken);
		}
	};

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.currentTarget.classList.add("bg-cyan-300");
	};

	const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.currentTarget.classList.remove("bg-cyan-300");
	};

	return (
		<div className="w-full h-[60vh] flex flex-col items-center p-4">
			<h3 className="text-2xl font-bold text-slate-700 mb-2">
				Stage 4: Drag and Duck
			</h3>
			<p className="text-lg text-slate-500 mb-2 bg-yellow-100 p-2 rounded-lg">
				Drag all the ducks to the pond!
			</p>
			<div className="mb-2 text-lg font-semibold text-slate-700">
				Time: {elapsed.toFixed(1)}s | Ducks remaining: {ducks.length}
			</div>
			<div className="mb-2">
				<label
					htmlFor="duck-speed"
					className="font-medium text-slate-600 mr-2"
				>
					Duck Speed:
				</label>
				<select
					id="duck-speed"
					value={duckSpeed}
					onChange={(e) => setDuckSpeed(e.target.value as DuckSpeed)}
					className="border border-slate-400 rounded px-2 py-1"
				>
					<option value="fast">Fast</option>
					<option value="default">Default</option>
					<option value="slow">Slow</option>
				</select>
			</div>
			<div className="w-full h-full border-4 border-slate-300 rounded-lg relative bg-green-200 overflow-hidden">
				<div
					role="application"
					onDrop={handleDrop}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					className="absolute w-48 h-48 bg-blue-400 rounded-full transition-all duration-1000"
					style={{ left: `${pondPos.x}%`, top: `${pondPos.y}%` }}
				></div>
				{ducks.map((duck) => (
					<div
						key={duck.id}
						draggable
						onDragStart={(e) => handleDragStart(e, duck.id)}
						className="absolute text-5xl cursor-grab active:cursor-grabbing transition-all duration-100"
						style={{
							left: `${duck.x}%`,
							top: `${duck.y}%`,
							transform: `translate(-50%, -50%)`, // Center the duck on its position
						}}
					>
						🦆
					</div>
				))}
			</div>
			<GameButton onClick={onRestart} className="mt-4">
				Restart Game
			</GameButton>
		</div>
	);
};

export default DragStage;