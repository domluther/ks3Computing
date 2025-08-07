// ClickingStage.tsx
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import GameButton from "./GameButton";

// --- TYPE DEFINITIONS ---
type CircleSize = "small" | "default" | "large";

interface ClickStageProps {
	onComplete: (time: number) => void;
	onRestart: () => void;
}

const ClickStage: React.FC<ClickStageProps> = ({ onComplete, onRestart }) => {
	const [items, setItems] = useState<
		{
			id: number;
			type: "L" | "R" | "LL" | "RR";
			x: number;
			y: number;
		}[]
	>([]);
	const [startTime, setStartTime] = useState<number | null>(null);
	const [elapsed, setElapsed] = useState<number>(0);
	const [clickCounts, setClickCounts] = useState<Record<number, number>>({});
	const [circleSize, setCircleSize] = useState<CircleSize>("default");

	useEffect(() => {
		const timer = setInterval(() => {
			if (startTime) {
				setElapsed((Date.now() - startTime) / 1000);
			}
		}, 100);
		return () => clearInterval(timer);
	}, [startTime]);

	const generateItems = useCallback(() => {
		const newItems = [];
		const types: ("L" | "R" | "LL" | "RR")[] = ["L", "R", "LL", "RR"];
		for (let i = 0; i < 15; i++) {
			const type = types[Math.floor(Math.random() * types.length)];
			newItems.push({
				id: i,
				type,
				x: Math.random() * 85,
				y: Math.random() * 80,
			});
		}
		setItems(newItems);
		setStartTime(Date.now());
		setClickCounts({});
	}, []);

	useEffect(() => {
		generateItems();
	}, [generateItems]);

	const handleClick = (e: React.MouseEvent, item: (typeof items)[number]) => {
		e.preventDefault();
		const isLeftClick = e.button === 0;
		const isRightClick = e.button === 2;

		const isValidClick =
			(item.type === "L" && isLeftClick) || (item.type === "R" && isRightClick);

		const doubleClickRequirement =
			(item.type === "LL" && isLeftClick) ||
			(item.type === "RR" && isRightClick);

		const newClickCounts = { ...clickCounts };
		newClickCounts[item.id] = (newClickCounts[item.id] || 0) + 1;
		setClickCounts(newClickCounts);

		const requiredCount = item.type === "LL" || item.type === "RR" ? 2 : 1;

		if (
			(isValidClick || doubleClickRequirement) &&
			newClickCounts[item.id] >= requiredCount
		) {
			const newItems = items.filter((i) => i.id !== item.id);
			setItems(newItems);
			if (newItems.length === 0) {
				const endTime = Date.now();
				const timeTaken = (endTime - (startTime ?? endTime)) / 1000;
				onComplete(timeTaken);
			}
		}
	};

	const getSizeClasses = (size: CircleSize) => {
		switch (size) {
			case "small":
				return "w-8 h-8 text-base"; // Half size
			case "large":
				return "w-24 h-24 text-2xl"; // 50% bigger
			default:
				return "w-16 h-16 text-xl"; // Default size
		}
	};

	return (
		<div className="w-full h-[60vh] flex flex-col items-center p-4">
			<h3 className="text-2xl font-bold text-slate-700 mb-2">
				Stage 2: Clicking
			</h3>
			<p className="text-lg text-slate-500 mb-2 bg-yellow-100 p-2 rounded-lg">
				<span className="font-bold text-blue-600">LEFT-CLICK</span> L or LL,
				<span className="font-bold text-red-600"> RIGHT-CLICK</span> R or RR.
				Double-click LL/RR!
			</p>
			<div className="mb-2 text-lg font-semibold text-slate-700">
				Time: {elapsed.toFixed(1)}s
			</div>
			<div className="mb-2">
				<label
					htmlFor="circle-size"
					className="font-medium text-slate-600 mr-2"
				>
					Circle Size:
				</label>
				<select
					id="circle-size"
					value={circleSize}
					onChange={(e) => {
						setCircleSize(e.target.value as CircleSize);
						generateItems(); // Reset the game when difficulty changes
					}}
					className="border border-slate-400 rounded px-2 py-1"
				>
					<option value="large">Large</option>
					<option value="default">Default</option>
					<option value="small">Small</option>
				</select>
			</div>
			<div
				role="application"
				className="w-full h-full border-4 border-slate-300 rounded-lg relative bg-slate-50"
				onContextMenu={(e) => e.preventDefault()}
			>
				{items.map((item) => (
					<button
						key={item.id}
						onMouseDown={(e) => handleClick(e, item)}
						className={`absolute rounded-full flex items-center justify-center font-bold text-white cursor-pointer select-none transition-transform hover:scale-110
              ${getSizeClasses(circleSize)}
              ${item.type.startsWith("L") ? "bg-blue-500" : "bg-red-500"}`}
						style={{ left: `${item.x}%`, top: `${item.y}%` }}
						type="button"
					>
						{item.type}
					</button>
				))}
			</div>
			<GameButton onClick={onRestart} className="mt-4">
				Restart Game
			</GameButton>
		</div>
	);
};

export default ClickStage;