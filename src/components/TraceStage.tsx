// ClickingStage.tsx
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import GameButton from "./GameButton";

// --- TYPE DEFINITIONS ---
type TraceLevel = "line" | "wave" | "square" | "circle" | "star";
type LineThickness = "thin" | "default" | "thick";

interface TraceStageProps {
	onComplete: (time: number) => void;
	onRestart: () => void;
}

const TraceStage: React.FC<TraceStageProps> = ({ onComplete, onRestart }) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [level, setLevel] = useState<TraceLevel>("line");
	const [isDrawing, setIsDrawing] = useState(false);
	const [startTime, setStartTime] = useState<number | null>(null);
	const [elapsed, setElapsed] = useState<number>(0);
	const [message, setMessage] = useState(
		"Move your mouse to the START circle to begin!",
	);
	const [lineThickness, setLineThickness] = useState<LineThickness>("default");

	const levels: TraceLevel[] = ["line", "wave", "square", "circle", "star"];
	const startRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
	const endRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

	useEffect(() => {
		const timer = setInterval(() => {
			if (startTime) {
				setElapsed((Date.now() - startTime) / 1000);
			}
		}, 100);
		return () => clearInterval(timer);
	}, [startTime]);

	const draw = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d", { willReadFrequently: true });
		if (!ctx) return;

		const parent = canvas.parentElement;
		if (parent) {
			canvas.width = parent.offsetWidth;
			canvas.height = parent.offsetHeight;
		}

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.lineWidth =
			lineThickness === "thick" ? 100 : lineThickness === "default" ? 50 : 20;
		ctx.strokeStyle = "#a7f3d0";
		ctx.lineCap = "round";
		ctx.lineJoin = "round";

		const w = canvas.width;
		const h = canvas.height;
		let startPos = { x: 0, y: 0 };
		let endPos = { x: 0, y: 0 };

		ctx.beginPath();
		switch (level) {
			case "line": {
				startPos = { x: w * 0.1, y: h * 0.5 };
				endPos = { x: w * 0.9, y: h * 0.5 };
				ctx.moveTo(startPos.x, startPos.y);
				ctx.lineTo(endPos.x, endPos.y);
				break;
			}
			case "wave": {
				startPos = { x: w * 0.1, y: h * 0.5 };
				endPos = { x: w * 0.9, y: h * 0.5 };
				ctx.moveTo(startPos.x, startPos.y);
				ctx.bezierCurveTo(
					w * 0.3,
					h * 0.2,
					w * 0.7,
					h * 0.8,
					endPos.x,
					endPos.y,
				);
				break;
			}
			case "square": {
				startPos = { x: w * 0.2, y: h * 0.8 };
				endPos = { x: w * 0.8, y: h * 0.8 };
				ctx.moveTo(startPos.x, startPos.y);
				ctx.lineTo(w * 0.2, h * 0.2);
				ctx.lineTo(w * 0.8, h * 0.2);
				ctx.lineTo(endPos.x, endPos.y);
				break;
			}
			case "circle": {
				const circleCentreX = w / 2;
				const circleCentreY = h / 2;
				const radius = h * 0.35;
				const circleStartAngle = Math.PI * 1.5;
				const arcLength = Math.PI * 1.6;
				const circleEndAngle = circleStartAngle + arcLength;

				startPos = {
					x: circleCentreX + radius * Math.cos(circleStartAngle),
					y: circleCentreY + radius * Math.sin(circleStartAngle),
				};
				endPos = {
					x: circleCentreX + radius * Math.cos(circleEndAngle),
					y: circleCentreY + radius * Math.sin(circleEndAngle),
				};
				ctx.arc(
					circleCentreX,
					circleCentreY,
					radius,
					circleStartAngle,
					circleEndAngle,
				);
				break;
			}
			case "star": {
				const starCentreX = w / 2;
				const starCentreY = h / 2;
				const outerRadius = h * 0.3;
				const innerRadius = h * 0.12;
				const numPoints = 5;
				const startPointIndex = 0; // Start at the top point
				const endPointIndex = 4.2; // Go about 84% around (4.2 out of 5 points)

				// Calculate start position (top outer point)
				const starStartAngle =
					(startPointIndex * 2 * Math.PI) / numPoints - Math.PI / 2;
				startPos = {
					x: starCentreX + outerRadius * Math.cos(starStartAngle),
					y: starCentreY + outerRadius * Math.sin(starStartAngle),
				};

				// Calculate end position (84% around)
				const starEndAngle =
					(endPointIndex * 2 * Math.PI) / numPoints - Math.PI / 2;
				const isEndOuter = Math.floor(endPointIndex) % 2 === 0;
				const endRadius = isEndOuter ? outerRadius : innerRadius;
				endPos = {
					x: starCentreX + endRadius * Math.cos(starEndAngle),
					y: starCentreY + endRadius * Math.sin(starEndAngle),
				};

				// Draw the star path
				ctx.moveTo(startPos.x, startPos.y);

				for (let i = 0; i <= Math.floor(endPointIndex * 2); i++) {
					const pointIndex = i / 2;
					const angle = (pointIndex * 2 * Math.PI) / numPoints - Math.PI / 2;
					const radius = i % 2 === 0 ? outerRadius : innerRadius;
					const x = starCentreX + radius * Math.cos(angle);
					const y = starCentreY + radius * Math.sin(angle);
					if (pointIndex <= endPointIndex) {
						ctx.lineTo(x, y);
					}
				}

				// Final line to the exact end position
				ctx.lineTo(endPos.x, endPos.y);
				break;
			}
		}

		startRef.current = startPos;
		endRef.current = endPos;

		ctx.stroke();

		// Draw start and end
		ctx.fillStyle = "#10b981";
		ctx.beginPath();
		ctx.arc(startPos.x, startPos.y, 30, 0, 2 * Math.PI);
		ctx.fill();

		ctx.fillStyle = "#ef4444";
		ctx.beginPath();
		ctx.arc(endPos.x, endPos.y, 30, 0, 2 * Math.PI);
		ctx.fill();

		ctx.fillStyle = "white";
		ctx.font = "bold 16px sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText("START", startPos.x, startPos.y);
		ctx.fillText("END", endPos.x, endPos.y);
	}, [level, lineThickness]);

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
		radius = 25,
	) => {
		return Math.hypot(x2 - x1, y2 - y1) < radius;
	};

	const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d", { willReadFrequently: true });
		if (!ctx) return;

		const rect = canvas.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		if (!isDrawing) {
			const s = startRef.current;
			if (isPointNear(x, y, s.x, s.y)) {
				setIsDrawing(true);
				if (!startTime) setStartTime(Date.now());
				setMessage("Go! Trace the path to the END circle.");
			}
			return;
		}

		const pixel = ctx.getImageData(x, y, 1, 1).data;
		const onPath = pixel[3] > 0;

		if (!onPath) {
			setMessage("Oops! You went off the path. Go back to START to try again.");
			setIsDrawing(false);
			return;
		}

		const ePos = endRef.current;
		if (isPointNear(x, y, ePos.x, ePos.y)) {
			const timeTaken = (Date.now() - (startTime ?? Date.now())) / 1000;
			const currentIndex = levels.indexOf(level);
			if (currentIndex < levels.length - 1) {
				setLevel(levels[currentIndex + 1]);
				setIsDrawing(false);
				setMessage("Great! Get ready for the next one. Go to START.");
			} else {
				onComplete(timeTaken);
			}
		} else {
			setMessage("Good! Keep going...");
		}
	};

	return (
		<div className="w-full h-[60vh] flex flex-col items-center justify-center p-4">
			<h3 className="text-2xl font-bold text-slate-700 mb-2">
				Stage 1: Mouse Tracing
			</h3>
			<p className="text-lg text-slate-500 mb-2 bg-yellow-100 p-2 rounded-lg">
				{message}
			</p>
			<div className="mb-2 text-lg font-semibold text-slate-700">
				Time: {elapsed.toFixed(1)}s
			</div>
			<div className="mb-2">
				<label
					htmlFor="line-thickness"
					className="font-medium text-slate-600 mr-2"
				>
					Line Thickness:
				</label>
				<select
					id="line-thickness"
					value={lineThickness}
					onChange={(e) => setLineThickness(e.target.value as LineThickness)}
					className="border border-slate-400 rounded px-2 py-1"
				>
					<option value="thick">Thick</option>
					<option value="default">Default</option>
					<option value="thin">Thin</option>
				</select>
			</div>
			<div className="w-full h-full border-4 border-slate-300 rounded-lg overflow-hidden">
				<canvas
					ref={canvasRef}
					onMouseMove={handleMouseMove}
					className="w-full h-full bg-slate-50"
				/>
			</div>
			<GameButton onClick={onRestart} className="mt-4">
				Restart Game
			</GameButton>
		</div>
	);
};

export default TraceStage;
