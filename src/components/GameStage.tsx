import type React from "react";
import type { ReactNode } from "react";
import { GameButton } from "./Buttons";

interface DifficultyOption {
	value: string;
	label: string;
}

interface DifficultySelector {
	label: string;
	id: string;
	value: string;
	onChange: (value: string) => void;
	options: DifficultyOption[];
}

interface GameStageProps {
	title: string;
	instructions: string | ReactNode;
	elapsed: number;
	onRestart: () => void;
	children: ReactNode;
	additionalInfo?: string | ReactNode;
	className?: string;
	difficultySelector?: DifficultySelector;
}

/**
 * Base component providing common UI structure for game stages
 */
const GameStage: React.FC<GameStageProps> = ({
	title,
	instructions,
	elapsed,
	onRestart,
	children,
	className = "",
	difficultySelector,
}) => {
	return (
		<div
			className={`w-full h-[60vh] flex flex-col items-center p-4 ${className}`}
		>
			{/* Stage Title */}
			<h3 className="text-2xl font-bold text-slate-700 mb-2">{title}</h3>

			{/* Instructions */}
			<div className="text-lg text-slate-500 mb-2 bg-yellow-100 p-2 rounded-lg text-center">
				{instructions}
			</div>

			{/* Timer Display */}
			<div className="mb-2 text-lg font-semibold text-slate-700">
				Time: {elapsed.toFixed(1)}s
			</div>
			{/* Difficulty Selector */}
			{difficultySelector ? (
				<div className="mb-2 flex items-center justify-center">
					<label
						htmlFor={difficultySelector.id}
						className="font-medium text-slate-600 mr-2"
					>
						{difficultySelector.label}:
					</label>
					<select
						id={difficultySelector.id}
						value={difficultySelector.value}
						onChange={(e) => difficultySelector.onChange(e.target.value)}
						className="border border-slate-400 rounded px-2 py-1"
					>
						{difficultySelector.options.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				</div>
			) : (
				<div className="mb-2 h-[38px]"></div>
			)}

			{/* Game Area - Fixed height to ensure consistency */}
			<div className="w-full flex-1 min-h-0">{children}</div>

			{/* Restart Button */}
			<GameButton onClick={onRestart} className="mt-4">
				Restart Game
			</GameButton>
		</div>
	);
};

export default GameStage;
