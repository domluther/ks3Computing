// DragStage.tsx
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useStageTimer } from "../hooks/useStageTimer";
import GameStage from "./GameStage";

// --- TYPE DEFINITIONS ---
type DragLevel = "open" | "simple" | "zigzag" | "narrow" | "maze";

interface DragDropStageProps {
	onComplete: (time: number) => void;
	onRestart: () => void;
}

const DragDropStage: React.FC<DragDropStageProps> = ({
	onComplete,
	onRestart,
}) => {
	// Use the shared timer logic
	const { elapsed, startTime, startTimer, resetTimer, completeStage } =
		useStageTimer();

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [level, setLevel] = useState<DragLevel>("open");
	const [isDragging, setIsDragging] = useState(false);
	const [message, setMessage] = useState("Drag the duck to the pond!");
	const [duckPos, setDuckPos] = useState<{ x: number; y: number }>({
		x: 0,
		y: 0,
	});
	const [startPos, setStartPos] = useState<{ x: number; y: number }>({
		x: 0,
		y: 0,
	});
	const [goalPos, setGoalPos] = useState<{ x: number; y: number }>({
		x: 0,
		y: 0,
	});

	const levels: DragLevel[] = ["open", "simple", "zigzag", "narrow", "maze"];

	const drawWalls = useCallback(
		(ctx: CanvasRenderingContext2D, w: number, h: number) => {
			ctx.fillStyle = "#8b5cf6";
			ctx.strokeStyle = "#8b5cf6";
			ctx.lineWidth = 30;
			ctx.lineCap = "round";

			switch (level) {
				case "open":
					// No walls
					break;
				case "simple":
					// Single wall in the middle
					ctx.fillRect(w * 0.4, h * 0.2, 30, h * 0.6);
					break;
				case "zigzag":
					// Zigzag pattern
					ctx.fillRect(w * 0.3, h * 0.1, 30, h * 0.4);
					ctx.fillRect(w * 0.6, h * 0.5, 30, h * 0.4);
					break;
				case "narrow":
					// More complex narrow passages
					ctx.fillRect(w * 0.25, h * 0.1, 30, h * 0.3);
					ctx.fillRect(w * 0.25, h * 0.6, 30, h * 0.3);
					ctx.fillRect(w * 0.65, h * 0.1, 30, h * 0.3);
					ctx.fillRect(w * 0.65, h * 0.6, 30, h * 0.3);
					ctx.fillRect(w * 0.45, h * 0.1, 30, h * 0.25);
					ctx.fillRect(w * 0.45, h * 0.65, 30, h * 0.25);
					break;
				case "maze":
					// Much more complex maze
					ctx.fillRect(w * 0.15, 0, 30, h * 0.4);
					ctx.fillRect(w * 0.35, h * 0.25, 30, h * 0.4);
					ctx.fillRect(w * 0.55, 0, 30, h * 0.35);
					ctx.fillRect(w * 0.75, h * 0.5, 30, h * 0.5);
					ctx.fillRect(w * 0.25, h * 0.7, w * 0.4, 30);
					ctx.fillRect(w * 0.05, h * 0.6, w * 0.2, 30);
					break;
			}
		},
		[level],
	);

	const isPointInWall = useCallback(
		(x: number, y: number, w: number, h: number): boolean => {
			const duckRadius = 25;

			// Check collision geometrically instead of using pixel detection
			switch (level) {
				case "open":
					return false;
				case "simple":
					return (
						x + duckRadius > w * 0.4 &&
						x - duckRadius < w * 0.4 + 30 &&
						y + duckRadius > h * 0.2 &&
						y - duckRadius < h * 0.8
					);
				case "zigzag":
					return (
						(x + duckRadius > w * 0.3 &&
							x - duckRadius < w * 0.3 + 30 &&
							y + duckRadius > h * 0.1 &&
							y - duckRadius < h * 0.5) ||
						(x + duckRadius > w * 0.6 &&
							x - duckRadius < w * 0.6 + 30 &&
							y + duckRadius > h * 0.5 &&
							y - duckRadius < h * 0.9)
					);
				case "narrow":
					return (
						(x + duckRadius > w * 0.25 &&
							x - duckRadius < w * 0.25 + 30 &&
							y + duckRadius > h * 0.1 &&
							y - duckRadius < h * 0.4) ||
						(x + duckRadius > w * 0.25 &&
							x - duckRadius < w * 0.25 + 30 &&
							y + duckRadius > h * 0.6 &&
							y - duckRadius < h * 0.9) ||
						(x + duckRadius > w * 0.65 &&
							x - duckRadius < w * 0.65 + 30 &&
							y + duckRadius > h * 0.1 &&
							y - duckRadius < h * 0.4) ||
						(x + duckRadius > w * 0.65 &&
							x - duckRadius < w * 0.65 + 30 &&
							y + duckRadius > h * 0.6 &&
							y - duckRadius < h * 0.9) ||
						(x + duckRadius > w * 0.45 &&
							x - duckRadius < w * 0.45 + 30 &&
							y + duckRadius > h * 0.1 &&
							y - duckRadius < h * 0.35) ||
						(x + duckRadius > w * 0.45 &&
							x - duckRadius < w * 0.45 + 30 &&
							y + duckRadius > h * 0.65 &&
							y - duckRadius < h * 0.9)
					);
				case "maze":
					return (
						// Wall 1: vertical left
						(x + duckRadius > w * 0.15 &&
							x - duckRadius < w * 0.15 + 30 &&
							y + duckRadius > 0 &&
							y - duckRadius < h * 0.4) ||
						// Wall 2: vertical mid
						(x + duckRadius > w * 0.35 &&
							x - duckRadius < w * 0.35 + 30 &&
							y + duckRadius > h * 0.25 &&
							y - duckRadius < h * 0.65) ||
						// Wall 3: vertical right-top
						(x + duckRadius > w * 0.55 &&
							x - duckRadius < w * 0.55 + 30 &&
							y + duckRadius > 0 &&
							y - duckRadius < h * 0.35) ||
						// Wall 4: vertical right-bottom
						(x + duckRadius > w * 0.75 &&
							x - duckRadius < w * 0.75 + 30 &&
							y + duckRadius > h * 0.5 &&
							y - duckRadius < h * 1.0) ||
						// Wall 5: horizontal mid-bottom
						(x + duckRadius > w * 0.25 &&
							x - duckRadius < w * 0.25 + w * 0.4 &&
							y + duckRadius > h * 0.7 &&
							y - duckRadius < h * 0.7 + 30) ||
						// Wall 6: horizontal left-bottom
						(x + duckRadius > w * 0.05 &&
							x - duckRadius < w * 0.05 + w * 0.2 &&
							y + duckRadius > h * 0.6 &&
							y - duckRadius < h * 0.6 + 30)
					);

				default:
					return false;
			}
		},
		[level],
	);

	const updatePositions = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const parent = canvas.parentElement;
		if (parent) {
			const w = parent.offsetWidth;
			const h = parent.offsetHeight;

			const newStartPos = { x: w * 0.1, y: h * 0.5 };
			const newGoalPos = { x: w * 0.85, y: h * 0.5 };

			// Update positions if they've changed significantly or are uninitialized
			if (
				startPos.x === 0 ||
				Math.abs(startPos.x - newStartPos.x) > 5 ||
				Math.abs(startPos.y - newStartPos.y) > 5
			) {
				setStartPos(newStartPos);
				// Only update duck position if not currently dragging
				if (!isDragging) {
					setDuckPos(newStartPos);
				}
			}
			if (
				goalPos.x === 0 ||
				Math.abs(goalPos.x - newGoalPos.x) > 5 ||
				Math.abs(goalPos.y - newGoalPos.y) > 5
			) {
				setGoalPos(newGoalPos);
			}
		}
	}, [startPos, goalPos, isDragging]);

	const draw = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const parent = canvas.parentElement;
		if (parent) {
			canvas.width = parent.offsetWidth;
			canvas.height = parent.offsetHeight;
		}

		// Update positions whenever we draw
		updatePositions();

		const w = canvas.width;
		const h = canvas.height;

		// Clear canvas
		ctx.clearRect(0, 0, w, h);

		// Calculate positions for this level (don't update state here)
		const currentGoalPos = { x: w * 0.85, y: h * 0.5 };

		// Draw walls
		drawWalls(ctx, w, h);

		// Draw pond (goal) - use state goalPos for consistency with collision detection
		ctx.fillStyle = "#3b82f6";
		ctx.beginPath();
		ctx.arc(
			goalPos.x || currentGoalPos.x,
			goalPos.y || currentGoalPos.y,
			75,
			0,
			2 * Math.PI,
		);
		ctx.fill();

		// Add pond label
		ctx.fillStyle = "white";
		ctx.font = "bold 16px sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";

		// Draw duck emoji
		ctx.font = "50px Arial";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText("🐥", duckPos.x, duckPos.y);
	}, [duckPos, goalPos, drawWalls, updatePositions]);

	useEffect(() => {
		draw();
		window.addEventListener("resize", draw);
		return () => window.removeEventListener("resize", draw);
	}, [draw]);

	const isPointNear = (
		x1: number,
		y1: number,
		x2: number,
		y2: number,
		radius = 30,
	) => {
		return Math.hypot(x2 - x1, y2 - y1) < radius;
	};

	const resetDuckToStart = () => {
		setDuckPos(startPos);
		setIsDragging(false);
		setMessage("Oops! The duck hit a wall and flew back. Try again!");
	};

	const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const rect = canvas.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		if (isPointNear(x, y, duckPos.x, duckPos.y)) {
			setIsDragging(true);
			// Only start the timer if it hasn't been started yet
			if (!startTime) {
				startTimer(); // Start the timer when game begins
			}
			setMessage("Dragging the duck! Avoid the purple walls.");
		}
	};

	const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
		if (!isDragging) return;

		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
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
			setMessage("Great! Now drop the duck in the pond to complete the level!");
		} else {
			setMessage("Keep going! Drag the duck to the middle of the pond.");
		}
	};

	const handleMouseUp = () => {
		if (
			isDragging &&
			isPointNear(duckPos.x, duckPos.y, goalPos.x, goalPos.y, 60)
		) {
			// Duck was dropped in the pond - complete level
			const currentIndex = levels.indexOf(level);
			if (currentIndex < levels.length - 1) {
				setLevel(levels[currentIndex + 1]);
				setIsDragging(false);
				setDuckPos(startPos);
				setMessage("Great! Level complete. Try the next one!");
			} else {
				completeStage(onComplete); // Use shared completion logic
			}
		} else {
			setIsDragging(false);
			if (!isPointNear(duckPos.x, duckPos.y, goalPos.x, goalPos.y, 60)) {
				setMessage("Click and drag the duck to the pond, then drop it!");
			}
		}
	};

	const handleRestart = () => {
		// Reset all state and restart the game
		setLevel("open");
		setIsDragging(false);
		setMessage("Drag the duck to the pond!");
		resetTimer(); // Reset the timer completely
		onRestart();
	};

	return (
		<GameStage
			title="Stage 3: Duck Dragging"
			instructions={message}
			elapsed={elapsed}
			onRestart={handleRestart}
		>
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
		</GameStage>
	);
};

export default DragDropStage;
