import { useCallback, useState } from "react";
import { logEvent, SITE } from "../lib/analytics";
import { BackToHub } from "./Buttons";

type Difficulty = "easy" | "medium" | "hard";

interface DifficultyConfig {
	label: string;
	bitDepth: number;
	samples: number;
	showDots: boolean;
	showPlaceValues: boolean;
	description: string;
}

const DIFFICULTIES: Record<Difficulty, DifficultyConfig> = {
	easy: {
		label: "Easy",
		bitDepth: 2,
		samples: 8,
		showDots: true,
		showPlaceValues: true,
		description: "2-bit sound, 8 samples, sample points marked on the wave.",
	},
	medium: {
		label: "Medium",
		bitDepth: 3,
		samples: 12,
		showDots: true,
		showPlaceValues: true,
		description: "3-bit sound, 12 samples, sample points marked on the wave.",
	},
	hard: {
		label: "Hard",
		bitDepth: 4,
		samples: 16,
		showDots: false,
		showPlaceValues: false,
		description:
			"4-bit sound, 16 samples. No sample dots and no place-value headings - read the wave carefully!",
	},
};

const toBinary = (value: number, bits: number): string =>
	value.toString(2).padStart(bits, "0");

const generateWave = (bitDepth: number, samples: number): number[] => {
	const max = 2 ** bitDepth - 1;
	const mid = max / 2;
	const rand = (min: number, hi: number) => min + Math.random() * (hi - min);
	const a1 = rand(0.35, 0.5) * max;
	const a2 = rand(0.1, 0.25) * max;
	const f1 = rand(0.35, 0.6);
	const f2 = rand(0.9, 1.4);
	const p1 = rand(0, Math.PI * 2);
	const p2 = rand(0, Math.PI * 2);
	return Array.from({ length: samples }, (_, i) => {
		const v = mid + a1 * Math.sin(f1 * i + p1) + a2 * Math.sin(f2 * i + p2);
		return Math.max(0, Math.min(max, Math.round(v)));
	});
};

// Smooth curve through every point (Catmull-Rom converted to cubic beziers)
const buildCurvePath = (points: { x: number; y: number }[]): string => {
	if (points.length < 2) return "";
	let d = `M ${points[0].x} ${points[0].y}`;
	for (let i = 0; i < points.length - 1; i++) {
		const p0 = points[i - 1] ?? points[i];
		const p1 = points[i];
		const p2 = points[i + 1];
		const p3 = points[i + 2] ?? p2;
		const c1x = p1.x + (p2.x - p0.x) / 6;
		const c1y = p1.y + (p2.y - p0.y) / 6;
		const c2x = p2.x - (p3.x - p1.x) / 6;
		const c2y = p2.y - (p3.y - p1.y) / 6;
		d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
	}
	return d;
};

const WIDTH = 640;
const HEIGHT = 420;
const MARGIN = { top: 16, right: 20, bottom: 48, left: 48 };

interface WaveGraphProps {
	wave: number[];
	bitDepth: number;
	showDots: boolean;
	activeSample: number | null;
}

