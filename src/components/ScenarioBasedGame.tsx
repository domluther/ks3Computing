import React, { type ReactNode, useCallback, useEffect, useState } from "react";
import { shuffleArray } from "../utils/utils";
import GameButton from "./GameButton";

// --- GENERIC TYPES ---
export type GameStage = "intro" | "playing" | "feedback" | "results";

export interface GenericChoice {
	[key: string]: any; // Allow any additional properties
}

export interface GenericScenario<TChoice extends GenericChoice> {
	id: number;
	text: string;
	choices: TChoice[];
	explanation?: string;
	followUpQuestion?: string;
}

export interface ScoreResult {
	value: number;
	display: string;
	isPositive?: boolean;
}

export interface GameResults<TChoice extends GenericChoice> {
	finalScore: number;
	allChoices: Array<{
		scenario: GenericScenario<TChoice>;
		choice: TChoice;
		scoreChange: number;
	}>;
	summary: {
		totalQuestions: number;
		[key: string]: any; // Allow custom summary properties
		feedback?: string; // Explicitly define common properties
	};
}

export interface ScenarioBasedGameProps<TChoice extends GenericChoice> {
	// Game Configuration
	title: string;
	description: string | ReactNode;
	scenarios: GenericScenario<TChoice>[];
	initialScore: number;
	questionsToAsk?: number;

	// Rendering Functions
	choiceRenderer: (
		choice: TChoice,
		onSelect: () => void,
		scenario: GenericScenario<TChoice>,
		index?: number,
	) => ReactNode;

	// Score and Result Logic
	scoreCalculator: (choice: TChoice, currentScore: number) => number;
	resultAnalyzer: (
		finalScore: number,
		allChoices: Array<{
			scenario: GenericScenario<TChoice>;
			choice: TChoice;
			scoreChange: number;
		}>,
	) => GameResults<TChoice>;

	// Display Functions
	scoreRenderer?: (score: number) => ReactNode;
	feedbackRenderer?: (
		choice: TChoice,
		scoreChange: number,
		scenario: GenericScenario<TChoice>,
	) => ReactNode;
	resultsRenderer?: (results: GameResults<TChoice>) => ReactNode;

	// Event Handlers
	onGameComplete?: (results: GameResults<TChoice>) => void;
	onNavigateHome?: () => void;

	// Styling
	className?: string;
}

/**
 * Generic component for scenario-based educational games
 * Handles common game flow: intro -> questions -> feedback -> results
 */
