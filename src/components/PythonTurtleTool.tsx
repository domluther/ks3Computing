import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { shuffleArray } from "../utils/utils";
import { BackToHub } from "./Buttons";

// ─── Constants ────────────────────────────────────────────────────────────────

const CANVAS_SIZE = 380;
const TURTLE_SPEED = 130; // pixels per second

// ─── Types ────────────────────────────────────────────────────────────────────

type CommandType =
	| "forward"
	| "right"
	| "left"
	| "backward"
	| "penup"
	| "pendown";
type Phase = "drawing" | "animating" | "done";
type Difficulty = "beginner" | "medium" | "hard" | "expert";

interface TurtleCommand {
	type: CommandType;
	value: number; // 0 for penup / pendown
}

interface Program {
	id: string;
	commands: TurtleCommand[];
	code?: string[]; // optional Python lines with variable names (hard mode)
}

interface Segment {
	x1: number;
	y1: number;
	x2: number;
	y2: number;
	heading: number; // turtle's facing direction (unchanged by backward)
	draw: boolean; // false when pen is up
}

// ─── Beginner Programs ────────────────────────────────────────────────────────

const BEGINNER_PROGRAMS: Program[] = [
	{
		id: "corner",
		commands: [
			{ type: "forward", value: 100 },
			{ type: "right", value: 90 },
			{ type: "forward", value: 100 },
		],
	},
	{
		id: "left-corner",
		commands: [
			{ type: "forward", value: 80 },
			{ type: "left", value: 90 },
			{ type: "forward", value: 80 },
		],
	},
	{
		id: "u-shape",
		commands: [
			{ type: "forward", value: 100 },
			{ type: "right", value: 90 },
			{ type: "forward", value: 60 },
			{ type: "right", value: 90 },
			{ type: "forward", value: 100 },
		],
	},
	{
		id: "turn first",
		commands: [
			{ type: "right", value: 90 },
			{ type: "forward", value: 60 },
			{ type: "right", value: 90 },
			{ type: "forward", value: 100 },
		],
	},
	{
		id: "steps",
		commands: [
			{ type: "forward", value: 60 },
			{ type: "right", value: 90 },
			{ type: "forward", value: 60 },
			{ type: "left", value: 90 },
			{ type: "forward", value: 60 },
			{ type: "right", value: 90 },
			{ type: "forward", value: 60 },
		],
	},
	{
		id: "square",
		commands: [
			{ type: "forward", value: 100 },
			{ type: "right", value: 90 },
			{ type: "forward", value: 100 },
			{ type: "right", value: 90 },
			{ type: "forward", value: 100 },
			{ type: "right", value: 90 },
			{ type: "forward", value: 100 },
		],
	},
	{
		id: "down-right",
		commands: [
			{ type: "right", value: 90 },
			{ type: "forward", value: 100 },
			{ type: "left", value: 90 },
			{ type: "forward", value: 100 },
		],
	},
	{
		id: "up-right",
		commands: [
			{ type: "left", value: 90 },
			{ type: "forward", value: 80 },
			{ type: "right", value: 90 },
			{ type: "forward", value: 80 },
		],
	},
	{
		id: "down-left",
		commands: [
			{ type: "right", value: 90 },
			{ type: "forward", value: 100 },
			{ type: "right", value: 90 },
			{ type: "forward", value: 100 },
		],
	},
	{
		id: "reverse-steps",
		commands: [
			{ type: "forward", value: 60 },
			{ type: "left", value: 90 },
			{ type: "forward", value: 60 },
			{ type: "right", value: 90 },
			{ type: "forward", value: 60 },
			{ type: "left", value: 90 },
			{ type: "forward", value: 60 },
		],
	},
	{
		id: "c-shape",
		commands: [
			{ type: "right", value: 90 },
			{ type: "forward", value: 100 },
			{ type: "left", value: 90 },
			{ type: "forward", value: 80 },
			{ type: "left", value: 90 },
			{ type: "forward", value: 100 },
		],
	},
	{
		id: "wide-u",
		commands: [
			{ type: "forward", value: 120 },
			{ type: "right", value: 90 },
			{ type: "forward", value: 50 },
			{ type: "right", value: 90 },
			{ type: "forward", value: 120 },
		],
	},
	{
		id: "tall-u",
		commands: [
			{ type: "forward", value: 60 },
			{ type: "right", value: 90 },
			{ type: "forward", value: 100 },
			{ type: "right", value: 90 },
			{ type: "forward", value: 60 },
		],
	},
	{
		id: "reverse-z",
		commands: [
			{ type: "forward", value: 80 },
			{ type: "left", value: 90 },
			{ type: "forward", value: 40 },
			{ type: "left", value: 90 },
			{ type: "forward", value: 80 },
		],
	},
];

// ─── Medium Programs ──────────────────────────────────────────────────────────

