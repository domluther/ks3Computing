import type React from "react";
import { useCallback, useState } from "react";
import { shuffleArray } from "../utils/utils";

interface ColorInfo {
	hex: string;
	name: string;
}

type ColorDepth = 1 | 2 | 3;
type ColorMap = Record<string, ColorInfo>;

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

function getBitValues(depth: ColorDepth): string[] {
	const count = 2 ** depth;
	return Array.from({ length: count }, (_, i) =>
		i.toString(2).padStart(depth, "0"),
	);
}

function getRandomColorMap(depth: ColorDepth): ColorMap {
	const shuffled = shuffleArray(COLOR_PALETTE);
	const keys = getBitValues(depth);
	return Object.fromEntries(keys.map((k, i) => [k, shuffled[i]]));
}

const BinaryImageDrawMode: React.FC = () => {
	const [drawColorDepth, setDrawColorDepth] = useState<ColorDepth>(1);
	const [drawResolution, setDrawResolution] = useState(8);
	const [drawGrid, setDrawGrid] = useState<string[][]>(() =>
		Array.from({ length: 8 }, () => Array<string>(8).fill("")),
	);
	const [drawColorMap, setDrawColorMap] = useState<ColorMap>(() =>
		getRandomColorMap(1),
	);
	const [showValues, setShowValues] = useState(true);

	const bitValues = getBitValues(drawColorDepth);

	const changeColorDepth = useCallback((d: ColorDepth) => {
		setDrawColorDepth(d);
		setDrawColorMap(getRandomColorMap(d));
		setDrawGrid((prev) =>
			Array.from({ length: prev.length }, () =>
				Array<string>(prev.length).fill(""),
			),
		);
	}, []);

	const changeDrawResolution = useCallback((res: number) => {
		setDrawResolution(res);
		setDrawGrid(Array.from({ length: res }, () => Array<string>(res).fill("")));
	}, []);

	const handleDrawInput = useCallback(
		(row: number, col: number, value: string) => {
			const sanitized = value.replace(/[^01]/g, "").slice(0, drawColorDepth);
			setDrawGrid((prev) => {
				const next = prev.map((r) => [...r]);
				next[row][col] = sanitized;
				return next;
			});
		},
		[drawColorDepth],
	);

	const randomiseDrawColors = useCallback(() => {
		setDrawColorMap(getRandomColorMap(drawColorDepth));
	}, [drawColorDepth]);

	const clearDrawGrid = useCallback(() => {
		setDrawGrid((prev) =>
			Array.from({ length: prev.length }, () =>
				Array<string>(prev.length).fill(""),
			),
		);
	}, []);

	const cellPx = drawResolution <= 4 ? 70 : drawResolution <= 8 ? 52 : 34;
	const cellFontSize =
		drawResolution <= 4
			? "1.1rem"
			: drawResolution <= 8
				? "0.85rem"
				: "0.65rem";

	return (
		<>
			{/* Top controls: resolution + colour depth */}
			<div className="flex flex-col items-center mb-6 gap-3 sm:flex-row sm:justify-center sm:gap-8">
				<div className="flex items-center gap-3">
					<span className="text-sm font-semibold text-gray-500">
						Resolution:
					</span>
					{([4, 8, 16] as const).map((res) => (
						<button
							key={res}
							type="button"
							onClick={() => changeDrawResolution(res)}
							className={`px-5 py-2 rounded-lg font-bold text-sm transition-all ${
								drawResolution === res
									? "bg-emerald-600 text-white shadow-md"
									: "bg-white text-emerald-700 border-2 border-emerald-200 hover:border-emerald-500 hover:bg-emerald-50"
							}`}
						>
							{res}×{res}
						</button>
					))}
				</div>
				<div className="flex items-center gap-3">
					<span className="text-sm font-semibold text-gray-500">
						Colour Depth:
					</span>
					{([1, 2, 3] as ColorDepth[]).map((d) => (
						<button
							key={d}
							type="button"
							onClick={() => changeColorDepth(d)}
							className={`px-5 py-2 rounded-lg font-bold text-sm transition-all ${
								drawColorDepth === d
									? "bg-purple-600 text-white shadow-md"
									: "bg-white text-purple-700 border-2 border-purple-200 hover:border-purple-500 hover:bg-purple-50"
							}`}
						>
							{d}-bit
						</button>
					))}
				</div>
			</div>

			{/* 4-col layout: colour key | draw grid (col-span-3) */}
			<div className="items-start grid grid-cols-1 gap-6 lg:grid-cols-4">
				{/* Colour Key + controls */}
				<div className="p-6 bg-white border border-indigo-100 shadow-md rounded-2xl">
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
											style={{ backgroundColor: drawColorMap[bits].hex }}
										/>
									</td>
								</tr>
							))}
						</tbody>
					</table>
					<div className="flex flex-col mt-6 gap-2">
						<button
							type="button"
							onClick={randomiseDrawColors}
							className="w-full px-4 py-2 font-bold text-purple-700 bg-white border-2 border-purple-300 transition-all rounded-xl hover:bg-purple-50"
						>
							Randomise Colours
						</button>
						<button
							type="button"
							onClick={() => setShowValues((v) => !v)}
							className={`w-full px-4 py-2 font-bold transition-all border-2 rounded-xl ${
								showValues
									? "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
									: "bg-slate-800 text-white border-slate-700 hover:bg-slate-700"
							}`}
						>
							{showValues ? "Hide Values" : "Show Values"}
						</button>
						<button
							type="button"
							onClick={clearDrawGrid}
							className="w-full px-4 py-2 font-bold bg-white border-2 transition-all text-slate-600 border-slate-300 rounded-xl hover:bg-slate-50"
						>
							Clear Grid
						</button>
					</div>
				</div>

				{/* Draw grid — spans 2 columns */}
				<div className="p-6 bg-white border border-indigo-100 shadow-md rounded-2xl lg:col-span-3">
					<h2 className="mb-5 text-xl font-bold text-center text-indigo-800">
						Draw Your Image
					</h2>
					<div className="flex justify-center overflow-x-auto">
						<div
							className="grid"
							style={{
								gridTemplateColumns: `repeat(${drawResolution}, ${cellPx}px)`,
								gap: "3px",
							}}
						>
							{drawGrid
								.flatMap((row, ri) => row.map((cell, ci) => ({ ri, ci, cell })))
								.map(({ ri, ci, cell }) => {
									const isValid = cell.length === drawColorDepth;
									return (
										<div
											key={`draw-${ri}-${ci}`}
											className="relative overflow-hidden"
											style={{
												width: cellPx,
												height: cellPx,
												backgroundColor: isValid
													? (drawColorMap[cell]?.hex ?? "#e2e8f0")
													: "#e2e8f0",
												border: "1px solid #cbd5e1",
												borderRadius: "4px",
											}}
										>
											<input
												type="text"
												inputMode="numeric"
												maxLength={drawColorDepth}
												value={cell}
												onChange={(e) =>
													handleDrawInput(ri, ci, e.target.value)
												}
												onBlur={() => {
													if (cell.length > 0 && cell.length < drawColorDepth) {
														handleDrawInput(ri, ci, "");
													}
												}}
												className={`absolute inset-0 w-full h-full text-center font-mono font-bold bg-white/50 focus:bg-white/80 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-indigo-400 ${
													showValues
														? "text-slate-800"
														: "text-transparent caret-transparent"
												}`}
												style={{ fontSize: cellFontSize }}
												aria-label={`Row ${ri + 1}, Column ${ci + 1}`}
											/>
										</div>
									);
								})}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default BinaryImageDrawMode;
