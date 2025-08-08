import { CheckCircle, XCircle } from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { shuffleArray } from "../utils/utils";
import GameButton from "./GameButton";

// --- DATA ---
// A list of common computer hardware devices.
const hardwareList: string[] = [
	"headphones",
	"printer",
	"scanner",
	"game controller",
	"keyboard",
	"monitor",
	"mouse",
	"webcam",
	"speakers",
	"touchscreen",
	"microphone",
	"projector",
	"smartwatch",
	"button",
	"switch",
	"CPU",
	"RAM",
	"motherboard",
	"graphics card",
	"hard drive",
	"SSD",
	"power supply",
	"case",
	"fan",
	"router",
	"USB drive",
	"digital camera",
	"earphones",
	"trackpad",
];

// A Set for quick, case-insensitive lookups.
const hardwareSet = new Set(hardwareList.map((item) => item.toLowerCase()));

// --- UI COMPONENTS (Styled like PhishingGame.tsx) ---

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "secondary";
}

const Button: React.FC<ButtonProps> = ({
	children,
	className,
	variant = "primary",
	...props
}) => {
	const baseClasses =
		"px-6 py-3 rounded-lg font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2";
	const variantClasses = {
		primary:
			"bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-700/50 transform hover:-translate-y-1 focus:ring-blue-500",
		secondary: "text-slate-600 hover:text-slate-800 font-semibold py-3 px-6",
	};
	return (
		<button
			className={`${baseClasses} ${variantClasses[variant]} ${className}`}
			{...props}
		>
			{children}
		</button>
	);
};

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({
	children,
	className,
}) => (
	<div
		className={`bg-white rounded-xl shadow-lg p-6 md:p-8 w-full max-w-2xl mx-auto ${className}`}
	>
		{children}
	</div>
);

// --- GAME MODE COMPONENTS ---

/**
 * Mode 1: Name The Hardware
 * Users have 1 minute to list as many hardware devices as they can.
 */