const MEDIUM_PROGRAMS: Program[] = [
	{
		id: "z-shape",
		commands: [
			{ type: "forward", value: 90 },
			{ type: "right", value: 90 },
			{ type: "forward", value: 45 },
			{ type: "right", value: 90 },
			{ type: "forward", value: 90 },
		],
	},
	{
		id: "diagonal-corner",
		commands: [
			{ type: "forward", value: 80 },
			{ type: "right", value: 45 },
			{ type: "forward", value: 80 },
		],
	},
	{
		id: "reverse-diagonal",
		commands: [
			{ type: "forward", value: 80 },
			{ type: "left", value: 45 },
			{ type: "forward", value: 80 },
		],
	},
	{
		id: "gap-line",
		commands: [
			{ type: "forward", value: 60 },
			{ type: "penup", value: 0 },
			{ type: "forward", value: 40 },
			{ type: "pendown", value: 0 },
			{ type: "forward", value: 60 },
		],
	},
	{
		id: "jump-and-draw",
		commands: [
			{ type: "penup", value: 0 },
			{ type: "forward", value: 50 },
			{ type: "pendown", value: 0 },
			{ type: "right", value: 90 },
			{ type: "forward", value: 80 },
		],
	},
	{
		id: "chevron",
		commands: [
			{ type: "forward", value: 60 },
			{ type: "right", value: 45 },
			{ type: "forward", value: 60 },
			{ type: "right", value: 90 },
			{ type: "forward", value: 60 },
		],
	},
	{
		id: "backward-demo",
		commands: [
			{ type: "forward", value: 80 },
			{ type: "right", value: 90 },
			{ type: "forward", value: 40 },
			{ type: "backward", value: 80 },
		],
	},
	{
		id: "diagonal-steps",
		commands: [
			{ type: "forward", value: 50 },
			{ type: "right", value: 45 },
			{ type: "forward", value: 50 },
			{ type: "right", value: 45 },
			{ type: "forward", value: 50 },
			{ type: "right", value: 45 },
			{ type: "forward", value: 50 },
		],
	},
	{
		id: "broken-l",
		commands: [
			{ type: "forward", value: 80 },
			{ type: "penup", value: 0 },
			{ type: "forward", value: 30 },
			{ type: "pendown", value: 0 },
			{ type: "right", value: 90 },
			{ type: "forward", value: 80 },
		],
	},
	{
		id: "gap-corner",
		commands: [
			{ type: "forward", value: 50 },
			{ type: "right", value: 90 },
			{ type: "penup", value: 0 },
			{ type: "forward", value: 30 },
			{ type: "pendown", value: 0 },
			{ type: "forward", value: 50 },
		],
	},
	{
		id: "sharp-turn",
		commands: [
			{ type: "forward", value: 70 },
			{ type: "right", value: 135 },
			{ type: "forward", value: 70 },
		],
	},
	{
		id: "wide-vee",
		commands: [
			{ type: "forward", value: 70 },
			{ type: "left", value: 135 },
			{ type: "forward", value: 70 },
		],
	},
];

// ─── Hard Programs ───────────────────────────────────────────────────────────────

const HARD_PROGRAMS: Program[] = [
	{
		id: "var-simple-l",
		code: ["side = 80", "forward(side)", "right(90)", "forward(side)"],
		commands: [
			{ type: "forward", value: 80 },
			{ type: "right", value: 90 },
			{ type: "forward", value: 80 },
		],
	},
	{
		id: "var-grow-steps",
		code: [
			"side = 30",
			"forward(side)",
			"right(90)",
			"side = side + 20",
			"forward(side)",
			"right(90)",
			"side = side + 20",
			"forward(side)",
		],
		commands: [
			{ type: "forward", value: 30 },
			{ type: "right", value: 90 },
			{ type: "forward", value: 50 },
			{ type: "right", value: 90 },
			{ type: "forward", value: 70 },
		],
	},
	{
		id: "var-two-vars",
		code: [
			"width = 80",
			"height = 50",
			"forward(width)",
			"right(90)",
			"forward(height)",
			"right(90)",
			"forward(width)",
		],
		commands: [
			{ type: "forward", value: 80 },
			{ type: "right", value: 90 },
			{ type: "forward", value: 50 },
			{ type: "right", value: 90 },
			{ type: "forward", value: 80 },
		],
	},
	{
		id: "var-rectangle",
		code: [
			"a = 50",
			"b = 80",
			"forward(a)",
			"right(90)",
			"forward(b)",
			"right(90)",
			"forward(a)",
			"right(90)",
			"forward(b)",
		],
		commands: [
			{ type: "forward", value: 50 },
			{ type: "right", value: 90 },
			{ type: "forward", value: 80 },
			{ type: "right", value: 90 },
			{ type: "forward", value: 50 },
			{ type: "right", value: 90 },
			{ type: "forward", value: 80 },
		],
	},
	{
		id: "var-gap-line",
		code: [
			"gap = 30",
			"step = 60",
			"forward(step)",
			"penup()",
			"forward(gap)",
			"pendown()",
			"forward(step)",
		],
		commands: [
			{ type: "forward", value: 60 },
			{ type: "penup", value: 0 },
			{ type: "forward", value: 30 },
			{ type: "pendown", value: 0 },
			{ type: "forward", value: 60 },
		],
	},
	{
		id: "var-diagonal",
		code: [
			"size = 60",
			"forward(size)",
			"right(45)",
			"forward(size)",
			"right(45)",
			"forward(size)",
		],
		commands: [
			{ type: "forward", value: 60 },
			{ type: "right", value: 45 },
			{ type: "forward", value: 60 },
			{ type: "right", value: 45 },
			{ type: "forward", value: 60 },
		],
	},
	{
		id: "var-shrink-turn",
		code: [
			"side = 70",
			"forward(side)",
			"right(135)",
			"side = side - 20",
			"forward(side)",
		],
		commands: [
			{ type: "forward", value: 70 },
			{ type: "right", value: 135 },
			{ type: "forward", value: 50 },
		],
	},
	{
		id: "var-backward",
		code: [
			"dist = 70",
			"forward(dist)",
			"right(90)",
			"forward(dist)",
			"dist = dist - 30",
			"backward(dist)",
		],
		commands: [
			{ type: "forward", value: 70 },
			{ type: "right", value: 90 },
			{ type: "forward", value: 70 },
			{ type: "backward", value: 40 },
		],
	},
	{
		id: "var-four-steps",
		code: [
			"x = 40",
			"forward(x)",
			"right(90)",
			"x = x + 20",
			"forward(x)",
			"right(90)",
			"x = x + 20",
			"forward(x)",
			"right(90)",
			"forward(x)",
		],
		commands: [
			{ type: "forward", value: 40 },
			{ type: "right", value: 90 },
			{ type: "forward", value: 60 },
			{ type: "right", value: 90 },
			{ type: "forward", value: 80 },
			{ type: "right", value: 90 },
			{ type: "forward", value: 80 },
		],
	},
	{
		id: "var-jump-draw",
		code: [
			"dist = 50",
			"penup()",
			"forward(dist)",
			"pendown()",
			"right(90)",
			"dist = dist + 30",
			"forward(dist)",
		],
		commands: [
			{ type: "penup", value: 0 },
			{ type: "forward", value: 50 },
			{ type: "pendown", value: 0 },
			{ type: "right", value: 90 },
			{ type: "forward", value: 80 },
		],
	},
];