const WaveGraph = ({
	wave,
	bitDepth,
	showDots,
	activeSample,
}: WaveGraphProps) => {
	const yMax = 2 ** bitDepth;
	const plotW = WIDTH - MARGIN.left - MARGIN.right;
	const plotH = HEIGHT - MARGIN.top - MARGIN.bottom;
	const xFor = (i: number) => MARGIN.left + (i / (wave.length - 1)) * plotW;
	const yFor = (v: number) => MARGIN.top + plotH - (v / yMax) * plotH;
	const points = wave.map((v, i) => ({ x: xFor(i), y: yFor(v) }));

	return (
		<svg
			viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
			className="w-full h-auto"
			role="img"
			aria-label="Sound wave graph of amplitude against time"
		>
			{Array.from({ length: yMax + 1 }, (_, v) => (
				<g
					key={`y-${
						// biome-ignore lint/suspicious/noArrayIndexKey: fixed axis ticks
						v
					}`}
				>
					<line
						x1={MARGIN.left}
						x2={WIDTH - MARGIN.right}
						y1={yFor(v)}
						y2={yFor(v)}
						stroke="#cbd5e1"
						strokeWidth={v === 0 ? 2 : 1}
					/>
					<text
						x={MARGIN.left - 8}
						y={yFor(v)}
						textAnchor="end"
						dominantBaseline="middle"
						className="text-[12px] fill-slate-600"
					>
						{v}
					</text>
				</g>
			))}
			{wave.map((_, i) => (
				<g
					key={`x-${
						// biome-ignore lint/suspicious/noArrayIndexKey: fixed sample positions
						i
					}`}
				>
					<line
						x1={xFor(i)}
						x2={xFor(i)}
						y1={MARGIN.top}
						y2={MARGIN.top + plotH}
						stroke={activeSample === i ? "#0ea5e9" : "#e2e8f0"}
						strokeWidth={activeSample === i ? 3 : 1}
						strokeDasharray={activeSample === i ? undefined : "4 4"}
					/>
					<text
						x={xFor(i)}
						y={MARGIN.top + plotH + 18}
						textAnchor="middle"
						className={`text-[12px] ${activeSample === i ? "fill-sky-700 font-bold" : "fill-slate-600"}`}
					>
						{i + 1}
					</text>
				</g>
			))}
			<path
				d={buildCurvePath(points)}
				fill="none"
				stroke="#0369a1"
				strokeWidth={4}
				strokeLinecap="round"
			/>
			{showDots &&
				points.map((p, i) => (
					<circle
						key={`dot-${
							// biome-ignore lint/suspicious/noArrayIndexKey: fixed sample positions
							i
						}`}
						cx={p.x}
						cy={p.y}
						r={activeSample === i ? 6 : 4}
						fill={activeSample === i ? "#f97316" : "#0369a1"}
					/>
				))}
			<text
				x={MARGIN.left + plotW / 2}
				y={HEIGHT - 6}
				textAnchor="middle"
				className="text-[14px] font-bold fill-slate-700"
			>
				Time (sample number)
			</text>
			<text
				transform={`translate(14 ${MARGIN.top + plotH / 2}) rotate(-90)`}
				textAnchor="middle"
				className="text-[14px] font-bold fill-slate-700"
			>
				Amplitude
			</text>
		</svg>
	);
};

const cellFeedback = (ok: boolean) =>
	ok
		? "bg-green-500 text-white border-green-600"
		: "bg-red-600 text-white border-red-700";

const feedbackClass = (ok: boolean) =>
	ok ? "bg-green-500 text-white" : "bg-red-600 text-white";

const sanitizeDigits = (value: string, maxLength: number) =>
	value.replace(/\D/g, "").slice(0, maxLength);

