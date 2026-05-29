import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { BackToHub } from "./Buttons";

type Mode = "denaryToBinary" | "binaryToDenary";
type Difficulty = "easy" | "medium" | "hard" | "expert";

const DIFFICULTY_CONFIG: Record<
	Difficulty,
	{ max: number; bits: number; label: string; points: number }
> = {
	easy: { max: 31, bits: 5, label: "Easy (0–31)", points: 1 },
	medium: { max: 127, bits: 7, label: "Medium (0–127)", points: 2 },
	hard: { max: 255, bits: 8, label: "Hard (0–255)", points: 3 },
	expert: { max: 1023, bits: 10, label: "Expert (0–1023)", points: 4 },
};

const getPlaceValues = (bits: number): number[] =>
	Array.from({ length: bits }, (_, i) => 2 ** (bits - 1 - i));

const randomNumber = (max: number): number =>
	Math.floor(Math.random() * (max + 1));

const toBinaryBits = (num: number, bits: number): string[] =>
	num.toString(2).padStart(bits, "0").split("");

const BinaryDenaryTool: React.FC = () => {
	const [mode, setMode] = useState<Mode>("denaryToBinary");
	const [difficulty, setDifficulty] = useState<Difficulty>("easy");
	const [showPlaceValues, setShowPlaceValues] = useState(true);

	const [currentNumber, setCurrentNumber] = useState<number>(0);
	const [bitInputs, setBitInputs] = useState<string[]>([]);
	const [denaryInput, setDenaryInput] = useState("");
	const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(
		null,
	);
	const [streak, setStreak] = useState(0);
	const [bestStreak, setBestStreak] = useState(0);
	const [points, setPoints] = useState(0);
	const bitRefs = useRef<(HTMLInputElement | null)[]>([]);
	const denaryRef = useRef<HTMLInputElement>(null);
	const skipNextEnterRef = useRef(false);

	const { bits, max } = DIFFICULTY_CONFIG[difficulty];
	const placeValues = getPlaceValues(bits);
	const correctBits = toBinaryBits(currentNumber, bits);

	const nextQuestion = useCallback(
		(currentMode: Mode, currentBits: number, currentMax: number) => {
			const num = randomNumber(currentMax);
			setCurrentNumber(num);
			setBitInputs(new Array(currentBits).fill(""));
			setDenaryInput("");
			setFeedback(null);
			setTimeout(() => {
				if (currentMode === "denaryToBinary") {
					bitRefs.current[0]?.focus();
				} else {
					denaryRef.current?.focus();
				}
			}, 50);
		},
		[],
	);

	// Generate a new question whenever difficulty or mode changes
	useEffect(() => {
		nextQuestion(mode, bits, max);
	}, [mode, bits, max, nextQuestion]);

	const checkAnswer = useCallback(
		(currentBitInputs: string[], currentDenaryInput: string) => {
			let isCorrect = false;
			if (mode === "denaryToBinary") {
				isCorrect = currentBitInputs.join("") === correctBits.join("");
			} else {
				isCorrect = parseInt(currentDenaryInput, 10) === currentNumber;
			}
			setFeedback(isCorrect ? "correct" : "incorrect");
			if (isCorrect) {
				const earned =
					DIFFICULTY_CONFIG[difficulty].points + (showPlaceValues ? 0 : 1);
				setPoints((p) => p + earned);
				setStreak((s) => {
					const next = s + 1;
					setBestStreak((best) => Math.max(best, next));
					return next;
				});
			} else {
				setStreak(0);
			}
		},
		[mode, correctBits, currentNumber, difficulty, showPlaceValues],
	);

	// Auto-check in denaryToBinary when all bits are filled
	useEffect(() => {
		if (
			mode === "denaryToBinary" &&
			bitInputs.length === bits &&
			bitInputs.every((b) => b !== "") &&
			feedback === null
		) {
			checkAnswer(bitInputs, "");
		}
	}, [bitInputs, bits, mode, feedback, checkAnswer]);

	const handleBitInput = (index: number, value: string) => {
		const char = value.replace(/[^01]/g, "").slice(-1);
		const newInputs = [...bitInputs];
		newInputs[index] = char;
		setBitInputs(newInputs);
		setFeedback(null);
		if (char !== "" && index < bits - 1) {
			bitRefs.current[index + 1]?.focus();
		}
	};

	const handleBitKeyDown = (
		index: number,
		e: React.KeyboardEvent<HTMLInputElement>,
	) => {
		if (e.key === "Backspace" && bitInputs[index] === "" && index > 0) {
			bitRefs.current[index - 1]?.focus();
		}
	};

	const handleDenaryKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && denaryInput !== "") {
			skipNextEnterRef.current = true;
			checkAnswer(bitInputs, denaryInput);
		}
	};

	const handleNextQuestion = useCallback(
		() => nextQuestion(mode, bits, max),
		[nextQuestion, mode, bits, max],
	);

	// Press Enter to advance to the next question when feedback is showing
	useEffect(() => {
		if (feedback === null) return;
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Enter") {
				if (skipNextEnterRef.current) {
					skipNextEnterRef.current = false;
					return;
				}
				e.preventDefault();
				handleNextQuestion();
			}
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [feedback, handleNextQuestion]);

	const ducksToShow = Math.min(streak, 10);
	const pointsPerCorrect =
		DIFFICULTY_CONFIG[difficulty].points + (showPlaceValues ? 0 : 1);

	return (
		<div className="w-full p-4 flex flex-col items-center gap-5">
			{/* Header */}
			<div className="w-full max-w-3xl flex items-center gap-2">
				<BackToHub location="/maths" />
				<h1 className="text-2xl font-bold text-slate-800">Binary ↔ Denary</h1>
			</div>

			{/* Controls bar */}
			<div className="w-full max-w-3xl bg-white rounded-2xl shadow-md p-4 flex flex-wrap gap-4 items-center justify-between">
				{/* Mode toggle */}
				<div className="flex rounded-xl overflow-hidden border border-slate-200 text-sm font-semibold">
					<button
						type="button"
						onClick={() => setMode("denaryToBinary")}
						className={`px-4 py-2 transition-colors ${
							mode === "denaryToBinary"
								? "bg-blue-500 text-white"
								: "bg-white text-slate-600 hover:bg-slate-50"
						}`}
					>
						Denary → Binary
					</button>
					<button
						type="button"
						onClick={() => setMode("binaryToDenary")}
						className={`px-4 py-2 transition-colors ${
							mode === "binaryToDenary"
								? "bg-purple-500 text-white"
								: "bg-white text-slate-600 hover:bg-slate-50"
						}`}
					>
						Binary → Denary
					</button>
				</div>

				{/* Difficulty */}
				<div className="flex gap-2 items-center flex-wrap">
					<span className="text-sm font-medium text-slate-500">
						Difficulty:
					</span>
					{(["easy", "medium", "hard", "expert"] as Difficulty[]).map((d) => (
						<button
							key={d}
							type="button"
							onClick={() => setDifficulty(d)}
							className={`px-3 py-1 rounded-lg text-sm font-semibold capitalize transition-colors ${
								difficulty === d
									? "bg-amber-500 text-white"
									: "bg-slate-100 text-slate-600 hover:bg-slate-200"
							}`}
						>
							{d}
						</button>
					))}
				</div>

				{/* Place values toggle */}
				<label className="flex items-center gap-2 cursor-pointer select-none">
					<input
						type="checkbox"
						checked={showPlaceValues}
						onChange={(e) => setShowPlaceValues(e.target.checked)}
						className="w-4 h-4 accent-blue-500"
					/>
					<span className="text-sm font-medium text-slate-600">
						Show place values
					</span>
				</label>
			</div>

			{/* Stats bar */}
			<div className="w-full max-w-3xl flex gap-3 flex-wrap justify-center">
				{/* Streak card */}
				<div className="flex-1 min-w-37.5 bg-white rounded-2xl shadow-sm px-5 py-3 flex flex-col items-center gap-1">
					<span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
						🦆 Streak
					</span>
					<div className="flex items-baseline gap-2">
						<span className="text-4xl font-bold text-amber-500 tabular-nums">
							{streak}
						</span>
						{bestStreak > 0 && (
							<span className="text-xs font-medium text-slate-400">
								best: {bestStreak}
							</span>
						)}
					</div>
					{streak > 0 && (
						<div className="flex flex-wrap justify-center gap-0.5 max-w-45">
							{[...Array(ducksToShow).keys()].map((n) => (
								<span key={n} className="text-base leading-none">
									🦆
								</span>
							))}
							{streak > 10 && (
								<span className="text-xs font-bold text-amber-600">
									…×{streak}
								</span>
							)}
						</div>
					)}
				</div>
				{/* Points card */}
				<div className="flex-1 min-w-37.5 bg-white rounded-2xl shadow-sm px-5 py-3 flex flex-col items-center gap-1">
					<span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
						⭐ Points
					</span>
					<span className="text-4xl font-bold text-yellow-500 tabular-nums">
						{points}
					</span>
					<span className="text-xs text-slate-400 font-medium">
						+{pointsPerCorrect} per correct
						{!showPlaceValues && (
							<span className="text-emerald-500 font-semibold">
								{" "}
								(incl. +1 bonus)
							</span>
						)}
					</span>
				</div>
			</div>

			{/* Main card */}
			<div className="w-full max-w-3xl bg-white rounded-2xl shadow-md p-6 flex flex-col items-center gap-6">
				{mode === "denaryToBinary" ? (
					<>
						{/* Prompt */}
						<div className="text-center">
							<p className="text-sm font-medium text-slate-500 mb-2">
								Convert to binary:
							</p>
							<p className="text-7xl font-bold text-slate-800 tabular-nums">
								{currentNumber}
							</p>
						</div>

						{/* Bit input grid */}
						<div className="flex gap-2 flex-wrap justify-center">
							{placeValues.map((pv, i) => {
								const isWrongBit =
									feedback === "incorrect" && bitInputs[i] !== correctBits[i];
								const isCorrectBit = feedback === "correct";
								return (
									<div key={pv} className="flex flex-col items-center gap-1">
										{showPlaceValues && (
											<span className="text-xs font-mono text-slate-400 tabular-nums">
												{pv}
											</span>
										)}
										<input
											ref={(el) => {
												bitRefs.current[i] = el;
											}}
											type="text"
											inputMode="numeric"
											maxLength={1}
											value={bitInputs[i] ?? ""}
											onChange={(e) => handleBitInput(i, e.target.value)}
											onKeyDown={(e) => handleBitKeyDown(i, e)}
											disabled={feedback !== null}
											className={`w-12 h-12 text-center text-xl font-bold border-2 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:cursor-default ${
												isCorrectBit
													? "border-green-400 bg-green-50 text-green-700"
													: isWrongBit
														? "border-red-400 bg-red-50 text-red-600"
														: bitInputs[i] !== ""
															? "border-blue-400 bg-blue-50 text-blue-700"
															: "border-slate-300 bg-white text-slate-800"
											}`}
										/>
									</div>
								);
							})}
						</div>
					</>
				) : (
					<>
						{/* Binary display */}
						<div className="text-center">
							<p className="text-sm font-medium text-slate-500 mb-2">
								Convert to denary:
							</p>
							<div className="flex gap-2 flex-wrap justify-center">
								{correctBits.map((bit, i) => (
									<div
										key={placeValues[i]}
										className="flex flex-col items-center gap-1"
									>
										{showPlaceValues && (
											<span className="text-xs font-mono text-slate-400 tabular-nums">
												{placeValues[i]}
											</span>
										)}
										<div
											className={`w-12 h-12 flex items-center justify-center text-xl font-bold border-2 rounded-xl ${
												bit === "1"
													? "border-purple-400 bg-purple-50 text-purple-700"
													: "border-slate-200 bg-slate-50 text-slate-400"
											}`}
										>
											{bit}
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Denary input */}
						<div className="flex flex-col items-center gap-3">
							<label
								htmlFor="denary-answer"
								className="text-sm font-medium text-slate-500"
							>
								Your denary answer:
							</label>
							<input
								id="denary-answer"
								ref={denaryRef}
								type="text"
								inputMode="numeric"
								value={denaryInput}
								onChange={(e) => {
									setDenaryInput(e.target.value.replace(/[^0-9]/g, ""));
									setFeedback(null);
								}}
								onKeyDown={handleDenaryKeyDown}
								disabled={feedback !== null}
								placeholder="?"
								className={`w-36 h-16 text-center text-3xl font-bold border-2 rounded-2xl transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:cursor-default ${
									feedback === "correct"
										? "border-green-400 bg-green-50 text-green-700"
										: feedback === "incorrect"
											? "border-red-400 bg-red-50 text-red-600"
											: "border-slate-300 text-slate-800"
								}`}
							/>
							{feedback === null && (
								<button
									type="button"
									onClick={() => checkAnswer(bitInputs, denaryInput)}
									disabled={denaryInput === ""}
									className="px-7 py-2.5 bg-purple-500 text-white font-semibold rounded-full hover:bg-purple-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
								>
									Check
								</button>
							)}
						</div>
					</>
				)}

				{/* Feedback banner */}
				{feedback !== null && (
					<div
						className={`w-full text-center py-3 px-5 rounded-xl ${
							feedback === "correct"
								? "bg-green-100 text-green-700"
								: "bg-red-100 text-red-700"
						}`}
					>
						{feedback === "correct" ? (
							<p className="font-semibold text-lg">✅ Correct!</p>
						) : (
							<div>
								<p className="font-semibold text-lg">❌ Not quite!</p>
								<p className="text-sm mt-1 font-mono font-bold">
									{mode === "denaryToBinary"
										? `${currentNumber} = ${correctBits.join("")}₂`
										: `${correctBits.join("")}₂ = ${currentNumber}`}
								</p>
							</div>
						)}
					</div>
				)}

				{/* Next question button */}
				{feedback !== null && (
					<button
						type="button"
						onClick={handleNextQuestion}
						className="px-8 py-3 bg-blue-500 text-white font-bold rounded-full hover:bg-blue-600 active:scale-95 transition-all text-lg"
					>
						Next →
					</button>
				)}
			</div>

			<p className="text-xs text-slate-400">
				{DIFFICULTY_CONFIG[difficulty].label}
			</p>
		</div>
	);
};

export default BinaryDenaryTool;
