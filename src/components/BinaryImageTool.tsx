import type React from "react";
import { Fragment, useCallback, useState } from "react";
import { shuffleArray } from "../utils/utils";
import BinaryImageDrawMode from "./BinaryImageDrawMode";
import { BackToHub } from "./Buttons";

interface ColorInfo {
	hex: string;
	name: string;
}

interface BinaryPuzzle {
	id: string;
	name: string;
	binary: string[];
}

type ColorDepth = 1 | 2;
type ColorMap = Record<string, ColorInfo>;
type CellValue = string | null;

const GRID_SIZE = 5;

const COLOR_PALETTE: ColorInfo[] = [
	{ hex: "#22c55e", name: "Green" },
	{ hex: "#facc15", name: "Yellow" },
	{ hex: "#1e293b", name: "Black" },
	{ hex: "#bfdbfe", name: "Light Blue" },
	{ hex: "#1d4ed8", name: "Blue" },
	{ hex: "#ffffff", name: "White" },
	{ hex: "#ef4444", name: "Red" },
	{ hex: "#fef3c7", name: "Cream" },
	{ hex: "#8b5cf6", name: "Purple" },
	{ hex: "#f472b6", name: "Pink" },
	{ hex: "#f97316", name: "Orange" },
	{ hex: "#a3e635", name: "Lime" },
	{ hex: "#6366f1", name: "Indigo" },
	{ hex: "#14b8a6", name: "Teal" },
];

const puzzles1bit: BinaryPuzzle[] = [
	{
		id: "checkerboard",
		name: "Checkerboard",
		binary: ["10101", "01010", "10101", "01010", "10101"],
	},
	{
		id: "stripes",
		name: "Stripes",
		binary: ["11111", "00000", "11111", "00000", "11111"],
	},
	{
		id: "border",
		name: "Border",
		binary: ["11111", "10001", "10001", "10001", "11111"],
	},
	{
		id: "diamond",
		name: "Diamond",
		binary: ["00100", "01110", "11111", "01110", "00100"],
	},
	{
		id: "cross",
		name: "Plus Sign",
		binary: ["00100", "00100", "11111", "00100", "00100"],
	},
	{
		id: "arrow",
		name: "Arrow",
		binary: ["00100", "01100", "11111", "01100", "00100"],
	},
	{
		id: "xshape",
		name: "X Shape",
		binary: ["10001", "01010", "00100", "01010", "10001"],
	},
	{
		id: "heart",
		name: "Heart",
		binary: ["01010", "11111", "11111", "01110", "00100"],
	},
	{
		id: "stairs",
		name: "Stairs",
		binary: ["10000", "11000", "11100", "11110", "11111"],
	},
	{
		id: "frame",
		name: "Double Border",
		binary: ["11111", "10001", "10101", "10001", "11111"],
	},
];

// Each row is GRID_SIZE * 2 = 10 chars; each 2-char pair is one pixel's value
const puzzles2bit: BinaryPuzzle[] = [
	{
		id: "quadrants",
		name: "Four Quadrants",
		binary: [
			"0000010101",
			"0000010101",
			"0000010101",
			"1010111111",
			"1010111111",
		],
	},
	{
		id: "diagonal2",
		name: "Diagonal",
		binary: [
			"0001101100",
			"0110110001",
			"1011000110",
			"1100011011",
			"0001101100",
		],
	},
	{
		id: "bullseye",
		name: "Bullseye",
		binary: [
			"1111111111",
			"1110101011",
			"1110011011",
			"1110101011",
			"1111111111",
		],
	},
	{
		id: "hstripes2",
		name: "Horizontal Stripes",
		binary: [
			"0000000000",
			"0101010101",
			"1010101010",
			"1111111111",
			"0000000000",
		],
	},
	{
		id: "vstripes2",
		name: "Vertical Stripes",
		binary: [
			"0001101110",
			"0001101110",
			"0001101110",
			"0001101110",
			"0001101110",
		],
	},
	{
		id: "radial2",
		name: "Radial Gradient",
		binary: [
			"1111101111",
			"1101010111",
			"1001000110",
			"1101010111",
			"1111101111",
		],
	},
	{
		id: "checker4",
		name: "4-Colour Checker",
		binary: [
			"0001000100",
			"1011101110",
			"0001000100",
			"1011101110",
			"0001000100",
		],
	},
	{
		id: "staircase",
		name: "Staircase",
		binary: [
			"0000000000",
			"0101000000",
			"0101100000",
			"0101101100",
			"0101101111",
		],
	},
	{
		id: "columns",
		name: "Columns",
		binary: [
			"0001101100",
			"0001101100",
			"0001101100",
			"0001101100",
			"0001101100",
		],
	},
	{
		id: "diamondframe",
		name: "Diamond Frame",
		binary: [
			"0000010000",
			"0001100100",
			"0110111001",
			"0001100100",
			"0000010000",
		],
	},
];

