// DragStage.tsx
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { useStageTimer } from "../hooks/useStageTimer";
import GameStage from "./GameStage";

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

	// Use the shared timer logic
	const { elapsed, startTimer, completeStage } = useStageTimer();

	const [ducks, setDucks] = useState<Duck[]>([]);
	const [pondPos, setPondPos] = useState({ x: 45, y: 40 });
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
		startTimer(); // Start the timer when game begins
	}, [duckSpeed, startTimer]);

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

	const handleDragStart = (
		e: React.DragEvent<HTMLButtonElement>,
		id: number,
	) => {
		e.dataTransfer.setData("duckId", id.toString());
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		const duckId = parseInt(e.dataTransfer.getData("duckId"));
		const newDucks = ducks.filter((d) => d.id !== duckId);
		setDucks(newDucks);
		e.currentTarget.classList.remove("bg-cyan-300");
		if (newDucks.length === 0) {
			completeStage(onComplete); // Use shared completion logic
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

	const handleRestart = () => {
		generateDucks(); // This will reset timer and ducks
		onRestart();
	};

	return (
		<GameStage
			title="Stage 4: Drag and Duck"
			instructions="Drag all the ducks to the pond!"
			elapsed={elapsed}
			additionalInfo={`Ducks remaining: ${ducks.length}`}
			onRestart={handleRestart}
			difficultySelector={{
				label: "Duck Speed",
				id: "duck-speed",
				value: duckSpeed,
				onChange: (value) => setDuckSpeed(value as DuckSpeed),
				options: [
					{ value: "fast", label: "Fast" },
					{ value: "default", label: "Default" },
					{ value: "slow", label: "Slow" },
				],
			}}
		>
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
					<button
						key={duck.id}
						draggable
						onDragStart={(e) => handleDragStart(e, duck.id)}
						className="absolute text-5xl cursor-grab active:cursor-grabbing transition-all duration-100"
						type="button"
						style={{
							left: `${duck.x}%`,
							top: `${duck.y}%`,
							transform: `translate(-50%, -50%)`, // Center the duck on its position
						}}
					>
						🦆
					</button>
				))}
			</div>
		</GameStage>
	);
};

export default DragStage;
