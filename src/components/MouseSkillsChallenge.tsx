import { useState } from "react";
import { BackToHub, GameButton } from "./Buttons";
import ClickStage from "./ClickStage";
import DragDropStage from "./DragDropStage";
import DragStage from "./DragStage";
import TraceStage from "./TraceStage";

const MouseSkillsChallenge = () => {
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

	const [stage, setStage] = useState<MouseGameStage>("tracing");
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
					<div className="p-8 text-center">
						<h2 className="mb-4 text-4xl font-bold text-slate-800">
							Mouse Skills Challenge
						</h2>
						<p className="max-w-2xl mx-auto mb-8 text-lg text-slate-600">
							Get ready to test your mouse skills! This game has four stages to
							help you practice tracing, clicking, dragging and dropping. Click
							the button below to start.
						</p>
						<GameButton onClick={() => setStage("tracing")}>
							Start Challenge
						</GameButton>
						<BackToHub location="/it-skills" />
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
					<div className="p-8 text-center">
						<h2 className="mb-4 text-4xl font-bold text-slate-800">
							🏆 Well Done! 🏆
						</h2>
						<p className="mb-8 text-lg text-slate-600">
							You completed all the stages. Here are your times:
						</p>
						<div className="max-w-md p-6 mx-auto space-y-3 text-left bg-white rounded-lg shadow-md">
							{Object.entries(times).map(([key, value]) => (
								<div
									key={key}
									className="flex justify-between text-xl capitalize"
								>
									<span className="font-bold">{key}:</span>
									<span>{value?.toFixed(2)} seconds</span>
								</div>
							))}
							<div className="flex justify-between pt-4 text-xl font-bold border-t border-slate-200">
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