function getBitValues(depth: ColorDepth): string[] {
	return depth === 1 ? ["0", "1"] : ["00", "01", "10", "11"];
}

function getRandomColorMap(depth: ColorDepth): ColorMap {
	const shuffled = shuffleArray(COLOR_PALETTE);
	const keys = getBitValues(depth);
	return Object.fromEntries(keys.map((k, i) => [k, shuffled[i]]));
}

function getRandomPuzzleIndex(depth: ColorDepth): number {
	const pool = depth === 1 ? puzzles1bit : puzzles2bit;
	return Math.floor(Math.random() * pool.length);
}

const BinaryImageTool: React.FC = () => {
	const [colorDepth, setColorDepth] = useState<ColorDepth>(1);
	const [mode, setMode] = useState<"decode" | "encode" | "draw">("decode");
	const [puzzleIndex, setPuzzleIndex] = useState(() => getRandomPuzzleIndex(1));
	const [colorMap, setColorMap] = useState<ColorMap>(() =>
		getRandomColorMap(1),
	);
	const [grid, setGrid] = useState<CellValue[][]>(() =>
		Array.from({ length: GRID_SIZE }, () =>
			Array<CellValue>(GRID_SIZE).fill(null),
		),
	);
	const [binaryInput, setBinaryInput] = useState<string[][]>(() =>
		Array.from({ length: GRID_SIZE }, () => Array<string>(GRID_SIZE).fill("")),
	);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [showAnswer, setShowAnswer] = useState(false);

	const puzzle = (colorDepth === 1 ? puzzles1bit : puzzles2bit)[puzzleIndex];

	const getPixelBits = (row: number, col: number): string =>
		puzzle.binary[row].slice(col * colorDepth, (col + 1) * colorDepth);

	const changeDepth = useCallback((d: ColorDepth) => {
		setColorDepth(d);
		setPuzzleIndex(getRandomPuzzleIndex(d));
		setColorMap(getRandomColorMap(d));
		setGrid(
			Array.from({ length: GRID_SIZE }, () =>
				Array<CellValue>(GRID_SIZE).fill(null),
			),
		);
		setBinaryInput(
			Array.from({ length: GRID_SIZE }, () =>
				Array<string>(GRID_SIZE).fill(""),
			),
		);
		setIsSubmitted(false);
		setShowAnswer(false);
	}, []);

	const reset = useCallback(() => {
		setPuzzleIndex(getRandomPuzzleIndex(colorDepth));
		setColorMap(getRandomColorMap(colorDepth));
		setGrid(
			Array.from({ length: GRID_SIZE }, () =>
				Array<CellValue>(GRID_SIZE).fill(null),
			),
		);
		setBinaryInput(
			Array.from({ length: GRID_SIZE }, () =>
				Array<string>(GRID_SIZE).fill(""),
			),
		);
		setIsSubmitted(false);
		setShowAnswer(false);
	}, [colorDepth]);

	const handleCellClick = useCallback(
		(row: number, col: number) => {
			if (isSubmitted || mode === "encode") return;
			const values = getBitValues(colorDepth);
			setGrid((prev) => {
				const next = prev.map((r) => [...r]) as CellValue[][];
				const cur = next[row][col];
				if (cur === null) {
					next[row][col] = values[0];
				} else {
					const idx = values.indexOf(cur);
					next[row][col] = idx < values.length - 1 ? values[idx + 1] : null;
				}
				return next;
			});
		},
		[isSubmitted, mode, colorDepth],
	);

	const handleBinaryInput = useCallback(
		(row: number, col: number, value: string) => {
			if (isSubmitted) return;
			const sanitized = value.replace(/[^01]/g, "").slice(0, colorDepth);
			setBinaryInput((prev) => {
				const next = prev.map((r) => [...r]);
				next[row][col] = sanitized;
				return next;
			});
		},
		[isSubmitted, colorDepth],
	);

	const correctCount =
		mode === "decode"
			? grid.reduce(
					(sum, row, ri) =>
						sum +
						row.filter((cell, ci) => cell === getPixelBits(ri, ci)).length,
					0,
				)
			: binaryInput.reduce(
					(sum, row, ri) =>
						sum +
						row.filter((input, ci) => input === getPixelBits(ri, ci)).length,
					0,
				);
	const totalCells = GRID_SIZE * GRID_SIZE;
	const isPerfect = isSubmitted && correctCount === totalCells;

	const getCellBg = (row: number, col: number): string => {
		if (mode === "encode") return colorMap[getPixelBits(row, col)].hex;
		if (showAnswer) return colorMap[getPixelBits(row, col)].hex;
		const val = grid[row][col];
		if (val === null) return "#e2e8f0";
		return colorMap[val]?.hex ?? "#e2e8f0";
	};

	const getCellBorder = (row: number, col: number): string => {
		if (mode === "encode") return "2px solid #cbd5e1";
		if (!isSubmitted || showAnswer) return "2px solid #cbd5e1";
		return grid[row][col] === getPixelBits(row, col)
			? "3px solid #22c55e"
			: "3px solid #ef4444";
	};

	const bitValues = getBitValues(colorDepth);

	return (
		<div className="min-h-screen p-6 bg-linear-to-br from-indigo-50 to-purple-50">
			<div className="max-w-5xl mx-auto">
				<BackToHub location="/maths" />

				{/* Header */}
				<div className="mt-2 mb-8 text-center">
					<h1 className="mb-2 text-4xl font-bold text-indigo-800">
						Binary Images
					</h1>
					<p className="text-lg text-indigo-600">
						{mode === "decode"
							? "Use the binary code and colour key to colour in the pixel grid."
							: mode === "encode"
								? "Look at the coloured image and write the binary code."
								: "Pick a resolution and type binary values to draw your own pixel image."}
					</p>
				</div>

				{/* Mode selector */}
				<div className="flex justify-center mb-4 gap-3">
					<button
						type="button"
						onClick={() => {
							setMode("decode");
							setIsSubmitted(false);
							setShowAnswer(false);
						}}
						className={`px-8 py-3 rounded-xl font-bold text-lg transition-all ${
							mode === "decode"
								? "bg-indigo-600 text-white shadow-md scale-105"
								: "bg-white text-indigo-700 border-2 border-indigo-200 hover:border-indigo-500 hover:bg-indigo-50"
						}`}
					>
						Decode Mode
					</button>
					<button
						type="button"
						onClick={() => {
							setMode("encode");
							setIsSubmitted(false);
							setShowAnswer(false);
						}}
						className={`px-8 py-3 rounded-xl font-bold text-lg transition-all ${
							mode === "encode"
								? "bg-indigo-600 text-white shadow-md scale-105"
								: "bg-white text-indigo-700 border-2 border-indigo-200 hover:border-indigo-500 hover:bg-indigo-50"
						}`}
					>
						Encode Mode
					</button>
					<button
						type="button"
						onClick={() => {
							setMode("draw");
							setIsSubmitted(false);
							setShowAnswer(false);
						}}
						className={`px-8 py-3 rounded-xl font-bold text-lg transition-all ${
							mode === "draw"
								? "bg-emerald-600 text-white shadow-md scale-105"
								: "bg-white text-emerald-700 border-2 border-emerald-200 hover:border-emerald-500 hover:bg-emerald-50"
						}`}
					>
						Draw Mode
					</button>
				</div>
				{mode !== "draw" && (
					<div className="flex items-center justify-center mb-6 gap-3">
						<span className="text-sm font-semibold text-gray-500">
							Colour Depth:
						</span>
						{([1, 2] as ColorDepth[]).map((d) => (
							<button
								key={d}
								type="button"
								onClick={() => changeDepth(d)}
								className={`px-5 py-2 rounded-lg font-bold text-sm transition-all ${
									colorDepth === d
										? "bg-purple-600 text-white shadow-md"
										: "bg-white text-purple-700 border-2 border-purple-200 hover:border-purple-500 hover:bg-purple-50"
								}`}
							>
								{d}-bit ({2 ** d} colours)
							</button>
						))}
					</div>
				)}

				{/* How to use */}
				<div className="px-5 py-3 mb-8 text-sm text-center text-gray-600 border border-indigo-100 bg-white/70 rounded-xl">
					<span className="font-bold text-indigo-700">How to use: </span>
					{mode === "decode"
						? "Click each pixel in the grid to cycle through the colours. Match the grid to the binary pattern."
						: mode === "encode"
							? `Look at the coloured image and type the ${colorDepth}-bit code for each pixel.`
							: "Type the binary value in each pixel to pick its colour."}
				</div>

				{mode !== "draw" && (
					<>
						<div className="items-start grid grid-cols-1 gap-6 lg:grid-cols-3">
							{/* Binary code panel */}
							<div
								className={`bg-white rounded-2xl shadow-md p-6 border border-indigo-100 ${mode === "encode" ? "lg:order-3" : "lg:order-1"}`}
							>
								<h2 className="mb-5 text-xl font-bold text-center text-indigo-800">
									Binary Code
								</h2>
								<div className="flex flex-col gap-2">
									{mode === "decode"
										? puzzle.binary.map((row, ri) => (
												<div
													key={`row-${
														// biome-ignore lint/suspicious/noArrayIndexKey: static puzzle rows
														ri
													}`}
													className="flex justify-center gap-2"
												>
													{Array.from({ length: GRID_SIZE }, (_, ci) => (
														<span
															key={`bit-${
																// biome-ignore lint/suspicious/noArrayIndexKey: static bit positions
																ci
															}`}
															className="flex items-center justify-center w-10 h-10 font-mono text-lg font-bold border rounded-lg bg-slate-100 text-slate-700 border-slate-200"
														>
															{row.slice(
																ci * colorDepth,
																(ci + 1) * colorDepth,
															)}
														</span>
													))}
												</div>
											))
										: Array.from({ length: GRID_SIZE }, (_, ri) => (
												<div
													key={`input-row-${
														// biome-ignore lint/suspicious/noArrayIndexKey: static input rows
														ri
													}`}
													className="flex justify-center gap-2"
												>
													{Array.from({ length: GRID_SIZE }, (_, ci) => (
														<input
															key={`input-${
																// biome-ignore lint/suspicious/noArrayIndexKey: static input positions
																ci
															}`}
															type="text"
															inputMode="numeric"
															maxLength={colorDepth}
															value={
																showAnswer
																	? getPixelBits(ri, ci)
																	: binaryInput[ri][ci]
															}
															onChange={(e) =>
																handleBinaryInput(ri, ci, e.target.value)
															}
															disabled={isSubmitted}
															className={`w-10 h-10 text-center font-mono font-bold rounded-lg text-slate-700 ${colorDepth === 1 ? "text-xl" : "text-sm"} ${
																isSubmitted && !showAnswer
																	? binaryInput[ri][ci] === getPixelBits(ri, ci)
																		? "bg-green-100 border-2 border-green-500"
																		: "bg-red-100 border-2 border-red-500"
																	: "bg-slate-100 border border-slate-200 focus:border-indigo-500 focus:outline-none"
															}`}
														/>
													))}
												</div>
											))}
								</div>
								{!isSubmitted && mode === "encode" && (
									<p className="mt-3 text-xs text-center text-gray-400">
										{colorDepth === 1
											? "Type 0 or 1 in each box"
											: "Type 00, 01, 10, or 11 in each box"}
									</p>
								)}
							</div>

							{/* Colour key panel */}
							<div className="p-6 bg-white border border-indigo-100 shadow-md rounded-2xl lg:order-2">
								<h2 className="mb-5 text-xl font-bold text-center text-indigo-800">
									Colour Key
								</h2>
								<table className="w-full">
									<thead>
										<tr className="font-bold text-center text-indigo-700 border-b-2 border-indigo-100">
											<th className="pb-3 text-lg">Binary</th>
											<th className="pb-3 text-lg">Colour</th>
										</tr>
									</thead>
									<tbody>
										{bitValues.map((bits) => (
											<tr key={bits} className="text-center">
												<td className="py-3">
													<span className="font-mono text-2xl font-bold text-slate-800">
														{bits}
													</span>
												</td>
												<td className="py-3">
													<div
														className="w-10 h-10 mx-auto border-2 border-gray-300 shadow-sm rounded-xl"
														style={{ backgroundColor: colorMap[bits].hex }}
													/>
												</td>
											</tr>
										))}
									</tbody>
								</table>

								{mode === "decode" && (
									<div className="pt-3 mt-4 text-xs text-center text-gray-400 border-t border-gray-100">
										<div className="flex flex-wrap items-center justify-center gap-1">
											<span
												className="inline-block w-4 h-4 border border-gray-300 rounded"
												style={{ backgroundColor: "#e2e8f0" }}
											/>
											<span>→</span>
											{bitValues.map((bits) => (
												<Fragment key={bits}>
													<span
														className="inline-block w-4 h-4 border border-gray-300 rounded"
														style={{ backgroundColor: colorMap[bits].hex }}
													/>
													<span>→</span>
												</Fragment>
											))}
											<span>clear</span>
										</div>
										<p className="mt-1">Clicking cycles through colours</p>
									</div>
								)}
							</div>

							{/* Grid panel */}
							<div
								className={`bg-white rounded-2xl shadow-md p-6 border border-indigo-100 ${mode === "encode" ? "lg:order-1" : "lg:order-3"}`}
							>
								<h2 className="mb-5 text-xl font-bold text-center text-indigo-800">
									{showAnswer
										? "Correct Answer"
										: mode === "decode"
											? "Your Image"
											: "The Image"}
								</h2>
								<div className="flex justify-center">
									<div
										className="grid gap-1.5"
										style={{
											gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
										}}
									>
										{Array.from({ length: GRID_SIZE }, (_, ri) =>
											Array.from({ length: GRID_SIZE }, (_, ci) => (
												<button
													key={`cell-${ri}-${ci}`}
													type="button"
													onClick={() => handleCellClick(ri, ci)}
													aria-label={`Row ${ri + 1}, Column ${ci + 1}`}
													style={{
														backgroundColor: getCellBg(ri, ci),
														border: getCellBorder(ri, ci),
														width: "56px",
														height: "56px",
														borderRadius: "8px",
														cursor:
															isSubmitted || mode === "encode"
																? "default"
																: "pointer",
														transition: "transform 0.1s, border 0.15s",
													}}
													onMouseEnter={(e) => {
														if (!isSubmitted && mode === "decode") {
															(e.currentTarget as HTMLElement).style.transform =
																"scale(1.08)";
														}
													}}
													onMouseLeave={(e) => {
														(e.currentTarget as HTMLElement).style.transform =
															"scale(1)";
													}}
												/>
											)),
										)}
									</div>
								</div>
								{!isSubmitted && mode === "decode" && (
									<p className="mt-3 text-xs text-center text-gray-400">
										Click pixels to colour them
									</p>
								)}
							</div>
						</div>

						{/* Submit / Result area */}
						<div className="flex flex-col items-center mt-8 gap-4">
							{!isSubmitted ? (
								<button
									type="button"
									onClick={() => setIsSubmitted(true)}
									className="px-10 py-4 text-xl font-bold text-white bg-indigo-600 shadow-lg transition-all hover:bg-indigo-700 rounded-2xl hover:shadow-xl active:scale-95"
								>
									Submit Answer
								</button>
							) : (
								<div className="flex flex-col items-center w-full max-w-md gap-4">
									{isPerfect ? (
										<div className="w-full px-8 py-6 text-center border-2 border-green-400 bg-green-50 rounded-2xl">
											<div className="mb-2 text-5xl">🎉</div>
											<p className="text-2xl font-bold text-green-700">
												Perfect! Well done!
											</p>
											<p className="mt-1 text-green-600">
												{mode === "decode"
													? "You decoded the binary image correctly."
													: "You encoded the image correctly."}
											</p>
										</div>
									) : (
										<div className="w-full px-8 py-6 text-center border-2 bg-amber-50 border-amber-400 rounded-2xl">
											<p className="text-2xl font-bold text-amber-700">
												{correctCount} / {totalCells} correct
											</p>
											<p className="mt-1 text-amber-600">
												{mode === "decode"
													? "Red borders show incorrect pixels — check the binary again."
													: "Red boxes show incorrect values — check the colours again."}
											</p>
										</div>
									)}

									<div className="flex flex-wrap justify-center gap-3">
										<button
											type="button"
											onClick={reset}
											className="px-6 py-3 font-bold text-indigo-700 bg-white border-2 border-indigo-400 transition-all rounded-xl hover:bg-indigo-50"
										>
											{isPerfect ? "Next Puzzle" : "Try Again"}
										</button>
										{!isPerfect && (
											<button
												type="button"
												onClick={() => setShowAnswer((s) => !s)}
												className="px-6 py-3 font-bold bg-white border-2 transition-all border-slate-300 text-slate-600 rounded-xl hover:bg-slate-50"
											>
												{showAnswer ? "Hide Answer" : "Show Answer"}
											</button>
										)}
									</div>
								</div>
							)}
						</div>
					</>
				)}
				{mode === "draw" && <BinaryImageDrawMode />}
			</div>
		</div>
	);
};

export default BinaryImageTool;