const NameTheHardware: React.FC<{ onBack: () => void }> = ({ onBack }) => {
	const INITIAL_SECONDS = 60;

	const [timeLeft, setTimeLeft] = useState(INITIAL_SECONDS);
	const [inputValue, setInputValue] = useState("");
	const [enteredWords, setEnteredWords] = useState<
		{ word: string; status: "correct" | "incorrect" }[]
	>([]);
	const [correctWords, setCorrectWords] = useState<Set<string>>(new Set());
	const [isFinished, setIsFinished] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const finishGame = useCallback(() => {
		setIsFinished(true);
	}, []);

	// Timer logic
	useEffect(() => {
		if (isFinished) return;

		const timer = setInterval(() => {
			setTimeLeft((prevTime) => {
				if (prevTime <= 1) {
					clearInterval(timer);
					finishGame();
					return 0;
				}
				return prevTime - 1;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, [isFinished, finishGame]);

	// Focus input on mount
	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	const handleSubmit = (e: React.FormEvent | React.MouseEvent) => {
		e.preventDefault();
		const word = inputValue.trim().toLowerCase();
		if (!word) return;

		const isCorrect = hardwareSet.has(word);
		const isNew = !correctWords.has(word);

		if (isCorrect && isNew) {
			setEnteredWords((prev) => [
				{ word: inputValue.trim(), status: "correct" },
				...prev,
			]);
			setCorrectWords((prev) => new Set(prev).add(word));
		} else {
			setEnteredWords((prev) => [
				{ word: inputValue.trim(), status: "incorrect" },
				...prev,
			]);
		}
		setInputValue("");
	};

	const getMissedWords = () => {
		const allHardware = shuffleArray(hardwareList);
		const missed = allHardware.filter(
			(hw) => !correctWords.has(hw.toLowerCase()),
		);
		return missed.slice(0, 3);
	};

	if (isFinished) {
		const getPerformanceFeedback = () => {
			const score = correctWords.size;
			if (score >= 15)
				return {
					title: "Hardware Master!",
					message: "Incredible! You're a true hardware expert!",
					color: "text-purple-600",
					emoji: "🏆",
				};
			if (score >= 12)
				return {
					title: "Excellent Knowledge!",
					message: "Outstanding work! You really know your hardware.",
					color: "text-green-600",
					emoji: "🎉",
				};
			if (score >= 8)
				return {
					title: "Great Job!",
					message: "Well done! You have solid hardware knowledge.",
					color: "text-blue-600",
					emoji: "👏",
				};
			if (score >= 5)
				return {
					title: "Good Effort!",
					message: "Not bad! Keep studying to improve your score.",
					color: "text-yellow-600",
					emoji: "👍",
				};
			if (score >= 2)
				return {
					title: "Keep Trying!",
					message: "You're getting started! Practice makes perfect.",
					color: "text-orange-600",
					emoji: "💪",
				};
			return {
				title: "Don't Give Up!",
				message: "Everyone starts somewhere. Try again!",
				color: "text-red-600",
				emoji: "🎯",
			};
		};

		const feedback = getPerformanceFeedback();

		return (
			<Card>
				<div className="text-center">
					<div className="text-6xl mb-4">{feedback.emoji}</div>
					<h2 className={`text-3xl font-bold mb-2 ${feedback.color}`}>
						{feedback.title}
					</h2>
					<p className="text-lg text-slate-600 mb-6">{feedback.message}</p>

					<div className="bg-slate-50 rounded-lg p-6 mb-6">
						<p className="text-xl text-slate-700 mb-2">Hardware Items Named</p>
						<p className="text-6xl font-bold text-blue-600 mb-4">
							{correctWords.size}
						</p>
						<p className="text-lg text-slate-700 mb-4">
							Here are a few you missed:
						</p>
						<ul className="text-slate-600 space-y-1 mb-4">
							{getMissedWords().map((word) => (
								<li key={word}>{word}</li>
							))}
						</ul>
					</div>

					<Button onClick={onBack}>Play Again</Button>
				</div>
			</Card>
		);
	}

	return (
		<Card>
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-2xl md:text-3xl font-bold text-slate-800">
					Name the Hardware!
				</h2>
				<div className="text-3xl font-bold text-red-500 bg-red-100 px-4 py-2 rounded-lg">
					{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
				</div>
			</div>
			<p className="text-slate-600 mb-6">
				You have {INITIAL_SECONDS} seconds to name all the computer hardware you
				can think of. Good luck!
			</p>

			<div className="flex flex-col sm:flex-row gap-2 mb-4">
				<input
					ref={inputRef}
					type="text"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							handleSubmit(e);
						}
					}}
					placeholder="e.g. Keyboard"
					className="flex-grow w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
				/>
				<Button onClick={handleSubmit} className="w-full sm:w-auto">
					Enter
				</Button>
			</div>

			<div className="flex justify-center mb-6">
				<GameButton onClick={finishGame}>That's All I Know</GameButton>
			</div>

			<div className="h-64 overflow-y-auto bg-slate-50 p-4 rounded-lg border border-slate-200">
				<ul className="space-y-2">
					{enteredWords.map((item, index) => (
						<li
							key={`${item.word}-${index}`}
							className={`p-2 rounded-md text-white font-semibold flex items-center gap-3 ${
								item.status === "correct" ? "bg-green-500" : "bg-amber-500"
							}`}
						>
							{item.status === "correct" ? (
								<CheckCircle className="h-6 w-6" />
							) : (
								<XCircle className="h-6 w-6" />
							)}
							{item.word}
						</li>
					))}
				</ul>
			</div>
		</Card>
	);
};

/**
 * Mode 2: Guess the Word
 * Users are shown a hint (e.g., p_____r) and must guess the hardware.
 */
const GuessTheWord: React.FC<{ onBack: () => void }> = ({ onBack }) => {
	const [questions, setQuestions] = useState<string[]>([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [guess, setGuess] = useState<string[]>([]);
	const [score, setScore] = useState(0);
	const [isFinished, setIsFinished] = useState(false);
	const [feedback, setFeedback] = useState<{
		message: string;
		color: string;
		isCorrect: boolean;
		letterStates: ("correct" | "incorrect" | "neutral")[];
	} | null>(null);
	const [wordBoundaries, setWordBoundaries] = useState<
		{ start: number; end: number }[]
	>([]);
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

	// Setup questions for the game
	useEffect(() => {
		setQuestions(
			shuffleArray(hardwareList)
				.filter((h) => h.length > 2)
				.slice(0, 10),
		);
	}, []);

	// Reset state and focus when the question changes
	useEffect(() => {
		if (questions.length > 0 && currentIndex < questions.length) {
			const currentWord = questions[currentIndex];

			// Calculate word boundaries to identify hint letters
			const boundaries: { start: number; end: number }[] = [];
			let startIndex = 0;
			currentWord.split(" ").forEach((word) => {
				const endIndex = startIndex + word.length - 1;
				if (word.length > 2) {
					boundaries.push({ start: startIndex, end: endIndex });
				}
				startIndex += word.length + 1; // +1 for the space
			});
			setWordBoundaries(boundaries);

			// Initialize the guess array with hint letters pre-filled
			const initialGuess = currentWord.split("").map((char, index) => {
				if (char === " ") return " ";
				const isHintLetter = boundaries.some(
					(b) => index === b.start || index === b.end,
				);
				return isHintLetter ? char : "";
			});
			setGuess(initialGuess);

			inputRefs.current = Array(currentWord.length).fill(null);

			// Defer focus to the first empty input box
			setTimeout(() => {
				const firstEmptyIndex = initialGuess.findIndex((char) => char === "");
				if (firstEmptyIndex !== -1) {
					inputRefs.current[firstEmptyIndex]?.focus();
				}
			}, 0);
		}
	}, [currentIndex, questions]);

	const handleSubmit = (e?: React.FormEvent | React.KeyboardEvent) => {
		e?.preventDefault();
		if (feedback) return;

		const finalGuess = guess.join("");
		const correctAnswer = questions[currentIndex];
		const letterStates: ("correct" | "incorrect" | "neutral")[] = [];

		// Check each letter
		for (let i = 0; i < correctAnswer.length; i++) {
			if (correctAnswer[i] === " ") {
				letterStates.push("neutral");
			} else if (
				guess[i] &&
				guess[i].toLowerCase() === correctAnswer[i].toLowerCase()
			) {
				letterStates.push("correct");
			} else {
				letterStates.push("incorrect");
			}
		}

		if (
			!finalGuess.trim() ||
			finalGuess.toLowerCase() !== correctAnswer.toLowerCase()
		) {
			setFeedback({
				message: `Not quite! The answer was: ${correctAnswer}`,
				color: "text-red-500",
				isCorrect: false,
				letterStates,
			});
		} else {
			setScore((prev) => prev + 1);
			setFeedback({
				message: "Correct!",
				color: "text-green-500",
				isCorrect: true,
				letterStates,
			});
		}

		setTimeout(() => {
			if (currentIndex < questions.length - 1) {
				setCurrentIndex((prev) => prev + 1);
				setFeedback(null);
			} else {
				setIsFinished(true);
			}
		}, 1500);
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		index: number,
	) => {
		const newGuess = [...guess];
		const value = e.target.value.slice(-1).toLowerCase();
		newGuess[index] = value;
		setGuess(newGuess);

		if (value) {
			let nextIndex = index + 1;
			// Find the next available (enabled) input
			while (
				nextIndex < inputRefs.current.length &&
				(!inputRefs.current[nextIndex] ||
					inputRefs.current[nextIndex]?.disabled)
			) {
				nextIndex++;
			}
			if (nextIndex < inputRefs.current.length) {
				inputRefs.current[nextIndex]?.focus();
			}
		}
	};

	const handleKeyDown = (
		e: React.KeyboardEvent<HTMLInputElement>,
		index: number,
	) => {
		if (e.key === "Backspace" && !guess[index]) {
			let prevIndex = index - 1;
			// Find the previous available (enabled) input
			while (
				prevIndex >= 0 &&
				(!inputRefs.current[prevIndex] ||
					inputRefs.current[prevIndex]?.disabled)
			) {
				prevIndex--;
			}
			if (prevIndex >= 0) {
				inputRefs.current[prevIndex]?.focus();
			}
		}

		if (e.key === "Enter") {
			const isComplete = !guess.some((char) => char === "");
			if (isComplete) {
				handleSubmit(e);
			}
		}
	};

	if (isFinished) {
		const percentage = Math.round((score / questions.length) * 100);
		const getPerformanceFeedback = () => {
			if (percentage === 100)
				return {
					title: "Perfect Score!",
					message: "Outstanding! You're a hardware expert!",
					color: "text-green-600",
					emoji: "🏆",
				};
			if (percentage >= 80)
				return {
					title: "Excellent Work!",
					message: "Great job! You know your hardware well.",
					color: "text-green-600",
					emoji: "🎉",
				};
			if (percentage >= 60)
				return {
					title: "Good Job!",
					message: "Nice work! Keep practicing to improve.",
					color: "text-blue-600",
					emoji: "👍",
				};
			if (percentage >= 40)
				return {
					title: "Getting There!",
					message: "You're on the right track. Try again!",
					color: "text-yellow-600",
					emoji: "💪",
				};
			return {
				title: "Keep Practicing!",
				message: "Don't give up! Practice makes perfect.",
				color: "text-orange-600",
				emoji: "🎯",
			};
		};

		const feedback = getPerformanceFeedback();

		return (
			<Card>
				<div className="text-center">
					<div className="text-6xl mb-4">{feedback.emoji}</div>
					<h2 className={`text-3xl font-bold mb-2 ${feedback.color}`}>
						{feedback.title}
					</h2>
					<p className="text-lg text-slate-600 mb-6">{feedback.message}</p>

					<div className="bg-slate-50 rounded-lg p-6 mb-6">
						<p className="text-xl text-slate-700 mb-2">Your Score</p>
						<div className="flex items-center justify-center gap-4 mb-4">
							<span className="text-5xl font-bold text-blue-600">{score}</span>
							<span className="text-2xl text-slate-400">/</span>
							<span className="text-5xl font-bold text-slate-400">
								{questions.length}
							</span>
						</div>
						<div className="w-full bg-slate-200 rounded-full h-3 mb-2">
							<div
								className="bg-blue-600 h-3 rounded-full transition-all duration-500"
								style={{ width: `${percentage}%` }}
							></div>
						</div>
						<p className="text-lg font-semibold text-slate-700">
							{percentage}% Correct
						</p>
					</div>

					<div className="flex flex-col sm:flex-row gap-3 justify-center">
						<Button onClick={onBack}>Play Again</Button>
						<Button variant="secondary" onClick={onBack}>
							Try Different Mode
						</Button>
					</div>
				</div>
			</Card>
		);
	}

	if (questions.length === 0) {
		return (
			<Card>
				<p>Loading questions...</p>
			</Card>
		);
	}

	return (
		<Card>
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-2xl md:text-3xl font-bold text-slate-800">
					Guess the Word!
				</h2>
				<div className="text-xl font-bold text-slate-600 bg-slate-100 px-4 py-2 rounded-lg">
					{currentIndex + 1} / {questions.length}
				</div>
			</div>

			<div className="text-center my-8">
				<p className="text-2xl font-semibold text-slate-700 mb-6">
					What hardware is this?
				</p>
			</div>

			<div className="flex flex-col items-center gap-4 mb-4">
				{questions[currentIndex].split(" ").map((word, wordIndex) => (
					<div
						key={word}
						className="flex justify-center items-center gap-1 sm:gap-2"
					>
						{word.split("").map((char, charIndex) => {
							const globalIndex =
								questions[currentIndex].split(" ").slice(0, wordIndex).join(" ")
									.length +
								(wordIndex > 0 ? 1 : 0) +
								charIndex;

							const isHintLetter = wordBoundaries.some(
								(b) => globalIndex === b.start || globalIndex === b.end,
							);

							const getLetterFeedbackColor = () => {
								if (!feedback) return "border-slate-300";
								const letterState = feedback.letterStates[globalIndex];
								if (letterState === "correct")
									return "border-green-500 bg-green-100";
								if (letterState === "incorrect")
									return "border-red-500 bg-red-100";
								return "border-slate-300";
							};

							const getBaseColor = () => {
								if (isHintLetter)
									return "border-slate-300 bg-slate-200 text-slate-800";
								return getLetterFeedbackColor();
							};

							return (
								<input
									key={`answer-${globalIndex}-${char}`}
									ref={(el) => {
										inputRefs.current[globalIndex] = el;
									}}
									type="text"
									maxLength={1}
									value={guess[globalIndex] || ""}
									onChange={(e) => handleInputChange(e, globalIndex)}
									onKeyDown={(e) => handleKeyDown(e, globalIndex)}
									disabled={isHintLetter || !!feedback}
									className={`w-10 h-12 sm:w-12 sm:h-16 text-center text-2xl sm:text-3xl font-bold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${getBaseColor()} disabled:cursor-not-allowed`}
								/>
							);
						})}
					</div>
				))}
			</div>

			<div className="flex justify-center mt-6">
				<Button
					onClick={handleSubmit}
					className="w-full sm:w-auto"
					disabled={!!feedback}
				>
					Guess
				</Button>
			</div>

			{feedback && (
				<div
					className={`text-center font-bold text-lg h-8 mt-4 ${feedback.color}`}
				>
					{feedback.message}
				</div>
			)}
		</Card>
	);
};

// --- MAIN APP COMPONENT ---
// This component manages the overall state and renders the correct view.
const NameHardware = () => {
	const [mode, setMode] = useState<"menu" | "nameTheHardware" | "guessTheWord">(
		"menu",
	);

	const renderContent = () => {
		switch (mode) {
			case "nameTheHardware":
				return <NameTheHardware onBack={() => setMode("menu")} />;
			case "guessTheWord":
				return <GuessTheWord onBack={() => setMode("menu")} />;
			default:
				return (
					<Card>
						<div className="text-center">
							<h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-2">
								Hardware Practice
							</h1>
							<p className="text-lg text-slate-600 mb-8">
								Choose a game to play!
							</p>
							<div className="flex flex-col md:flex-row gap-4 justify-center">
								<Button onClick={() => setMode("nameTheHardware")}>
									Name the Hardware
								</Button>
								<Button onClick={() => setMode("guessTheWord")}>
									Guess the Word
								</Button>
							</div>
						</div>
					</Card>
				);
		}
	};

	return (
		<main className="bg-slate-100 min-h-screen w-full flex items-center justify-center p-4 font-sans">
			<div className="w-full">{renderContent()}</div>
		</main>
	);
};

export default NameHardware;
