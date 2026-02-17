import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { hardwareData, sortedHardwareItems } from "../data/hardwareData";
import type { HardwareTypes } from "../types/types";

const InputOutputTool: React.FC = () => {
	// State management using React Hooks
	const [userAnswers, setUserAnswers] = useState<HardwareTypes>({});
	const [isMarked, setIsMarked] = useState(false);
	const [showAnswers, setShowAnswers] = useState(false);
	const [draggedItem, setDraggedItem] = useState<string | null>(null);

	const placedItems = Object.keys(userAnswers);
	const availableItems = sortedHardwareItems.filter(
		(item) => !placedItems.includes(item),
	);

	// Drag and Drop Handlers
	const handleDragStart = (
		e: React.DragEvent<HTMLButtonElement>,
		item: string,
	) => {
		setDraggedItem(item);
		e.dataTransfer.setData("text/plain", item);
	};

	const handleDrop = (
		e: React.DragEvent<HTMLDivElement>,
		category: "input" | "output" | "both",
	) => {
		e.preventDefault();
		const item = e.dataTransfer.getData("text/plain");
		setUserAnswers((prev) => ({ ...prev, [item]: category }));
		setIsMarked(false); // Reset marking when an item is moved
		e.currentTarget.classList.remove("bg-blue-100");
	};

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.currentTarget.classList.add("bg-blue-100");
	};

	const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
		e.currentTarget.classList.remove("bg-blue-100");
	};

	const handleDragEnd = () => {
		setDraggedItem(null);
	};

	// Function to return an item to the list
	const returnItemToList = (item: string) => {
		const newAnswers = { ...userAnswers };
		delete newAnswers[item];
		setUserAnswers(newAnswers);
		setIsMarked(false);
	};

	// Marking logic
	const handleMarkWork = () => {
		setIsMarked(true);
	};

	// Reset logic
	const resetAll = useCallback(() => {
		setUserAnswers({});
		setIsMarked(false);
		setShowAnswers(false);
	}, []);

	// Effect to reset the tool when the component is unmounted (user navigates away)
	useEffect(() => {
		return () => resetAll();
	}, [resetAll]);

	let score = 0;
	if (isMarked) {
		Object.keys(userAnswers).forEach((item) => {
			if (hardwareData[item] === userAnswers[item]) {
				score++;
			}
		});
	}

	// Helper to get styling for placed items
	const getItemClasses = (item: string) => {
		const baseClass =
			"bg-green-500 text-white py-2 px-4 rounded-full cursor-pointer transition-all";
		if (isMarked && showAnswers) {
			const isCorrect = hardwareData[item] === userAnswers[item];
			return `${baseClass} ${isCorrect ? "ring-2 ring-offset-2 ring-green-500" : "bg-red-500 ring-2 ring-offset-2 ring-red-500"}`;
		}
		return baseClass;
	};

	return (
		<div className="w-full flex flex-col md:flex-row min-h-[70vh]">
			{/* Sidebar */}
			<aside className="w-full p-4 border-r-2 md:w-1/4 bg-slate-100 border-slate-200">
				<h3 className="mb-4 text-xl font-bold text-center">Hardware Items</h3>
				<div className="space-y-3">
					{availableItems.map((item) => (
						<button
							key={item}
							draggable
							onDragStart={(e) => handleDragStart(e, item)}
							className={`p-3 rounded-lg shadow cursor-grab active:cursor-grabbing text-white font-semibold text-center bg-linear-to-r from-blue-500 to-cyan-500 appearance-none border-none w-full block focus:outline-none ${draggedItem === item ? "opacity-50" : ""}`}
							type="button"
						>
							{item}
						</button>
					))}
				</div>
			</aside>

			{/* Main Diagram Area */}
			<main className="flex flex-col items-center flex-1 p-6">
				<div className="relative w-full max-w-4xl h-112.5 mb-6">
					{/* Venn Diagram Circles */}
					<div className="absolute top-0 left-[10%] w-[55%] h-[90%] border-4 border-red-400 rounded-full bg-red-100/50">
						<span className="absolute text-xl font-bold text-red-600 top-4 left-1/4">
							INPUT
						</span>
					</div>
					<div className="absolute top-0 right-[10%] w-[55%] h-[90%] border-4 border-blue-400 rounded-full bg-blue-100/50">
						<span className="absolute text-xl font-bold text-blue-600 top-4 right-1/4">
							OUTPUT
						</span>
					</div>

					{/* Drop Zones */}
					<div
						onDrop={(e) => handleDrop(e, "input")}
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
						role="application"
						className="absolute top-[15%] left-[12%] w-[25%] h-[60%] rounded-full flex flex-wrap gap-2 p-2 justify-center content-start transition-colors"
					>
						{placedItems
							.filter((item) => userAnswers[item] === "input")
							.map((item) => (
								<button
									key={item}
									draggable
									onDragStart={(e) => handleDragStart(e, item)}
									onDragEnd={handleDragEnd}
									onClick={() => returnItemToList(item)}
									className={`${getItemClasses(item)} cursor-grab active:cursor-grabbing`}
									type="button"
								>
									{item}
								</button>
							))}
					</div>
					<div
						onDrop={(e) => handleDrop(e, "output")}
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
						role="application"
						className="absolute top-[15%] right-[12%] w-[25%] h-[60%] rounded-full flex flex-wrap gap-2 p-2 justify-center content-start transition-colors"
					>
						{placedItems
							.filter((item) => userAnswers[item] === "output")
							.map((item) => (
								<button
									key={item}
									draggable
									onDragStart={(e) => handleDragStart(e, item)}
									onDragEnd={handleDragEnd}
									onClick={() => returnItemToList(item)}
									className={`${getItemClasses(item)} cursor-grab active:cursor-grabbing`}
									type="button"
								>
									{item}
								</button>
							))}
					</div>
					<div
						onDrop={(e) => handleDrop(e, "both")}
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
						role="application"
						className="absolute top-[25%] left-1/2 -translate-x-1/2 w-[30%] h-[40%] flex flex-wrap gap-2 p-2 justify-center content-start transition-colors"
					>
						{placedItems
							.filter((item) => userAnswers[item] === "both")
							.map((item) => (
								<button
									key={item}
									draggable
									onDragStart={(e) => handleDragStart(e, item)}
									onDragEnd={handleDragEnd}
									onClick={() => returnItemToList(item)}
									className={`${getItemClasses(item)} cursor-grab active:cursor-grabbing`}
									type="button"
								>
									{item}
								</button>
							))}
					</div>
				</div>

				{/* Controls */}
				<div className="flex flex-col items-center justify-center gap-4">
					<div className="flex flex-wrap items-center justify-center gap-4">
						<button
							onClick={handleMarkWork}
							className="px-6 py-3 font-bold text-white rounded-full shadow-lg transition-transform bg-linear-to-r from-purple-600 to-indigo-600 hover:scale-105"
							type="button"
						>
							Mark My Work
						</button>
						<button
							onClick={resetAll}
							className="px-6 py-3 font-bold text-white rounded-full shadow-lg transition-transform bg-linear-to-r from-red-500 to-orange-500 hover:scale-105"
							type="button"
						>
							Reset
						</button>
					</div>

					{isMarked && (
						<div className="flex flex-wrap items-center justify-center gap-4">
							<label className="flex items-center text-lg gap-2">
								<input
									type="checkbox"
									checked={showAnswers}
									onChange={(e) => setShowAnswers(e.target.checked)}
									className="w-5 h-5"
								/>
								Highlight Correct/Incorrect
							</label>
							<div className="px-6 py-3 text-xl font-bold text-green-800 bg-green-200 rounded-full">
								Score: {score} / {placedItems.length}
							</div>
						</div>
					)}
				</div>
			</main>
		</div>
	);
};

export default InputOutputTool;
