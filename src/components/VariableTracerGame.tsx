import { CheckCircle, Code2, RotateCcw, XCircle } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { BackToHub, GameButton } from "./Buttons";

// --- TYPES ---

interface Variable {
	name: string;
	expectedValue: string;
}

interface Problem {
	id: number;
	title: string;
	hint: string;
	lines: string[];
	variables: Variable[];
}

type GameStage = "intro" | "playing" | "feedback" | "results";

// --- PROBLEMS DATA ---

const problems: Problem[] = [
	{
		id: 1,
		title: "Simple Assignment",
		hint: "The variable is given a value using =",
		lines: ["score = 0"],
		variables: [{ name: "score", expectedValue: "0" }],
	},
	{
		id: 2,
		title: "Adding to a Variable",
		hint: "Read each line from top to bottom — the variable changes.",
		lines: ["score = 0", "score = score + 1"],
		variables: [{ name: "score", expectedValue: "1" }],
	},
	{
		id: 3,
		title: "Taking Away",
		hint: "Start with the first value, then apply the change",
		lines: ["lives = 3", "lives = lives - 1"],
		variables: [{ name: "lives", expectedValue: "2" }],
	},
	{
		id: 4,
		title: "Overwriting a Value",
		hint: "Each time = is used, the old value is thrown away — only the last assignment matters",
		lines: ["age = 10", "age = 15", "age = age + 3", "age = age - 1"],
		variables: [{ name: "age", expectedValue: "17" }],
	},
	{
		id: 5,
		title: "Counting Up",
		hint: "Work through each line one at a time, updating your running total as you go",
		lines: [
			"count = 0",
			"count = count + 2",
			"count = count + 3",
			"count = count - 1",
			"count = count + 4",
		],
		variables: [{ name: "count", expectedValue: "8" }],
	},
	{
		id: 6,
		title: "Two Variables",
		hint: "Both variables change — keep a separate running total for each one",
		lines: ["x = 10", "y = 4", "x = x - y", "y = y + 2", "x = x + y"],
		variables: [
			{ name: "x", expectedValue: "12" },
			{ name: "y", expectedValue: "6" },
		],
	},
	{
		id: 7,
		title: "Recalculating a Total",
		hint: "total is recalculated after price changes — use the updated price the second time",
		lines: [
			"price = 8",
			"quantity = 5",
			"total = price * quantity",
			"price = price + 2",
			"total = price * quantity",
		],
		variables: [
			{ name: "price", expectedValue: "10" },
			{ name: "quantity", expectedValue: "5" },
			{ name: "total", expectedValue: "50" },
		],
	},
	{
		id: 8,
		title: "Both Variables Change",
		hint: "Update each variable as you reach its line — the order matters.",
		lines: [
			"a = 12",
			"b = 3",
			"a = a - b",
			"b = b * 2",
			"a = a + b",
			"b = b - 1",
		],
		variables: [
			{ name: "a", expectedValue: "15" },
			{ name: "b", expectedValue: "5" },
		],
	},
	{
		id: 9,
		title: "Three Variables",
		hint: "Track all three variables carefully — later lines use values set by earlier ones",
		lines: ["x = 4", "y = 2", "z = x * y", "x = z + 1", "y = x - z"],
		variables: [
			{ name: "x", expectedValue: "9" },
			{ name: "y", expectedValue: "1" },
			{ name: "z", expectedValue: "8" },
		],
	},
	{
		id: 10,
		title: "Swap and Calculate",
		hint: "Do the swap first, then work out the final line using the new values",
		lines: [
			"num1 = 3",
			"num2 = 7",
			"temp = num1",
			"num1 = num2",
			"num2 = temp",
			"num1 = num1 + num2",
		],
		variables: [
			{ name: "num1", expectedValue: "10" },
			{ name: "num2", expectedValue: "3" },
			{ name: "temp", expectedValue: "3" },
		],
	},
];

// --- MAIN COMPONENT ---

