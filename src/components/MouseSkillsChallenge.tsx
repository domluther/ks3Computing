import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import ClickStage from "./ClickStage";
import DragDropStage from "./DragDropStage";
import DragStage from "./DragStage";
import GameButton from "./GameButton";
import TraceStage from "./TraceStage";

const MouseSkillsChallenge = () => {
	const navigate = useNavigate();

	type MouseGameStage =
		| "intro"
		| "tracing"
		| "clicking"
		| "dragDropping"
		| "dragging"
		| "results";
	interface TimeRecord {
		tracing: number | null;
		clicking: number | null;
		dragDropping: number | null;
		dragging: number | null;
	}

	const [stage, setStage] = useState<MouseGameStage>("intro");
	const [times, setTimes] = useState<TimeRecord>({
		tracing: null,
		clicking: null,
		dragDropping: null,
		dragging: null,
	});

	const handleComplete = (
		stageName: keyof TimeRecord,
		time: number,
		nextStage: MouseGameStage,
	) => {
		setTimes((prev) => ({ ...prev, [stageName]: time }));
		setStage(nextStage);
	};

	const resetGame = () => {
		setTimes({
			tracing: null,
			clicking: null,
			dragDropping: null,
			dragging: null,
		});
		setStage("intro");
	};

	const renderStage = () => {
		switch (stage) {
			case "intro":
				return (
					<div className="text-center p-8">
						<h2 className="text-4xl font-bold text-slate-800 mb-4">
							Mouse Skills Challenge
						</h2>
						<p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
							Get ready to test your mouse skills! This game has four stages to
							help you practice tracing, clicking, dragging and dropping. Click
							the button below to start.
						</p>
						<GameButton onClick={() => setStage("tracing")}>
							Start Challenge
						</GameButton>
						<button
							onClick={() => navigate({ to: "/it-skills" })}
							className="text-slate-600 hover:text-slate-800 font-semibold py-3 px-6"
							type="button"
						>
							Back to Hub
						</button>
					</div>
				);
			case "tracing":
				return (
					<TraceStage
						onComplete={(time) => handleComplete("tracing", time, "clicking")}
						onRestart={resetGame}
					/>
				);
			case "clicking":
				return (
					<ClickStage
						onComplete={(time) =>
							handleComplete("clicking", time, "dragDropping")
						}
						onRestart={resetGame}
					/>
				);
			case "dragDropping":
				return (
					<DragDropStage
						onComplete={(time) =>
							handleComplete("dragDropping", time, "dragging")
						}
						onRestart={resetGame}
					/>
				);
			case "dragging":
				return (
					<DragStage
						onComplete={(time) => handleComplete("dragging", time, "results")}
						onRestart={resetGame}
					/>
				);
			case "results": {
				const totalTimeSeconds = Object.values(times).reduce(
					(sum, t) => sum + (t ?? 0),
					0,
				);
				const minutes = Math.floor(totalTimeSeconds / 60);
				const seconds = Math.round(totalTimeSeconds % 60);
				const formattedTotal = `${minutes}m ${seconds}s`;

				return (
					<div className="text-center p-8">
						<h2 className="text-4xl font-bold text-slate-800 mb-4">
							🏆 Well Done! 🏆
						</h2>
						<p className="text-lg text-slate-600 mb-8">
							You completed all the stages. Here are your times:
						</p>
						<div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto space-y-3 text-left">
							{Object.entries(times).map(([key, value]) => (
								<div
									key={key}
									className="flex justify-between text-xl capitalize"
								>
									<span className="font-bold">{key}:</span>
									<span>{value?.toFixed(2)} seconds</span>
								</div>
							))}
							<div className="flex justify-between text-xl font-bold pt-4 border-t border-slate-200">
								<span>Total time:</span>
								<span>{formattedTotal}</span>
							</div>
						</div>
						<GameButton onClick={resetGame} className="mt-8">
							Play Again
						</GameButton>
					</div>
				);
			}
		}
	};
	return <>{renderStage()}</>;
};

export default MouseSkillsChallenge;