const SoundSamplingTool = () => {
	const [difficulty, setDifficulty] = useState<Difficulty>("easy");
	const config = DIFFICULTIES[difficulty];
	const { bitDepth, samples } = config;

	const [wave, setWave] = useState<number[]>(() =>
		generateWave(config.bitDepth, config.samples),
	);
	const [amplitudes, setAmplitudes] = useState<string[]>(() =>
		Array(config.samples).fill(""),
	);
	const [bits, setBits] = useState<string[][]>(() =>
		Array.from({ length: config.samples }, () =>
			Array(config.bitDepth).fill(""),
		),
	);
	const [depthAnswer, setDepthAnswer] = useState("");
	const [samplesAnswer, setSamplesAnswer] = useState("");
	const [sizeAnswer, setSizeAnswer] = useState("");
	const [marks, setMarks] = useState<{
		rows: { denaryOk: boolean; bitsOk: boolean[] }[];
		questions: boolean[];
		amplitudes: string[];
		bits: string[][];
		answers: string[];
		correct: number;
	} | null>(null);
	const [hasLogged, setHasLogged] = useState(false);
	const [activeSample, setActiveSample] = useState<number | null>(null);

	const reset = useCallback((level: Difficulty) => {
		const c = DIFFICULTIES[level];
		setDifficulty(level);
		setWave(generateWave(c.bitDepth, c.samples));
		setAmplitudes(Array(c.samples).fill(""));
		setBits(
			Array.from({ length: c.samples }, () => Array(c.bitDepth).fill("")),
		);
		setDepthAnswer("");
		setSamplesAnswer("");
		setSizeAnswer("");
		setMarks(null);
		setHasLogged(false);
		setActiveSample(null);
	}, []);

	// Marks only show while the cell still holds the value that was checked
	const cellMark = (ok: boolean, unchanged: boolean, neutral: string) =>
		marks && unchanged ? cellFeedback(ok) : neutral;

	const questions = [
		{
			label: "What is the bit depth?",
			value: depthAnswer,
			set: setDepthAnswer,
			answer: bitDepth,
		},
		{
			label: "How many samples are there?",
			value: samplesAnswer,
			set: setSamplesAnswer,
			answer: samples,
		},
		{
			label: "How many bits is this file?",
			value: sizeAnswer,
			set: setSizeAnswer,
			answer: bitDepth * samples,
		},
	];

	const totalCount = samples * 2 + questions.length;

	const handleCheck = () => {
		const rows = wave.map((value, i) => ({
			denaryOk: amplitudes[i] !== "" && Number(amplitudes[i]) === value,
			bitsOk: toBinary(value, bitDepth)
				.split("")
				.map((bit, b) => bits[i][b] === bit),
		}));
		const questionResults = questions.map(
			(q) => q.value !== "" && Number(q.value) === q.answer,
		);
		const correct =
			rows.reduce(
				(sum, r) =>
					sum + (r.denaryOk ? 1 : 0) + (r.bitsOk.every(Boolean) ? 1 : 0),
				0,
			) + questionResults.filter(Boolean).length;
		setMarks({
			rows,
			questions: questionResults,
			correct,
			amplitudes: [...amplitudes],
			bits: bits.map((r) => [...r]),
			answers: questions.map((q) => q.value),
		});
		if (!hasLogged) {
			setHasLogged(true);
			logEvent({
				site: SITE,
				game: `sound-sampling-${difficulty}`,
				correct: correct === totalCount,
				score: correct,
				score_max: totalCount,
			});
		}
	};

	const updateAmplitude = (i: number, value: string) => {
		setAmplitudes((prev) => {
			const next = [...prev];
			next[i] = sanitizeDigits(value, 2);
			return next;
		});
	};

	const updateBit = (i: number, b: number, value: string) => {
		setBits((prev) => {
			const next = prev.map((r) => [...r]);
			next[i][b] = value.replace(/[^01]/g, "").slice(-1);
			return next;
		});
	};

	const placeValues = Array.from(
		{ length: bitDepth },
		(_, i) => 2 ** (bitDepth - 1 - i),
	);

	const inputBase =
		"w-full h-8 text-center font-mono font-bold rounded border focus:outline-none focus:border-sky-500";

	return (
		<div className="w-full">
			<div className="max-w-6xl p-4 mx-auto">
				<BackToHub location="/maths" />

				<div className="mt-2 mb-6 text-center">
					<h1 className="mb-2 text-4xl font-bold text-sky-800">
						Sampling Sound
					</h1>
					<p className="text-lg text-sky-700">
						Measure the amplitude of the wave at each sample, then write it in
						denary and {bitDepth}-bit binary.
					</p>
				</div>

				<div className="flex flex-wrap justify-center gap-3 mb-2">
					{(Object.keys(DIFFICULTIES) as Difficulty[]).map((level) => (
						<button
							key={level}
							type="button"
							onClick={() => reset(level)}
							className={`px-6 py-2 rounded-xl font-bold transition-all cursor-pointer ${
								difficulty === level
									? "bg-sky-600 text-white shadow-md scale-105"
									: "bg-white text-sky-700 border-2 border-sky-200 hover:border-sky-500 hover:bg-sky-50"
							}`}
						>
							{DIFFICULTIES[level].label}
						</button>
					))}
				</div>
				<p className="mb-6 text-sm text-center text-gray-600">
					{config.description}
				</p>

				<div className="items-start grid grid-cols-1 gap-6 lg:grid-cols-2">
					<div className="p-4 bg-white border shadow-md rounded-2xl border-sky-100">
						<table className="w-full text-sm border-collapse">
							<thead>
								<tr>
									<th
										rowSpan={config.showPlaceValues ? 2 : 1}
										className="p-1 bg-sky-100"
									>
										Sample
									</th>
									<th
										rowSpan={config.showPlaceValues ? 2 : 1}
										className="p-1 bg-sky-100"
									>
										Amplitude
									</th>
									<th colSpan={bitDepth} className="p-1 bg-sky-100">
										{bitDepth}-bit binary
									</th>
								</tr>
								{config.showPlaceValues && (
									<tr>
										{placeValues.map((pv) => (
											<th key={pv} className="p-1 bg-sky-50">
												{pv}
											</th>
										))}
									</tr>
								)}
							</thead>
							<tbody>
								{wave.map((_, i) => (
									<tr
										key={`row-${
											// biome-ignore lint/suspicious/noArrayIndexKey: fixed sample rows
											i
										}`}
										className={activeSample === i ? "bg-sky-100" : ""}
									>
										<td className="px-2 py-0.5 font-bold text-center">
											{i + 1}
										</td>
										<td className="px-1 py-0.5">
											<input
												type="text"
												inputMode="numeric"
												aria-label={`Sample ${i + 1} amplitude`}
												value={amplitudes[i]}
												onChange={(e) => updateAmplitude(i, e.target.value)}
												onFocus={() => setActiveSample(i)}
												onBlur={() => setActiveSample(null)}
												className={`${inputBase} ${cellMark(
													marks?.rows[i].denaryOk ?? false,
													marks?.amplitudes[i] === amplitudes[i],
													"bg-orange-100 border-orange-200",
												)}`}
											/>
										</td>
										{placeValues.map((pv, b) => (
											<td key={pv} className="px-0.5 py-0.5">
												<input
													type="text"
													inputMode="numeric"
													aria-label={`Sample ${i + 1} bit ${pv}`}
													value={bits[i][b]}
													onChange={(e) => updateBit(i, b, e.target.value)}
													onFocus={() => setActiveSample(i)}
													onBlur={() => setActiveSample(null)}
													className={`${inputBase} ${cellMark(
														marks?.rows[i].bitsOk[b] ?? false,
														marks?.bits[i][b] === bits[i][b],
														"bg-yellow-100 border-yellow-300",
													)}`}
												/>
											</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</div>

					<div className="flex flex-col gap-6">
						<div className="p-4 bg-white border shadow-md rounded-2xl border-sky-100">
							<WaveGraph
								wave={wave}
								bitDepth={bitDepth}
								showDots={config.showDots}
								activeSample={activeSample}
							/>
						</div>

						<div className="p-4 bg-white border shadow-md rounded-2xl border-sky-100">
							<h2 className="mb-3 text-lg font-bold text-sky-800">
								About this sound file
							</h2>
							<div className="flex flex-col gap-2">
								{questions.map((q, qi) => {
									const ok = marks?.questions[qi] ?? false;
									const unchanged = marks?.answers[qi] === q.value;
									return (
										<label
											key={q.label}
											className="flex items-center justify-between gap-3"
										>
											<span className="font-semibold text-slate-700">
												{q.label}
											</span>
											<span className="flex items-center gap-2">
												<input
													type="text"
													inputMode="numeric"
													value={q.value}
													onChange={(e) =>
														q.set(sanitizeDigits(e.target.value, 4))
													}
													className="w-20 h-8 font-mono font-bold text-center bg-blue-100 border border-blue-200 rounded focus:outline-none focus:border-sky-500"
												/>
												<span
													className={`w-20 px-1 text-center font-bold ${
														marks && unchanged
															? feedbackClass(ok)
															: "bg-slate-100"
													}`}
												>
													{marks && unchanged
														? ok
															? "Correct"
															: "Wrong"
														: "\u00A0"}
												</span>
											</span>
										</label>
									);
								})}
							</div>
						</div>
					</div>
				</div>

				<div className="mt-6 text-center">
					{marks && (
						<p
							className={`mb-3 text-xl font-bold ${marks.correct === totalCount ? "text-green-600" : "text-slate-700"}`}
						>
							{marks.correct === totalCount
								? "🎉 Perfect! Every answer is correct."
								: `${marks.correct} / ${totalCount} correct - fix the red answers and check again.`}
						</p>
					)}
					<div className="flex flex-wrap justify-center gap-3">
						<button
							type="button"
							onClick={handleCheck}
							className="px-8 py-3 text-lg font-bold text-white bg-sky-600 shadow-lg cursor-pointer transition-all hover:bg-sky-700 rounded-2xl active:scale-95"
						>
							Check answers
						</button>
						<button
							type="button"
							onClick={() => reset(difficulty)}
							className="px-8 py-3 text-lg font-bold bg-white border-2 cursor-pointer text-sky-700 border-sky-300 transition-all hover:bg-sky-50 rounded-2xl active:scale-95"
						>
							New wave
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SoundSamplingTool;