const EXPERT_PROGRAMS: Program[] = [
	{
		id: "exp-square",
		code: ["for i in range(4):", "    forward(80)", "    left(90)"],
		commands: [
			{ type: "forward", value: 80 },
			{ type: "left", value: 90 },
			{ type: "forward", value: 80 },
			{ type: "left", value: 90 },
			{ type: "forward", value: 80 },
			{ type: "left", value: 90 },
			{ type: "forward", value: 80 },
			{ type: "left", value: 90 },
		],
	},
	{
		id: "exp-triangle",
		code: ["for i in range(3):", "    forward(80)", "    left(120)"],
		commands: [
			{ type: "forward", value: 80 },
			{ type: "left", value: 120 },
			{ type: "forward", value: 80 },
			{ type: "left", value: 120 },
			{ type: "forward", value: 80 },
			{ type: "left", value: 120 },
		],
	},
	{
		id: "exp-rectangle",
		code: [
			"for i in range(2):",
			"    forward(90)",
			"    left(90)",
			"    forward(45)",
			"    left(90)",
		],
		commands: [
			{ type: "forward", value: 90 },
			{ type: "left", value: 90 },
			{ type: "forward", value: 45 },
			{ type: "left", value: 90 },
			{ type: "forward", value: 90 },
			{ type: "left", value: 90 },
			{ type: "forward", value: 45 },
			{ type: "left", value: 90 },
		],
	},
	{
		id: "exp-staircase",
		code: [
			"for i in range(3):",
			"    forward(50)",
			"    right(90)",
			"    forward(50)",
			"    left(90)",
		],
		commands: [
			{ type: "forward", value: 50 },
			{ type: "right", value: 90 },
			{ type: "forward", value: 50 },
			{ type: "left", value: 90 },
			{ type: "forward", value: 50 },
			{ type: "right", value: 90 },
			{ type: "forward", value: 50 },
			{ type: "left", value: 90 },
			{ type: "forward", value: 50 },
			{ type: "right", value: 90 },
			{ type: "forward", value: 50 },
			{ type: "left", value: 90 },
		],
	},
	{
		id: "exp-pentagon",
		code: ["for i in range(5):", "    forward(60)", "    left(72)"],
		commands: [
			{ type: "forward", value: 60 },
			{ type: "left", value: 72 },
			{ type: "forward", value: 60 },
			{ type: "left", value: 72 },
			{ type: "forward", value: 60 },
			{ type: "left", value: 72 },
			{ type: "forward", value: 60 },
			{ type: "left", value: 72 },
			{ type: "forward", value: 60 },
			{ type: "left", value: 72 },
		],
	},
	{
		id: "exp-hexagon",
		code: ["for i in range(6):", "    forward(45)", "    left(60)"],
		commands: [
			{ type: "forward", value: 45 },
			{ type: "left", value: 60 },
			{ type: "forward", value: 45 },
			{ type: "left", value: 60 },
			{ type: "forward", value: 45 },
			{ type: "left", value: 60 },
			{ type: "forward", value: 45 },
			{ type: "left", value: 60 },
			{ type: "forward", value: 45 },
			{ type: "left", value: 60 },
			{ type: "forward", value: 45 },
			{ type: "left", value: 60 },
		],
	},
	{
		id: "exp-battlements",
		code: [
			"for i in range(3):",
			"    forward(30)",
			"    left(90)",
			"    forward(20)",
			"    right(90)",
			"    forward(30)",
			"    right(90)",
			"    forward(20)",
			"    left(90)",
		],
		commands: [
			{ type: "forward", value: 30 },
			{ type: "left", value: 90 },
			{ type: "forward", value: 20 },
			{ type: "right", value: 90 },
			{ type: "forward", value: 30 },
			{ type: "right", value: 90 },
			{ type: "forward", value: 20 },
			{ type: "left", value: 90 },
			{ type: "forward", value: 30 },
			{ type: "left", value: 90 },
			{ type: "forward", value: 20 },
			{ type: "right", value: 90 },
			{ type: "forward", value: 30 },
			{ type: "right", value: 90 },
			{ type: "forward", value: 20 },
			{ type: "left", value: 90 },
			{ type: "forward", value: 30 },
			{ type: "left", value: 90 },
			{ type: "forward", value: 20 },
			{ type: "right", value: 90 },
			{ type: "forward", value: 30 },
			{ type: "right", value: 90 },
			{ type: "forward", value: 20 },
			{ type: "left", value: 90 },
		],
	},
	{
		id: "exp-line-then-steps",
		code: [
			"forward(60)",
			"for i in range(3):",
			"    forward(40)",
			"    right(90)",
			"    forward(40)",
			"    left(90)",
		],
		commands: [
			{ type: "forward", value: 60 },
			{ type: "forward", value: 40 },
			{ type: "right", value: 90 },
			{ type: "forward", value: 40 },
			{ type: "left", value: 90 },
			{ type: "forward", value: 40 },
			{ type: "right", value: 90 },
			{ type: "forward", value: 40 },
			{ type: "left", value: 90 },
			{ type: "forward", value: 40 },
			{ type: "right", value: 90 },
			{ type: "forward", value: 40 },
			{ type: "left", value: 90 },
		],
	},
	{
		id: "exp-square-then-diagonal",
		code: [
			"for i in range(4):",
			"    forward(60)",
			"    left(90)",
			"right(45)",
			"forward(60)",
		],
		commands: [
			{ type: "forward", value: 60 },
			{ type: "left", value: 90 },
			{ type: "forward", value: 60 },
			{ type: "left", value: 90 },
			{ type: "forward", value: 60 },
			{ type: "left", value: 90 },
			{ type: "forward", value: 60 },
			{ type: "left", value: 90 },
			{ type: "right", value: 45 },
			{ type: "forward", value: 60 },
		],
	},
	{
		id: "exp-dashed-line",
		code: [
			"for i in range(3):",
			"    forward(40)",
			"    penup()",
			"    forward(20)",
			"    pendown()",
		],
		commands: [
			{ type: "forward", value: 40 },
			{ type: "penup", value: 0 },
			{ type: "forward", value: 20 },
			{ type: "pendown", value: 0 },
			{ type: "forward", value: 40 },
			{ type: "penup", value: 0 },
			{ type: "forward", value: 20 },
			{ type: "pendown", value: 0 },
			{ type: "forward", value: 40 },
			{ type: "penup", value: 0 },
			{ type: "forward", value: 20 },
			{ type: "pendown", value: 0 },
		],
	},
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function commandToString(cmd: TurtleCommand): string {
	if (cmd.type === "penup" || cmd.type === "pendown") return `${cmd.type}()`;
	return `${cmd.type}(${cmd.value})`;
}

/** Compute movement segments, always starting from the canvas centre. */
function computeSegments(program: Program): Segment[] {
	let x = CANVAS_SIZE / 2;
	let y = CANVAS_SIZE / 2;
	let heading = 0;
	let penDown = true;
	const segments: Segment[] = [];

	for (const cmd of program.commands) {
		if (cmd.type === "forward" || cmd.type === "backward") {
			const rad = (heading * Math.PI) / 180;
			const sign = cmd.type === "backward" ? -1 : 1;
			const nx = x + sign * cmd.value * Math.cos(rad);
			const ny = y + sign * cmd.value * Math.sin(rad);
			segments.push({ x1: x, y1: y, x2: nx, y2: ny, heading, draw: penDown });
			x = nx;
			y = ny;
		} else if (cmd.type === "right") {
			heading = (heading + cmd.value) % 360;
		} else if (cmd.type === "left") {
			heading = (((heading - cmd.value) % 360) + 360) % 360;
		} else if (cmd.type === "penup") {
			penDown = false;
		} else if (cmd.type === "pendown") {
			penDown = true;
		}
	}

	return segments;
}

function drawScaleBarOnCtx(ctx: CanvasRenderingContext2D) {
	const barLeft = 14;
	const lineY = 28;
	const tickTop = 20;
	const labelY = 38;
	ctx.fillStyle = "rgba(255,255,255,0.85)";
	ctx.beginPath();
	ctx.roundRect(10, 13, 158, 32, 4);
	ctx.fill();
	ctx.beginPath();
	ctx.moveTo(barLeft, lineY);
	ctx.lineTo(barLeft + 150, lineY);
	ctx.strokeStyle = "#1e293b";
	ctx.lineWidth = 1.5;
	ctx.setLineDash([]);
	ctx.stroke();
	for (const offset of [0, 50, 100, 150]) {
		ctx.beginPath();
		ctx.moveTo(barLeft + offset, tickTop);
		ctx.lineTo(barLeft + offset, lineY);
		ctx.stroke();
	}
	ctx.font = "10px monospace";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillStyle = "#1e293b";
	for (const [offset, label] of [
		[50, "50"],
		[100, "100"],
		[150, "150"],
	] as const) {
		ctx.fillText(label, barLeft + offset, labelY);
	}
}

// ─── Component ────────────────────────────────────────────────────────────────

const PythonTurtleTool: React.FC = () => {
	const [difficulty, setDifficulty] = useState<Difficulty>("beginner");
	const [shuffledBeginner] = useState(() => shuffleArray(BEGINNER_PROGRAMS));
	const [shuffledMedium] = useState(() => shuffleArray(MEDIUM_PROGRAMS));
	const [shuffledHard] = useState(() => shuffleArray(HARD_PROGRAMS));
	const [shuffledExpert] = useState(() => shuffleArray(EXPERT_PROGRAMS));
	const [programIndex, setProgramIndex] = useState(0);
	const [phase, setPhase] = useState<Phase>("drawing");
	const [isPointerDown, setIsPointerDown] = useState(false);
	const [copied, setCopied] = useState(false);
	const [annotate, setAnnotate] = useState(false);
	const [showScale, setShowScale] = useState(false);

	const userCanvasRef = useRef<HTMLCanvasElement>(null);
	const turtleCanvasRef = useRef<HTMLCanvasElement>(null);
	const animFrameRef = useRef<number>(0);
	const lastPointRef = useRef<{ x: number; y: number } | null>(null);
	const showScaleRef = useRef(showScale);
	showScaleRef.current = showScale;

	const programs =
		difficulty === "beginner"
			? shuffledBeginner
			: difficulty === "medium"
				? shuffledMedium
				: difficulty === "hard"
					? shuffledHard
					: shuffledExpert;
	const program = programs[programIndex % programs.length];

	// ── Starting indicator ──────────────────────────────────────────────────

	const drawStartIndicator = useCallback(() => {
		const canvas = turtleCanvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

		const x = CANVAS_SIZE / 2;
		const y = CANVAS_SIZE / 2;

		// Dot
		ctx.beginPath();
		ctx.arc(x, y, 6, 0, Math.PI * 2);
		ctx.fillStyle = "#6366f1";
		ctx.fill();

		// Arrow pointing right (start direction)
		ctx.save();
		ctx.translate(x, y);
		ctx.beginPath();
		ctx.moveTo(14, 0);
		ctx.lineTo(2, -5);
		ctx.lineTo(2, 5);
		ctx.closePath();
		ctx.fillStyle = "#6366f1";
		ctx.fill();
		ctx.restore();
	}, []);

	// Reset canvas + indicator whenever program changes
	// biome-ignore lint/correctness/useExhaustiveDependencies: `program` is an intentional trigger — when the challenge changes we reset the canvas
	useEffect(() => {
		if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
		const userCtx = userCanvasRef.current?.getContext("2d");
		userCtx?.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
		const turtleCtx = turtleCanvasRef.current?.getContext("2d");
		turtleCtx?.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
		setPhase("drawing");
		drawStartIndicator();
		if (showScaleRef.current) {
			const ctx = turtleCanvasRef.current?.getContext("2d");
			if (ctx) drawScaleBarOnCtx(ctx);
		}
	}, [program, drawStartIndicator]);

	useEffect(() => {
		return () => {
			if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
		};
	}, []);

	// ── User drawing ─────────────────────────────────────────────────────────

	const getCanvasPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
		const canvas = userCanvasRef.current;
		if (!canvas) return { x: 0, y: 0 };
		const rect = canvas.getBoundingClientRect();
		return {
			x: (e.clientX - rect.left) * (CANVAS_SIZE / rect.width),
			y: (e.clientY - rect.top) * (CANVAS_SIZE / rect.height),
		};
	};

	const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
		if (phase !== "drawing") return;
		e.currentTarget.setPointerCapture(e.pointerId);
		const pt = getCanvasPoint(e);
		lastPointRef.current = pt;
		setIsPointerDown(true);
		const ctx = userCanvasRef.current?.getContext("2d");
		if (ctx) {
			ctx.beginPath();
			ctx.arc(pt.x, pt.y, 1.5, 0, Math.PI * 2);
			ctx.fillStyle = "#3b82f6";
			ctx.fill();
		}
	};

	const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
		if (!isPointerDown || phase !== "drawing") return;
		const pt = getCanvasPoint(e);
		const ctx = userCanvasRef.current?.getContext("2d");
		if (ctx && lastPointRef.current) {
			ctx.beginPath();
			ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
			ctx.lineTo(pt.x, pt.y);
			ctx.strokeStyle = "#3b82f6";
			ctx.lineWidth = 3;
			ctx.lineCap = "round";
			ctx.lineJoin = "round";
			ctx.stroke();
		}
		lastPointRef.current = pt;
	};

	const handlePointerUp = () => {
		setIsPointerDown(false);
		lastPointRef.current = null;
	};

	const handleClear = () => {
		userCanvasRef.current
			?.getContext("2d")
			?.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
	};

	// ── Turtle animation ─────────────────────────────────────────────────────

	const drawFinalFrame = useCallback(() => {
		const canvas = turtleCanvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const segments = computeSegments(program);
		const segLengths = segments.map((s) =>
			Math.sqrt((s.x2 - s.x1) ** 2 + (s.y2 - s.y1) ** 2),
		);
		const startX = CANVAS_SIZE / 2;
		const startY = CANVAS_SIZE / 2;

		ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

		// Draw all segments
		for (let i = 0; i < segments.length; i++) {
			const seg = segments[i];
			ctx.beginPath();
			ctx.moveTo(seg.x1, seg.y1);
			ctx.lineTo(seg.x2, seg.y2);
			if (seg.draw) {
				ctx.strokeStyle = "#16a34a";
				ctx.lineWidth = 3;
				ctx.setLineDash([]);
			} else {
				ctx.strokeStyle = "#94a3b8";
				ctx.lineWidth = 2;
				ctx.setLineDash([6, 6]);
			}
			ctx.lineCap = "round";
			ctx.stroke();
			ctx.setLineDash([]);
		}

		// Start dot
		ctx.beginPath();
		ctx.arc(startX, startY, 5, 0, Math.PI * 2);
		ctx.fillStyle = "#6366f1";
		ctx.fill();

		// Length annotations
		if (annotate) {
			ctx.font = "11px monospace";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			for (let i = 0; i < segments.length; i++) {
				const seg = segments[i];
				const segLen = segLengths[i];
				if (segLen < 1) continue;
				const mx = (seg.x1 + seg.x2) / 2;
				const my = (seg.y1 + seg.y2) / 2;
				// Perpendicular offset
				const dx = seg.x2 - seg.x1;
				const dy = seg.y2 - seg.y1;
				const nx = -dy / segLen;
				const ny = dx / segLen;
				const lx = mx + nx * 13;
				const ly = my + ny * 13;
				const label = Math.round(segLen).toString();
				const m = ctx.measureText(label);
				// Background pill
				ctx.fillStyle = "rgba(255,255,255,0.85)";
				ctx.beginPath();
				ctx.roundRect(lx - m.width / 2 - 3, ly - 7, m.width + 6, 14, 3);
				ctx.fill();
				// Text
				ctx.fillStyle = seg.draw ? "#15803d" : "#64748b";
				ctx.fillText(label, lx, ly);
			}
		}

		// Scale bar
		if (showScale) {
			const barLeft = 14;
			const lineY = 28;
			const tickTop = 20;
			const labelY = 38;
			// Background
			ctx.fillStyle = "rgba(255,255,255,0.85)";
			ctx.beginPath();
			ctx.roundRect(10, 13, 158, 32, 4);
			ctx.fill();
			// Line
			ctx.beginPath();
			ctx.moveTo(barLeft, lineY);
			ctx.lineTo(barLeft + 150, lineY);
			ctx.strokeStyle = "#1e293b";
			ctx.lineWidth = 1.5;
			ctx.setLineDash([]);
			ctx.stroke();
			// Ticks at 0, 50, 100, 150
			for (const offset of [0, 50, 100, 150]) {
				ctx.beginPath();
				ctx.moveTo(barLeft + offset, tickTop);
				ctx.lineTo(barLeft + offset, lineY);
				ctx.stroke();
			}
			// Labels at 50, 100, 150
			ctx.font = "10px monospace";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillStyle = "#1e293b";
			for (const [offset, label] of [
				[50, "50"],
				[100, "100"],
				[150, "150"],
			] as const) {
				ctx.fillText(label, barLeft + offset, labelY);
			}
		}
	}, [program, annotate, showScale]);

	// Draw final frame when animation completes (phase flips to "done")
	// biome-ignore lint/correctness/useExhaustiveDependencies: drawFinalFrame intentionally excluded — we only want this to fire when phase changes, not when program changes
	useEffect(() => {
		if (phase === "done") drawFinalFrame();
	}, [phase]);

	// Redraw when annotate is toggled while in "done" state
	// biome-ignore lint/correctness/useExhaustiveDependencies: phase and drawFinalFrame intentionally excluded
	useEffect(() => {
		if (phase === "done") drawFinalFrame();
	}, [annotate]); // eslint-disable-line

	// Handle showScale toggle in both phases
	// biome-ignore lint/correctness/useExhaustiveDependencies: phase and drawFinalFrame intentionally excluded
	useEffect(() => {
		if (phase === "done") {
			drawFinalFrame();
		} else if (phase === "drawing") {
			// Redraw start indicator then overlay scale bar
			drawStartIndicator();
			if (showScale) {
				const ctx = turtleCanvasRef.current?.getContext("2d");
				if (ctx) drawScaleBarOnCtx(ctx);
			}
		}
	}, [showScale]); // eslint-disable-line

	const animateTurtle = useCallback(() => {
		const canvas = turtleCanvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const segments = computeSegments(program);
		const segLengths = segments.map((s) =>
			Math.sqrt((s.x2 - s.x1) ** 2 + (s.y2 - s.y1) ** 2),
		);
		const totalLength = segLengths.reduce((a, b) => a + b, 0);
		const startX = CANVAS_SIZE / 2;
		const startY = CANVAS_SIZE / 2;

		let distTraveled = 0;
		let lastTime: number | null = null;

		const drawTurtle = (x: number, y: number, headingDeg: number) => {
			ctx.save();
			ctx.translate(x, y);
			ctx.rotate((headingDeg * Math.PI) / 180);
			ctx.beginPath();
			ctx.moveTo(10, 0);
			ctx.lineTo(-7, -6);
			ctx.lineTo(-7, 6);
			ctx.closePath();
			ctx.fillStyle = "#16a34a";
			ctx.fill();
			ctx.restore();
		};

		const drawSeg = (
			x1: number,
			y1: number,
			x2: number,
			y2: number,
			penDown: boolean,
		) => {
			ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);
			if (penDown) {
				ctx.strokeStyle = "#16a34a";
				ctx.lineWidth = 3;
				ctx.setLineDash([]);
			} else {
				ctx.strokeStyle = "#94a3b8";
				ctx.lineWidth = 2;
				ctx.setLineDash([6, 6]);
			}
			ctx.lineCap = "round";
			ctx.stroke();
			ctx.setLineDash([]);
		};

		const drawFrame = (dist: number) => {
			ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
			let rem = dist;
			let turtleX = startX;
			let turtleY = startY;
			let turtleHeading = 0;

			for (let i = 0; i < segments.length; i++) {
				if (rem <= 0) break;
				const seg = segments[i];
				const segLen = segLengths[i];

				if (rem >= segLen) {
					drawSeg(seg.x1, seg.y1, seg.x2, seg.y2, seg.draw);
					turtleX = seg.x2;
					turtleY = seg.y2;
					turtleHeading = seg.heading;
					rem -= segLen;
				} else {
					const t = segLen > 0 ? rem / segLen : 0;
					const cx = seg.x1 + (seg.x2 - seg.x1) * t;
					const cy = seg.y1 + (seg.y2 - seg.y1) * t;
					drawSeg(seg.x1, seg.y1, cx, cy, seg.draw);
					turtleX = cx;
					turtleY = cy;
					turtleHeading = seg.heading;
					rem = 0;
					break;
				}
			}

			// Start dot
			ctx.beginPath();
			ctx.arc(startX, startY, 5, 0, Math.PI * 2);
			ctx.fillStyle = "#6366f1";
			ctx.fill();

			// Turtle indicator (only while animating)
			if (dist < totalLength) {
				drawTurtle(turtleX, turtleY, turtleHeading);
			}
		};

		const step = (time: number) => {
			if (lastTime === null) lastTime = time;
			const delta = Math.min((time - lastTime) / 1000, 0.1);
			lastTime = time;

			distTraveled += TURTLE_SPEED * delta;

			if (distTraveled >= totalLength) {
				drawFinalFrame();
				setPhase("done");
				return;
			}

			drawFrame(distTraveled);
			animFrameRef.current = requestAnimationFrame(step);
		};

		animFrameRef.current = requestAnimationFrame(step);
	}, [program, drawFinalFrame]);

	// ── Handlers ─────────────────────────────────────────────────────────────

	const handleSubmit = () => {
		if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
		setPhase("animating");
		animateTurtle();
	};

	const handleNextChallenge = () => {
		if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
		setProgramIndex((i) => i + 1);
	};

	const handleDifficultyChange = (d: Difficulty) => {
		if (d === difficulty) return;
		if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
		setDifficulty(d);
		setProgramIndex(0);
	};

	const handleCopyCode = () => {
		const body = program.code
			? program.code.join("\n")
			: program.commands.map(commandToString).join("\n");
		const lines = `from turtle import *\n\n${body}`;
		navigator.clipboard.writeText(lines).then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		});
	};

	// ── Render ────────────────────────────────────────────────────────────────

	return (
		<div className="w-full max-w-4xl p-4 mx-auto">
			{/* Header */}
			<div className="flex items-center justify-between mb-4">
				<BackToHub location="/programming" />
				<div className="flex gap-2">
					{(["beginner", "medium", "hard", "expert"] as const).map((d) => (
						<button
							key={d}
							type="button"
							onClick={() => handleDifficultyChange(d)}
							className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${
								difficulty === d
									? d === "beginner"
										? "bg-green-500 text-white"
										: d === "medium"
											? "bg-amber-500 text-white"
											: d === "hard"
												? "bg-rose-500 text-white"
												: "bg-violet-600 text-white"
									: "bg-slate-200 text-slate-600 hover:bg-slate-300"
							}`}
						>
							{d === "beginner"
								? "🐢 Beginner"
								: d === "medium"
									? "⚡ Medium"
									: d === "hard"
										? "🔥 Hard"
										: "💡 Expert"}
						</button>
					))}
				</div>
			</div>

			<h2 className="mb-1 text-2xl font-bold text-center text-slate-800">
				Python Turtle Predictor
			</h2>
			<p className="mb-6 text-sm text-center text-slate-500">
				Read the code, then draw what you think the turtle will trace on the
				canvas.
			</p>

			{/* Main grid */}
			<div className="items-start grid gap-6 md:grid-cols-2">
				{/* Code panel */}
				<div>
					<div className="flex items-center justify-between mb-2">
						<h3 className="font-semibold text-slate-700">Code to trace:</h3>
						<button
							type="button"
							onClick={handleCopyCode}
							className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
						>
							{copied ? "✓ Copied!" : "⎘ Copy"}
						</button>
					</div>
					<div className="p-4 font-mono text-sm whitespace-pre rounded-lg leading-7 bg-slate-900">
						{program.code
							? program.code.map((line, i) => (
									<div
										// biome-ignore lint/suspicious/noArrayIndexKey: static program lines
										key={i}
										className={
											/^for /.test(line)
												? "text-violet-400"
												: /^\w+ =/.test(line)
													? "text-amber-300"
													: "text-green-400"
										}
									>
										{line}
									</div>
								))
							: program.commands.map((cmd, i) => (
									// biome-ignore lint/suspicious/noArrayIndexKey: static program lines
									<div key={i} className="text-green-400">
										{commandToString(cmd)}
									</div>
								))}
					</div>

					<div className="p-3 mt-4 text-xs border rounded-lg space-y-1 bg-slate-50 border-slate-200 text-slate-600">
						{difficulty === "beginner" || difficulty === "medium" ? (
							<>
								<p className="mb-1 font-semibold text-slate-700">
									Command guide:
								</p>
								<p>
									<span className="font-mono text-indigo-600">forward(n)</span>{" "}
									— move forward n steps
								</p>
								<p>
									<span className="font-mono text-indigo-600">right(n)</span> —
									turn clockwise n° ↻
								</p>
								<p>
									<span className="font-mono text-indigo-600">left(n)</span> —
									turn anti-clockwise n° ↺
								</p>
								{difficulty === "medium" && (
									<>
										<p>
											<span className="font-mono text-indigo-600">
												backward(n)
											</span>{" "}
											— move backward n steps
										</p>
										<p>
											<span className="font-mono text-indigo-600">penup()</span>{" "}
											— lift the pen (stop drawing)
										</p>
										<p>
											<span className="font-mono text-indigo-600">
												pendown()
											</span>{" "}
											— lower the pen (start drawing)
										</p>
										<p className="pt-1 text-slate-400">
											Angles of 45° and 135° are also used at this level.
										</p>
									</>
								)}
							</>
						) : difficulty === "hard" ? (
							<>
								<p className="mb-1 font-semibold text-slate-700">
									Variable rules:
								</p>
								<p>
									<span className="font-mono text-amber-600">side = 50</span> —
									assigns 50 to side
								</p>
								<p>
									<span className="font-mono text-amber-600">
										side = side + 20
									</span>{" "}
									— increases side by 20
								</p>
								<p>
									<span className="font-mono text-indigo-600">
										forward(side)
									</span>{" "}
									— moves by the value of side
								</p>
								<p className="pt-1 text-slate-400">
									Work out the value of each variable before tracing.
								</p>
							</>
						) : (
							<>
								<p className="mb-1 font-semibold text-slate-700">Loop rules:</p>
								<p>
									<span className="font-mono text-violet-600">
										for i in range(n):
									</span>{" "}
									— repeat the body n times
								</p>
								<p>
									<span className="font-mono text-indigo-600">
										&nbsp;&nbsp;&nbsp;&nbsp;forward(n)
									</span>{" "}
									— indented = inside the loop
								</p>
								<p>
									<span className="font-mono text-indigo-600">forward(n)</span>{" "}
									— no indent = outside the loop
								</p>
								<p className="pt-1 text-slate-400">
									Count the loop body steps and multiply by range.
								</p>
							</>
						)}
					</div>

					{/* Phase status (desktop only) */}
					{phase === "done" && (
						<div className="p-3 mt-4 text-sm font-medium border rounded-lg bg-amber-50 border-amber-200 text-amber-800">
							The green line shows what the code actually does. How close were
							you? 🤔
						</div>
					)}
				</div>

				{/* Canvas panel */}
				<div>
					<div className="flex items-center justify-between mb-2">
						<h3 className="font-semibold text-slate-700">
							{phase === "drawing"
								? "Draw your prediction:"
								: phase === "animating"
									? "Animating…"
									: "Result:"}
						</h3>
						{phase === "drawing" && (
							<button
								type="button"
								onClick={handleClear}
								className="text-sm transition-colors text-slate-400 hover:text-red-500"
							>
								Clear ✕
							</button>
						)}
					</div>

					{/* Stacked canvases */}
					<div
						className="relative overflow-hidden bg-white border-2 rounded-lg border-slate-300"
						style={{
							width: CANVAS_SIZE,
							maxWidth: "100%",
							height: CANVAS_SIZE,
						}}
					>
						{/* User drawing layer (bottom) */}
						<canvas
							ref={userCanvasRef}
							width={CANVAS_SIZE}
							height={CANVAS_SIZE}
							className="absolute inset-0 w-full h-full"
							style={{
								touchAction: "none",
								cursor: phase === "drawing" ? "crosshair" : "default",
							}}
							onPointerDown={handlePointerDown}
							onPointerMove={handlePointerMove}
							onPointerUp={handlePointerUp}
							onPointerLeave={handlePointerUp}
						/>
						{/* Turtle animation layer (top, non-interactive) */}
						<canvas
							ref={turtleCanvasRef}
							width={CANVAS_SIZE}
							height={CANVAS_SIZE}
							className="absolute inset-0 w-full h-full pointer-events-none"
						/>
					</div>

					{/* Annotate + scale toggles */}
					<div className="flex flex-wrap mt-2 gap-4">
						{phase !== "drawing" && (
							<label className="flex items-center text-xs cursor-pointer select-none gap-2 text-slate-600">
								<input
									type="checkbox"
									checked={annotate}
									onChange={(e) => setAnnotate(e.target.checked)}
									className="w-3.5 h-3.5 accent-indigo-500"
								/>
								Annotate lengths
							</label>
						)}
						<label className="flex items-center text-xs cursor-pointer select-none gap-2 text-slate-600">
							<input
								type="checkbox"
								checked={showScale}
								onChange={(e) => setShowScale(e.target.checked)}
								className="w-3.5 h-3.5 accent-indigo-500"
							/>
							Show scale
						</label>
					</div>
					{/* Legend */}
					{phase !== "drawing" && (
						<div className="flex flex-wrap mt-2 text-xs gap-4 text-slate-500">
							<span className="flex items-center gap-1.5">
								<span className="inline-block w-4 h-0.5 bg-blue-500 rounded" />
								Your prediction
							</span>
							<span className="flex items-center gap-1.5">
								<span className="inline-block w-4 h-0.5 bg-green-500 rounded" />
								Actual path
							</span>
							{(difficulty === "medium" ||
								difficulty === "hard" ||
								difficulty === "expert") && (
								<span className="flex items-center gap-1.5">
									<span className="inline-block w-4 border-t-2 border-dashed border-slate-400" />
									Pen up
								</span>
							)}
							<span className="flex items-center gap-1.5">
								<span className="inline-block w-2.5 h-2.5 rounded-full bg-indigo-500" />
								Start
							</span>
						</div>
					)}
				</div>
			</div>

			{/* Action buttons */}
			<div className="flex items-center justify-center mt-6 gap-4">
				{phase === "drawing" && (
					<button
						type="button"
						onClick={handleSubmit}
						className="px-8 py-3 font-bold text-white bg-indigo-600 rounded-lg shadow-md transition-colors hover:bg-indigo-700"
					>
						Submit &amp; See Answer
					</button>
				)}
				{phase === "done" && (
					<button
						type="button"
						onClick={handleNextChallenge}
						className="px-8 py-3 font-bold text-white bg-green-600 rounded-lg shadow-md transition-colors hover:bg-green-700"
					>
						Next Challenge →
					</button>
				)}
			</div>
		</div>
	);
};

export default PythonTurtleTool;