export function ScenarioBasedGame<TChoice extends GenericChoice>({
	title,
	description,
	scenarios,
	initialScore,
	questionsToAsk = scenarios.length,
	choiceRenderer,
	scoreCalculator,
	resultAnalyzer,
	scoreRenderer,
	feedbackRenderer,
	resultsRenderer,
	onGameComplete,
	onNavigateHome,
	className = "",
}: ScenarioBasedGameProps<TChoice>) {
	// --- STATE MANAGEMENT ---
	const [stage, setStage] = useState<GameStage>("intro");
	const [score, setScore] = useState(initialScore);
	const [shuffledScenarios, setShuffledScenarios] = useState<
		GenericScenario<TChoice>[]
	>([]);
	const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
	const [lastChoice, setLastChoice] = useState<{
		choice: TChoice;
		scoreChange: number;
		scenario: GenericScenario<TChoice>;
	} | null>(null);
	const [allChoices, setAllChoices] = useState<
		Array<{
			scenario: GenericScenario<TChoice>;
			choice: TChoice;
			scoreChange: number;
		}>
	>([]);

	// --- GAME LOGIC ---
	const handleChoice = useCallback(
		(choice: TChoice) => {
			const currentScenario = shuffledScenarios[currentScenarioIndex];
			const scoreChange = scoreCalculator(choice, score);
			const newScore = scoreChange;

			const choiceRecord = {
				scenario: currentScenario,
				choice,
				scoreChange: scoreChange - score,
			};

			setLastChoice(choiceRecord);
			setScore(newScore);
			setAllChoices((prev) => [...prev, choiceRecord]);
			setStage("feedback");
		},
		[shuffledScenarios, currentScenarioIndex, scoreCalculator, score],
	);

	const startGame = () => {
		const shuffled = shuffleArray([...scenarios]);
		// Also shuffle the choices within each scenario
		const shuffledWithChoices = shuffled.map((scenario) => ({
			...scenario,
			choices: shuffleArray([...scenario.choices]),
		}));
		setShuffledScenarios(shuffledWithChoices.slice(0, questionsToAsk));
		setCurrentScenarioIndex(0);
		setScore(initialScore);
		setAllChoices([]);
		setLastChoice(null);
		setStage("playing");
	};

	const nextQuestion = useCallback(() => {
		if (currentScenarioIndex + 1 < shuffledScenarios.length) {
			setCurrentScenarioIndex(currentScenarioIndex + 1);
			setStage("playing");
		} else {
			const results = resultAnalyzer(score, allChoices);
			onGameComplete?.(results);
			setStage("results");
		}
	}, [
		currentScenarioIndex,
		shuffledScenarios.length,
		resultAnalyzer,
		score,
		allChoices,
		onGameComplete,
	]);

	// --- KEYBOARD SUPPORT ---
	useEffect(() => {
		const handleKeyPress = (event: KeyboardEvent) => {
			if (stage === "playing") {
				const currentScenario = shuffledScenarios[currentScenarioIndex];
				if (!currentScenario) return;

				const key = event.key;
				const choiceIndex = ["1", "2", "3", "4"].indexOf(key);

				if (
					choiceIndex !== -1 &&
					choiceIndex < currentScenario.choices.length
				) {
					event.preventDefault();
					handleChoice(currentScenario.choices[choiceIndex]);
				}
			} else if (stage === "feedback") {
				if (event.key === "Enter") {
					event.preventDefault();
					nextQuestion();
				}
			}
		};

		window.addEventListener("keydown", handleKeyPress);
		return () => window.removeEventListener("keydown", handleKeyPress);
	}, [
		stage,
		currentScenarioIndex,
		shuffledScenarios,
		handleChoice,
		nextQuestion,
	]);

	const restartGame = () => {
		setStage("intro");
		setScore(initialScore);
		setCurrentScenarioIndex(0);
		setShuffledScenarios([]);
		setAllChoices([]);
		setLastChoice(null);
	};

	// --- RENDER HELPERS ---
	const defaultScoreRenderer = (currentScore: number) => (
		<div className="w-full bg-slate-200 rounded-full h-6 mb-6">
			<div
				className="bg-gradient-to-r from-blue-500 to-purple-600 h-6 rounded-full transition-all duration-500 flex items-center justify-center"
				style={{ width: "100%" }}
			>
				<span className="text-white font-semibold text-sm">
					Score: {currentScore}
				</span>
			</div>
		</div>
	);

	const hasChoiceFeedback = (
		choice: TChoice,
	): choice is TChoice & { feedback: string } => {
		return "feedback" in choice && typeof choice.feedback === "string";
	};

	const defaultFeedbackRenderer = (
		choice: TChoice,
		scoreChange: number,
		scenario: GenericScenario<TChoice>,
	) => (
		<div className="text-center">
			<div
				className={`text-lg font-semibold mb-4 ${scoreChange >= 0 ? "text-green-600" : "text-red-600"}`}
			>
				{scoreChange >= 0 ? "Good choice!" : "Think about this..."}
			</div>
			{hasChoiceFeedback(choice) && (
				<p className="text-slate-700 mb-4">{choice.feedback}</p>
			)}
			{scenario.explanation && (
				<p className="text-slate-600 text-sm">{scenario.explanation}</p>
			)}
		</div>
	);

	const defaultResultsRenderer = (results: GameResults<TChoice>) => (
		<div className="text-center">
			<div className="text-4xl font-bold text-slate-700 mb-4">
				Final Score: {results.finalScore}
			</div>
			<div className="text-lg text-slate-600 mb-6">
				You completed {results.summary.totalQuestions} questions
			</div>
		</div>
	);

	// --- STAGE RENDERING ---
	const renderIntro = () => (
		<div className="w-full max-w-2xl p-8 text-center">
			<div className="bg-white p-8 rounded-xl shadow-lg">
				<h2 className="text-4xl font-bold text-slate-700 mb-6">{title}</h2>
				<div className="text-lg text-slate-600 mb-8">{description}</div>
				<GameButton onClick={startGame} className="text-xl px-8 py-4">
					Start Game
				</GameButton>
			</div>
		</div>
	);

	const renderPlaying = () => {
		const currentScenario = shuffledScenarios[currentScenarioIndex];
		if (!currentScenario) return null;

		return (
			<div className="w-full max-w-3xl p-8">
				{(scoreRenderer || defaultScoreRenderer)(score)}
				<div className="bg-white p-8 rounded-xl shadow-lg text-center">
					<p className="text-gray-500 font-medium mb-4">
						Question {currentScenarioIndex + 1} of {shuffledScenarios.length}
					</p>
					<p className="text-2xl font-semibold text-slate-700 mb-8">
						{currentScenario.text}
					</p>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{currentScenario.choices.map((choice, index) => {
							const choiceElement = choiceRenderer(
								choice,
								() => handleChoice(choice),
								currentScenario,
								index,
							);

							return React.cloneElement(choiceElement as React.ReactElement, {
								key: choice.id,
							});
						})}
					</div>
				</div>
			</div>
		);
	};

	const renderFeedback = () => {
		if (!lastChoice) return null;

		return (
			<div className="w-full max-w-3xl p-8 text-center flex flex-col items-center">
				{(scoreRenderer || defaultScoreRenderer)(score)}
				<div className="bg-white p-8 rounded-xl shadow-lg w-full">
					{(feedbackRenderer || defaultFeedbackRenderer)(
						lastChoice.choice,
						lastChoice.scoreChange,
						lastChoice.scenario,
					)}
					<GameButton onClick={nextQuestion} className="mt-6">
						{currentScenarioIndex + 1 < shuffledScenarios.length
							? "Next Question"
							: "See Results"}
					</GameButton>
				</div>
			</div>
		);
	};

	const renderResults = () => {
		const results = resultAnalyzer(score, allChoices);

		return (
			<div className="w-full max-w-4xl p-8 text-center">
				<div className="bg-white p-8 rounded-xl shadow-lg">
					<h2 className="text-3xl font-bold text-slate-700 mb-6">
						Game Complete!
					</h2>

					{(resultsRenderer || defaultResultsRenderer)(results)}

					<div className="flex gap-4 justify-center mt-8">
						<GameButton onClick={restartGame}>Play Again</GameButton>
						{onNavigateHome && (
							<GameButton
								onClick={onNavigateHome}
								className="bg-slate-500 hover:bg-slate-600"
							>
								Back to Home
							</GameButton>
						)}
					</div>
				</div>
			</div>
		);
	};

	// --- MAIN RENDER ---
	const renderStage = () => {
		switch (stage) {
			case "intro":
				return renderIntro();
			case "playing":
				return renderPlaying();
			case "feedback":
				return renderFeedback();
			case "results":
				return renderResults();
			default:
				return renderIntro();
		}
	};

	return (
		<div
			className={`min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center ${className}`}
		>
			{renderStage()}
		</div>
	);
}

export default ScenarioBasedGame;
