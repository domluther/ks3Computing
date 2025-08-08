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

// --- HELPER FUNCTIONS ---

/**
 * Creates a word hint string, e.g., "p_____r" for "printer".
 * @param word The word to create a hint for.
 * @returns The hint string.
 */
const createWordHint = (phrase: string): string => {
	return phrase
		.split(" ")
		.map((word) => {
			if (word.length <= 2) {
				return word;
			}
			return (
				`${word[0]} ${"_ ".repeat(word.length - 2)}${word[word.length - 1]}`
			);
		})
		.join(" / ");
};

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
 * Users have 2 minutes to list as many hardware devices as they can.
 */
const NameTheHardware: React.FC<{ onBack: () => void }> = ({ onBack }) => {
	const [timeLeft, setTimeLeft] = useState(120);
	const [inputValue, setInputValue] = useState("");
	const [enteredWords, setEnteredWords] = useState<
		{ word: string; status: "correct" | "incorrect" }[]
	>([]);
	const [correctWords, setCorrectWords] = useState<Set<string>>(new Set());
	const [isFinished, setIsFinished] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

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
	}, [isFinished]);

	// Focus input on mount
	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	const handleSubmit = (e: React.FormEvent) => {
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

	const finishGame = useCallback(() => {
		setIsFinished(true);
	}, []);

	const getMissedWords = () => {
		const allHardware = shuffleArray(hardwareList);
		const missed = allHardware.filter(
			(hw) => !correctWords.has(hw.toLowerCase()),
		);
		return missed.slice(0, 3);
	};

	if (isFinished) {
		return (
			<Card>
				<div className="text-center">
					<h2 className="text-3xl font-bold text-slate-800 mb-2">Time's Up!</h2>
					<p className="text-xl text-slate-600 mb-4">Great effort!</p>
					<p className="text-5xl font-bold text-blue-600 mb-6">
						{correctWords.size}
					</p>
					<p className="text-lg text-slate-700 mb-2">
						Here are a few you missed:
					</p>
					<ul className="text-slate-600 space-y-1 mb-8">
						{getMissedWords().map((word) => (
							<li key={word}>{word}</li>
						))}
					</ul>
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
				You have 2 minutes to name all the computer hardware you can think of.
				Good luck!
			</p>

			<form
				onSubmit={handleSubmit}
				className="flex flex-col sm:flex-row gap-2 mb-4"
			>
				<input
					ref={inputRef}
					type="text"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					placeholder="e.g. Keyboard"
					className="flex-grow w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
				/>
				<Button type="submit" className="w-full sm:w-auto">
					Enter
				</Button>
			</form>

			<div className="flex justify-center mb-6">
				<GameButton onClick={finishGame}>That's All I Know</GameButton>
			</div>

			<div className="h-64 overflow-y-auto bg-slate-50 p-4 rounded-lg border border-slate-200">
				<ul className="space-y-2">
					{enteredWords.map((item) => (
						<li
							key={item.word}
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
	const [inputValue, setInputValue] = useState("");
	const [score, setScore] = useState(0);
	const [isFinished, setIsFinished] = useState(false);
	const [feedback, setFeedback] = useState<{
		message: string;
		color: string;
	} | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	// Setup questions for the game
	useEffect(() => {
		setQuestions(shuffleArray(hardwareList).slice(0, 10));
	}, []);

	// This effect handles focusing the input at the right times.
	useEffect(() => {
		if (!feedback && !isFinished) {
			inputRef.current?.focus();
		}
	}, [feedback, isFinished]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!inputValue.trim() || feedback) return;

		const currentWord = questions[currentIndex];
		if (inputValue.trim().toLowerCase() === currentWord.toLowerCase()) {
			setScore((prev) => prev + 1);
			setFeedback({ message: "Correct!", color: "text-green-500" });
		} else {
			setFeedback({
				message: `Not quite! The answer was ${currentWord}.`,
				color: "text-red-500",
			});
		}

		setTimeout(() => {
			if (currentIndex < 9) {
				setCurrentIndex((prev) => prev + 1);
				setInputValue("");
				setFeedback(null);
			} else {
				setIsFinished(true);
			}
		}, 1000);
	};

	if (isFinished) {
		return (
			<Card>
				<div className="text-center">
					<h2 className="text-3xl font-bold text-slate-800 mb-2">
						Round Over!
					</h2>
					<p className="text-xl text-slate-600 mb-4">You scored:</p>
					<p className="text-6xl font-bold text-blue-600 mb-8">{score} / 10</p>
					<Button onClick={onBack}>Play Again</Button>
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
					{currentIndex + 1} / 10
				</div>
			</div>

			<div className="text-center my-8">
				<p className="text-slate-600 mb-2">What hardware is this?</p>
				<p className="text-4xl md:text-5xl font-bold text-blue-600 tracking-widest bg-blue-50 p-4 rounded-lg">
					{createWordHint(questions[currentIndex])}
				</p>
			</div>

			<form
				onSubmit={handleSubmit}
				className="flex flex-col sm:flex-row gap-2 mb-4"
			>
				<input
					ref={inputRef}
					type="text"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					disabled={!!feedback}
					className="flex-grow w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-200"
				/>
				<Button
					type="submit"
					className="w-full sm:w-auto"
					disabled={!!feedback}
				>
					Guess
				</Button>
			</form>

			{feedback && (
				<div className={`text-center font-bold text-lg h-8 ${feedback.color}`}>
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
		// <main className="bg-slate-50 min-h-screen w-full flex items-center justify-center p-4 font-sans">
		// <div className="w-full">
		<>{renderContent()}</>
		// </div>
		// </main>
	);
};

export default NameHardware;
