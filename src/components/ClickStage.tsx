// ClickingStage.tsx
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { useStageTimer } from "../hooks/useStageTimer";
import GameStage from "./GameStage";

// --- TYPE DEFINITIONS ---
type CircleSize = "small" | "default" | "large";

interface ClickStageProps {
	onComplete: (time: number) => void;
	onRestart: () => void;
}

const ClickStage: React.FC<ClickStageProps> = ({ onComplete, onRestart }) => {
	// Use the shared timer logic
	const { elapsed, startTimer, completeStage } = useStageTimer();

	const [items, setItems] = useState<
		{
			id: number;
			type: "L" | "R" | "LL" | "RR";
			x: number;
			y: number;
		}[]
	>([]);
	const [clickCounts, setClickCounts] = useState<Record<number, number>>({});
	const [circleSize, setCircleSize] = useState<CircleSize>("default");

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
		startTimer(); // Start the timer when game begins
		setClickCounts({});
	}, [startTimer]);

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
				completeStage(onComplete); // Use shared completion logic
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

	const handleRestart = () => {
		generateItems(); // This will reset timer and items
		onRestart();
	};

	const instructions = (
		<>
			<span className="font-bold text-blue-600">LEFT-CLICK</span> L or LL,
			<span className="font-bold text-red-600"> RIGHT-CLICK</span> R or RR.
			Double-click LL/RR!
		</>
	);

	return (
		<GameStage
			title="Stage 2: Clicking"
			instructions={instructions}
			elapsed={elapsed}
			onRestart={handleRestart}
			difficultySelector={{
				label: "Circle Size",
				id: "circle-size",
				value: circleSize,
				onChange: (value) => {
					setCircleSize(value as CircleSize);
					generateItems(); // Reset the game when difficulty changes
				},
				options: [
					{ value: "large", label: "Large" },
					{ value: "default", label: "Default" },
					{ value: "small", label: "Small" },
				],
			}}
		>
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
		</GameStage>
	);
};

export default ClickStage;
