import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { shuffleArray } from "../utils/utils";
import { BackToHub } from "./Buttons";

const ASCIIBinaryTool: React.FC = () => {
	const practiceMessages = [
		"Welcome",
		"Hello world",
		"I like Roblox",
		"Mario & Luigi",
		"Minecraft",
		"Spongebob",
		"Gaming fun",
		"Nintendo",
		"Quack quack",
		"I love coding",
	];

	const testMessages = [
		"Ducks love swimming in the pond.",
		"Yellow ducks waddle by the lake.",
		"Ducks eat breadcrumbs happily.",
		"Mario jumps over the castle walls!",
		"Super Mario saves Princess Peach!",
		"Mario collects coins in pipes.",
		"Luigi helps Mario on adventures.",
		"Spongebob works at Krusty Krab.",
		"Patrick and Spongebob are friends?",
		"Spongebob loves making burgers.",
		"Squidward plays clarinet music.",
	];

	const [mode, setMode] = useState<"asciiToText" | "textToAscii">(
		"asciiToText",
	);
	const [gameMode, setGameMode] = useState<"practice" | "test">("practice");
	const [currentMessage, setCurrentMessage] = useState(practiceMessages[0]);
	const [userAnswers, setUserAnswers] = useState<string[]>([]);
	const [isMarked, setIsMarked] = useState(false);
	const [showAnswers, setShowAnswers] = useState(false);
	const [showASCIITable, setShowASCIITable] = useState(false);
	const [showInstructions, setShowInstructions] = useState(true);
	const [focusedIndex, setFocusedIndex] = useState<number | null>(null); // Add this line

	// Create refs for each input field
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

	// Initialize answers, reset state, and focus the first input when the message changes
	useEffect(() => {
		setUserAnswers(new Array(currentMessage.length).fill(""));
		setIsMarked(false);
		setShowAnswers(false);

		// We add a small delay to ensure the DOM has updated before focusing.
		const timer = setTimeout(() => {
			if (inputRefs.current[0]) {
				inputRefs.current[0].focus();
			}
		}, 100); // 100ms delay

		return () => clearTimeout(timer); // Cleanup the timer
	}, [currentMessage]);

	// Generate ASCII table for printable characters (32-126)
	const generateASCIITable = () => {
		const table = [];
		for (let i = 32; i <= 126; i++) {
			table.push({
				decimal: i,
				character: String.fromCharCode(i),
				displayChar: i === 32 ? "SPACE" : String.fromCharCode(i),
			});
		}
		return table;
	};

	const asciiTable = generateASCIITable();

	const handleAnswerChange = (index: number, value: string) => {
		const newAnswers = [...userAnswers];
		newAnswers[index] = value;
		setUserAnswers(newAnswers);
		setIsMarked(false);

		// Determine if we should move focus to the next input.
		// In ASCII -> Text mode, move after 1 character.
		// In Text -> ASCII, if it's in range
		let shouldFocusNext = false;

		if (mode === "asciiToText" && value.length > 0) {
			shouldFocusNext = true;
		} else if (mode === "textToAscii") {
			const numericValue = parseInt(value, 10);
			// Move focus if the entered value is a valid ASCII number in our range.
			if (
				!Number.isNaN(numericValue) &&
				numericValue >= 32 &&
				numericValue <= 126
			) {
				shouldFocusNext = true;
			}
		}
		if (shouldFocusNext) {
			const nextInput = inputRefs.current[index + 1];
			if (nextInput) {
				nextInput.focus();
			}
		}
	};

	// Check if answer is correct (used for practice mode automatic feedback)
	const isAnswerCorrect = (index: number, value: string) => {
		const char = currentMessage[index];
		if (mode === "asciiToText") {
			return value === char;
		} else {
			// For Text → ASCII, only check if the complete ASCII value is correct
			const expectedAscii = char.charCodeAt(0).toString();
			return value === expectedAscii;
		}
	};

	const handleMarkWork = useCallback(() => {
		setIsMarked(true);
	}, []);

	const resetTool = useCallback(() => {
		setUserAnswers(new Array(currentMessage.length).fill(""));
		setIsMarked(false);
		setShowAnswers(false);
	}, [currentMessage.length]);

	const getNewMessage = useCallback(() => {
		const messagePool =
			gameMode === "practice" ? practiceMessages : testMessages;
		const availableMessages = messagePool.filter(
			(msg) => msg !== currentMessage,
		);
		const randomMessage =
			availableMessages[Math.floor(Math.random() * availableMessages.length)];

		if (randomMessage) {
			setCurrentMessage(randomMessage);
		} else if (messagePool.length > 0) {
			// Fallback in case all messages have been seen, preventing a crash.
			setCurrentMessage(messagePool[0]);
		}
	}, [gameMode, currentMessage]);

	// Handle 'Enter' key press for marking work and getting a new message
	useEffect(() => {
		const handleEnterPress = (event: KeyboardEvent) => {
			if (event.key !== "Enter") return;

			// In test mode, 'Enter' first marks the work, then gets a new message.
			if (gameMode === "test") {
				if (isMarked) {
					getNewMessage();
				} else {
					handleMarkWork();
				}
				return; // End execution for test mode
			}

			// In practice mode, 'Enter' gets a new message if all answers are filled.
			if (gameMode === "practice") {
				const isPracticeModeComplete =
					userAnswers.length > 0 &&
					userAnswers.every((answer) => answer.trim() !== "");

				if (isPracticeModeComplete) {
					getNewMessage();
				}
			}
		};

		window.addEventListener("keydown", handleEnterPress);

		return () => {
			window.removeEventListener("keydown", handleEnterPress);
		};
	}, [gameMode, isMarked, userAnswers, getNewMessage, handleMarkWork]);

	const switchGameMode = (newGameMode: "practice" | "test") => {
		setGameMode(newGameMode);
		const messagePool =
			newGameMode === "practice" ? practiceMessages : testMessages;
		const randomMessage = shuffleArray(messagePool)[0];
		setCurrentMessage(randomMessage);
	};

	const switchMode = (newMode: "asciiToText" | "textToAscii") => {
		setMode(newMode);
		// Generate new message when switching modes
		getNewMessage();
	};

	// Calculate score
	let score = 0;
	if (isMarked) {
		userAnswers.forEach((answer, index) => {
			const char = currentMessage[index];
			if (mode === "asciiToText") {
				if (answer === char) score++;
			} else {
				if (answer === char.charCodeAt(0).toString()) score++;
			}
		});
	}

	// Get cell styling based on correctness
	const getCellClasses = (index: number, userAnswer: string) => {
		const baseClasses =
			"w-16 h-16 text-center border-2 rounded-lg text-lg font-bold transition-all";
		const isFocused = focusedIndex === index;

		// In practice mode, show immediate feedback
		if (gameMode === "practice" && userAnswer.length > 0) {
			const isCorrect = isAnswerCorrect(index, userAnswer);

			if (isCorrect) {
				return `${baseClasses} bg-green-100 border-green-500 text-green-800`;
			}

			// For Text -> ASCII mode, provide nuanced feedback
			if (mode === "textToAscii") {
				const char = currentMessage[index];
				const expectedAscii = char.charCodeAt(0).toString();
				const isPotentiallyCorrect = expectedAscii.startsWith(userAnswer);

				// If focused, or if the answer is a valid partial prefix, show as "in progress" (amber)
				if (isFocused || isPotentiallyCorrect) {
					return `${baseClasses} bg-yellow-100 border-yellow-400 text-yellow-800`;
				}
				// Otherwise, if it's not focused and not a valid prefix, it's wrong (red)
				return `${baseClasses} bg-red-100 border-red-500 text-red-800`;
			}

			// For ASCII -> Text mode, feedback is simple: if it's not correct, it's red.
			if (mode === "asciiToText") {
				return `${baseClasses} bg-red-100 border-red-500 text-red-800`;
			}
		}

		// In test mode, only show feedback after marking
		if (gameMode === "test" && isMarked) {
			const isCorrect = isAnswerCorrect(index, userAnswer);
			return `${baseClasses} ${
				isCorrect
					? "bg-green-100 border-green-500 text-green-800"
					: "bg-red-100 border-red-500 text-red-800"
			}`;
		}

		return `${baseClasses} bg-white border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:outline-none`;
	};

	// Split message into rows if too long (max 10 characters per row)
	const chunkMessage = (message: string, chunkSize: number = 10) => {
		const chunks = [];
		for (let i = 0; i < message.length; i += chunkSize) {
			chunks.push(message.slice(i, i + chunkSize));
		}
		return chunks;
	};

	const messageRows = chunkMessage(currentMessage);

	return (
		<div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
			{/* Header */}
			<div className="max-w-6xl mx-auto">
				<h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
					ASCII Learning Tool
				</h1>
				<p className="text-center text-gray-600 mb-6">
					Learn how computers represent text using ASCII values!
				</p>

				{/* Compact Options Bar */}
				<div className="bg-white rounded-lg shadow-md p-4 mb-4">
					<div className="flex flex-wrap items-center justify-center gap-6">
						{/* ASCII/Text Mode Toggle */}
						<div className="flex items-center gap-2">
							<span className="text-sm font-medium text-gray-600">Mode:</span>
							<div className="flex bg-gray-100 rounded-lg p-1">
								<button
									onClick={() => switchMode("asciiToText")}
									className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
										mode === "asciiToText"
											? "bg-blue-500 text-white shadow-sm"
											: "text-gray-600 hover:text-blue-600"
									}`}
									type="button"
								>
									ASCII → Text
								</button>
								<button
									onClick={() => switchMode("textToAscii")}
									className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
										mode === "textToAscii"
											? "bg-purple-500 text-white shadow-sm"
											: "text-gray-600 hover:text-purple-600"
									}`}
									type="button"
								>
									Text → ASCII
								</button>
							</div>
						</div>

						{/* Practice/Test Mode Toggle */}
						<div className="flex items-center gap-2">
							<span className="text-sm font-medium text-gray-600">Type:</span>
							<div className="flex bg-gray-100 rounded-lg p-1">
								<button
									onClick={() => switchGameMode("practice")}
									className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
										gameMode === "practice"
											? "bg-green-500 text-white shadow-sm"
											: "text-gray-600 hover:text-green-600"
									}`}
									type="button"
								>
									Practice
								</button>
								<button
									onClick={() => switchGameMode("test")}
									className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
										gameMode === "test"
											? "bg-orange-500 text-white shadow-sm"
											: "text-gray-600 hover:text-orange-600"
									}`}
									type="button"
								>
									Test
								</button>
							</div>
						</div>

						{/* ASCII Table Toggle */}
						<button
							onClick={() => setShowASCIITable(!showASCIITable)}
							className="px-3 py-1 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
							type="button"
						>
							{showASCIITable ? "Hide" : "Show"} ASCII Table
						</button>
					</div>
				</div>

				{/* ASCII Table */}
				{showASCIITable && (
					<div className="bg-white rounded-lg shadow-lg p-6 mb-6 max-h-80 overflow-y-auto">
						<h3 className="text-xl font-bold mb-4 text-center">
							ASCII Reference Table
						</h3>
						<div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2 text-sm">
							{asciiTable.map((item) => (
								<div
									key={item.decimal}
									className="bg-gray-50 p-2 rounded text-center border"
								>
									<div className="font-bold text-blue-600">{item.decimal}</div>
									<div className="text-gray-800 font-mono">
										{item.displayChar}
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Collapsible Instructions */}
				{showInstructions && (
					<div className="bg-white rounded-lg shadow-lg p-6 mb-6 relative">
						<button
							onClick={() => setShowInstructions(false)}
							className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
							type="button"
						>
							✕
						</button>
						<h3 className="text-xl font-bold mb-2">Instructions</h3>
						<div className="text-gray-700">
							<p className="mb-2">
								<strong>
									{gameMode === "practice" ? "Practice Mode" : "Test Mode"}:
								</strong>{" "}
								{gameMode === "practice"
									? "Get immediate feedback as you type! Perfect for learning."
									: "Complete the entire message before marking your work."}
							</p>
							<p className="mb-2">
								{mode === "asciiToText"
									? "Look at the ASCII values and type the corresponding letters. Remember: it's case sensitive!"
									: "Look at the message and type the ASCII decimal value for each character. Use the ASCII table for help!"}
							</p>
							{gameMode === "practice" && (
								<p className="text-sm text-blue-600 mt-2">
									💡 Tip: Once you fill all the answers, press Enter to get a
									new word!
								</p>
							)}
							{gameMode === "test" && (
								<p className="text-sm text-blue-600 mt-2">
									💡 Tip: After you mark your work, press Enter to get a new
									sentence!
								</p>
							)}
						</div>
					</div>
				)}

				{/* Main Game Area */}
				<div className="bg-white rounded-lg shadow-lg p-6 mb-6">
					<div className="flex justify-between items-center mb-4">
						<h3 className="text-2xl font-bold">
							{gameMode === "practice" ? "Practice: " : "Test: "}
							{mode === "asciiToText"
								? "Decode this message"
								: "Encode this message"}
						</h3>
						<button
							onClick={getNewMessage}
							className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors"
							type="button"
						>
							New {gameMode === "practice" ? "Word" : "Sentence"}
						</button>
					</div>

					{/* Message Display */}
					<div className="space-y-6">
						{messageRows.map((row, rowIndex) => {
							const startIndex = rowIndex * 10;
							return (
								<div key={row} className="flex flex-col items-center gap-4">
									{/* Top row - ASCII values or message characters */}
									<div className="flex gap-2 flex-wrap justify-center">
										{row.split("").map((char, colIndex) => {
											const globalIndex = startIndex + colIndex;
											return (
												<div
													key={globalIndex}
													className="w-16 h-16 bg-gray-100 border-2 border-gray-300 rounded-lg flex items-center justify-center text-lg font-bold"
												>
													{mode === "asciiToText"
														? char.charCodeAt(0)
														: char === " "
															? "SPACE"
															: char}
												</div>
											);
										})}
									</div>

									{/* Bottom row - User input */}
									<div className="flex gap-2 flex-wrap justify-center">
										{row.split("").map((_, colIndex) => {
											const globalIndex = startIndex + colIndex;
											const userAnswer = userAnswers[globalIndex] || "";

											return (
												<input
													ref={(el) => {
														inputRefs.current[globalIndex] = el;
													}}
													key={`input-${globalIndex}`}
													type="text"
													value={userAnswer}
													onChange={(e) =>
														handleAnswerChange(globalIndex, e.target.value)
													}
													onFocus={() => setFocusedIndex(globalIndex)}
													onBlur={() => setFocusedIndex(null)}
													className={getCellClasses(globalIndex, userAnswer)}
													maxLength={mode === "asciiToText" ? 1 : 3}
													placeholder={mode === "asciiToText" ? "?" : "XXX"}
												/>
											);
										})}
									</div>
								</div>
							);
						})}
					</div>

					{/* Show correct answers when marked in test mode */}
					{gameMode === "test" && isMarked && showAnswers && (
						<div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
							<h4 className="font-bold text-yellow-800 mb-2">
								Correct Answers:
							</h4>
							<div className="flex gap-2 flex-wrap">
								{currentMessage.split("").map((char, index) => (
									<div key={`answer-${index}-${char}`} className="text-center">
										<div className="w-16 h-8 bg-yellow-100 border border-yellow-300 rounded flex items-center justify-center text-sm font-bold">
											{mode === "asciiToText" ? char : char.charCodeAt(0)}
										</div>
									</div>
								))}
							</div>
						</div>
					)}
				</div>

				{/* Controls */}
				<div className="flex items-center gap-4 flex-wrap justify-center">
					{gameMode === "test" && (
						<button
							onClick={handleMarkWork}
							className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:scale-105 transition-transform"
							type="button"
						>
							Mark My Work
						</button>
					)}
					<button
						onClick={resetTool}
						className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:scale-105 transition-transform"
						type="button"
					>
						Reset
					</button>

					{gameMode === "test" && isMarked && (
						<>
							<label className="flex items-center gap-2 text-lg">
								<input
									type="checkbox"
									checked={showAnswers}
									onChange={(e) => setShowAnswers(e.target.checked)}
									className="w-5 h-5"
								/>
								Show answers
							</label>
							<div className="bg-green-200 text-green-800 font-bold text-xl py-3 px-6 rounded-full">
								Score: {score} / {currentMessage.length}
							</div>
						</>
					)}
					<BackToHub location="/maths" />
				</div>
			</div>
		</div>
	);
};

export default ASCIIBinaryTool;