const VariableTracerGame = () => {
	const [stage, setStage] = useState<GameStage>("intro");
	const [currentIndex, setCurrentIndex] = useState(0);
	const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
	const [answerResults, setAnswerResults] = useState<Record<
		string,
		boolean
	> | null>(null);
	const [score, setScore] = useState(0);
	const [showHint, setShowHint] = useState(false);

	const firstInputRef = useRef<HTMLInputElement>(null);

	const currentProblem = problems[currentIndex];
	const totalProblems = problems.length;
	const numberedLines =
		currentProblem?.lines.map((line, i) => ({ line, lineNum: i + 1 })) ?? [];

	const handleStart = useCallback(() => {
		setStage("playing");
		setCurrentIndex(0);
		setScore(0);
		setUserAnswers({});
		setAnswerResults(null);
		setShowHint(false);
	}, []);

	const handleInputChange = useCallback((varName: string, value: string) => {
		setUserAnswers((prev) => ({ ...prev, [varName]: value }));
	}, []);

	const handleSubmit = useCallback(() => {
		if (!currentProblem) return;

		const results: Record<string, boolean> = {};
		let allCorrect = true;

		for (const variable of currentProblem.variables) {
			const userVal = (userAnswers[variable.name] ?? "").trim();
			const correct = userVal === variable.expectedValue;
			results[variable.name] = correct;
			if (!correct) allCorrect = false;
		}

		setAnswerResults(results);
		if (allCorrect) setScore((s) => s + 1);
		setStage("feedback");
	}, [currentProblem, userAnswers]);

	const handleNext = useCallback(() => {
		if (currentIndex + 1 >= totalProblems) {
			setStage("results");
		} else {
			setCurrentIndex((i) => i + 1);
			setUserAnswers({});
			setAnswerResults(null);
			setShowHint(false);
			setStage("playing");
			// Focus first input after state update
			setTimeout(() => firstInputRef.current?.focus(), 50);
		}
	}, [currentIndex]);

	const handleRestart = useCallback(() => {
		setStage("intro");
		setCurrentIndex(0);
		setScore(0);
		setUserAnswers({});
		setAnswerResults(null);
		setShowHint(false);
	}, []);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === "Enter" && stage === "playing") {
				const allFilled = currentProblem.variables.every(
					(v) => (userAnswers[v.name] ?? "").trim() !== "",
				);
				if (allFilled) handleSubmit();
			}
		},
		[stage, currentProblem, userAnswers, handleSubmit],
	);

	// --- RENDER: INTRO ---
	if (stage === "intro") {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen p-6 bg-slate-100">
				<div className="w-full max-w-2xl text-center space-y-6">
					<div className="flex justify-center">
						<div className="p-5 border rounded-full bg-violet-100 border-violet-200">
							<Code2 className="w-14 h-14 text-violet-600" />
						</div>
					</div>
					<h1 className="text-4xl font-bold text-slate-800">Variable Tracer</h1>
					<p className="text-lg leading-relaxed text-slate-600">
						Can you follow the code and work out what value each variable holds
						at the end?
					</p>
					<div className="p-6 text-left bg-white border space-y-3 shadow-sm border-slate-200 rounded-2xl">
						<p className="text-sm font-semibold tracking-wider uppercase text-violet-600">
							How to play
						</p>
						<ul className="space-y-2 text-slate-600">
							<li className="flex gap-2">
								<span className="text-violet-500">→</span>
								Read each line of code carefully, from top to bottom
							</li>
							<li className="flex gap-2">
								<span className="text-violet-500">→</span>
								Work out the final value of each variable
							</li>
							<li className="flex gap-2">
								<span className="text-violet-500">→</span>
								Type your answers and press Check
							</li>
							<li className="flex gap-2">
								<span className="text-violet-500">→</span>
								10 challenges — starting easy, ending with a tricky swap!
							</li>
						</ul>
					</div>
					<GameButton onClick={handleStart}>Start</GameButton>
				</div>
			</div>
		);
	}

	// --- RENDER: RESULTS ---
	if (stage === "results") {
		const percent = Math.round((score / totalProblems) * 100);
		const medal =
			percent === 100
				? "🏆 Perfect score!"
				: percent >= 80
					? "🥇 Excellent work!"
					: percent >= 60
						? "🥈 Good effort!"
						: "🥉 Keep practising!";

		return (
			<div className="flex flex-col items-center justify-center min-h-screen p-6 bg-slate-100">
				<div className="w-full max-w-xl text-center space-y-6">
					<div className="text-6xl">
						{percent === 100 ? "🏆" : percent >= 70 ? "⭐" : "💡"}
					</div>
					<h2 className="text-4xl font-bold text-slate-800">Game Over!</h2>
					<p className="text-2xl font-semibold text-violet-600">{medal}</p>

					<div className="p-8 bg-white border shadow-sm border-slate-200 rounded-2xl">
						<p className="mb-2 text-sm tracking-wider uppercase text-slate-500">
							Your score
						</p>
						<p className="text-6xl font-bold text-violet-600">
							{score}
							<span className="text-3xl text-slate-400">
								{" "}
								/ {totalProblems}
							</span>
						</p>
						<div className="h-3 mt-4 overflow-hidden rounded-full bg-slate-200">
							<div
								className="h-full rounded-full transition-all duration-700 bg-linear-to-r from-violet-500 to-purple-400"
								style={{ width: `${percent}%` }}
							/>
						</div>
						<p className="mt-2 text-sm text-slate-500">{percent}%</p>
					</div>

					<div className="flex flex-col justify-center gap-3 sm:flex-row">
						<GameButton onClick={handleRestart}>
							<RotateCcw className="inline w-5 h-5 mr-2" />
							Play Again
						</GameButton>
						<BackToHub location="/programming" />
					</div>
				</div>
			</div>
		);
	}

	// --- RENDER: PLAYING / FEEDBACK ---
	const isAllFilled = currentProblem.variables.every(
		(v) => (userAnswers[v.name] ?? "").trim() !== "",
	);

	return (
		<div className="flex flex-col items-center justify-start min-h-screen px-4 pt-10 pb-16 bg-slate-100">
			<div className="w-full max-w-2xl space-y-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<BackToHub location="/programming" />
					<div className="flex items-center gap-3">
						<span className="text-sm text-slate-500">
							{currentIndex + 1} / {totalProblems}
						</span>
						<div className="px-4 py-1 text-sm font-semibold bg-white border rounded-full shadow-sm border-slate-200 text-violet-600">
							Score: {score}
						</div>
					</div>
				</div>

				{/* Progress bar */}
				<div className="h-2 overflow-hidden rounded-full bg-slate-200">
					<div
						className="h-full rounded-full transition-all duration-500 bg-linear-to-r from-violet-500 to-purple-400"
						style={{
							width: `${((currentIndex + (stage === "feedback" ? 1 : 0)) / totalProblems) * 100}%`,
						}}
					/>
				</div>

				{/* Problem card */}
				<div className="overflow-hidden border shadow-lg bg-slate-800 border-slate-700 rounded-2xl">
					{/* Title bar */}
					<div className="flex items-center justify-between px-6 py-3 border-b bg-slate-700 border-slate-600">
						<span className="font-mono text-sm text-slate-400">
							problem_{currentIndex + 1}.py
						</span>
						<span className="text-sm font-semibold text-violet-300">
							{currentProblem.title}
						</span>
					</div>

					{/* Code block */}
					<div className="px-6 py-5 font-mono text-base space-y-1.5 bg-slate-900">
						{numberedLines.map(({ line, lineNum }) => (
							<div
								key={`${currentProblem.id}-line-${lineNum}`}
								className="flex items-baseline gap-4"
							>
								<span className="w-4 text-xs text-right select-none text-slate-500 shrink-0">
									{lineNum}
								</span>
								<span className="leading-relaxed text-green-300">{line}</span>
							</div>
						))}
					</div>
				</div>

				{/* Question */}
				<div className="space-y-4">
					<p className="text-base font-medium text-center text-slate-700">
						What are the final values of each variable?
					</p>

					<div className="space-y-3">
						{currentProblem.variables.map((variable, i) => {
							const isCorrect = answerResults?.[variable.name];
							const isWrong =
								answerResults !== null && !answerResults[variable.name];

							return (
								<div
									key={variable.name}
									className={`flex items-center gap-3 border rounded-xl px-5 py-3 transition-colors ${
										isCorrect
											? "border-green-400 bg-green-50"
											: isWrong
												? "border-red-400 bg-red-50"
												: "border-slate-200 bg-white"
									}`}
								>
									{/* Variable name */}
									<label
										htmlFor={`var-${variable.name}`}
										className="font-mono text-base font-semibold text-violet-700 min-w-20"
									>
										{variable.name}
									</label>
									<span className="font-mono text-slate-400">=</span>

									{/* Input */}
									<input
										id={`var-${variable.name}`}
										ref={i === 0 ? firstInputRef : undefined}
										type="text"
										inputMode="numeric"
										value={userAnswers[variable.name] ?? ""}
										onChange={(e) =>
											handleInputChange(variable.name, e.target.value)
										}
										onKeyDown={handleKeyDown}
										disabled={stage === "feedback"}
										placeholder="?"
										className={`bg-white border rounded-lg px-4 py-2 font-mono text-base text-slate-800 w-28 text-center focus:outline-none focus:ring-2 transition-colors ${
											isCorrect
												? "border-green-400 focus:ring-green-400/40"
												: isWrong
													? "border-red-400 focus:ring-red-400/40"
													: "border-slate-300 focus:ring-violet-400/40"
										} disabled:opacity-70`}
										autoComplete="off"
									/>

									{/* Feedback icons */}
									{isCorrect && (
										<CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
									)}
									{isWrong && (
										<div className="flex items-center gap-2">
											<XCircle className="w-5 h-5 text-red-400 shrink-0" />
											<span className="font-mono text-sm text-green-400">
												→ {variable.expectedValue}
											</span>
										</div>
									)}
								</div>
							);
						})}
					</div>
				</div>

				{/* Hint */}
				{stage === "playing" && (
					<div className="text-center">
						{showHint ? (
							<div className="px-5 py-3 text-sm border bg-amber-50 border-amber-300 rounded-xl text-amber-700">
								💡 {currentProblem.hint}
							</div>
						) : (
							<button
								type="button"
								onClick={() => setShowHint(true)}
								className="text-sm underline transition-colors text-slate-400 hover:text-slate-600 underline-offset-2"
							>
								Show hint
							</button>
						)}
					</div>
				)}

				{/* Feedback message */}
				{stage === "feedback" && (
					<div
						className={`rounded-xl px-5 py-4 text-center text-base font-medium border ${
							currentProblem.variables.every((v) => answerResults?.[v.name])
								? "bg-green-50 border-green-400 text-green-700"
								: "bg-red-50 border-red-400 text-red-700"
						}`}
					>
						{currentProblem.variables.every((v) => answerResults?.[v.name]) ? (
							<>✅ Correct! Well done — you traced the code perfectly.</>
						) : (
							<>
								❌ Not quite — the correct values are shown above in green.
								Trace each line carefully next time!
							</>
						)}
					</div>
				)}

				{/* Action buttons */}
				<div className="flex justify-center pt-2">
					{stage === "playing" ? (
						<GameButton
							onClick={handleSubmit}
							className={!isAllFilled ? "opacity-50 cursor-not-allowed" : ""}
						>
							Check Answers
						</GameButton>
					) : (
						<GameButton onClick={handleNext}>
							{currentIndex + 1 >= totalProblems ? "See Results" : "Next →"}
						</GameButton>
					)}
				</div>
			</div>
		</div>
	);
};

export default VariableTracerGame;
