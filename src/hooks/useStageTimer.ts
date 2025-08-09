import { useCallback, useEffect, useState } from "react";

interface UseStageTimerReturn {
	startTime: number | null;
	elapsed: number;
	startTimer: () => void;
	resetTimer: () => void;
	completeStage: (onComplete: (time: number) => void) => void;
}

/**
 * Custom hook for managing stage timer functionality across game stages
 */
export const useStageTimer = (): UseStageTimerReturn => {
	const [startTime, setStartTime] = useState<number | null>(null);
	const [elapsed, setElapsed] = useState<number>(0);

	// Timer effect - updates elapsed time every 100ms
	useEffect(() => {
		const timer = setInterval(() => {
			if (startTime) {
				setElapsed((Date.now() - startTime) / 1000);
			}
		}, 100);
		return () => clearInterval(timer);
	}, [startTime]);

	const startTimer = useCallback(() => {
		setStartTime(Date.now());
	}, []);

	const resetTimer = useCallback(() => {
		setStartTime(null);
		setElapsed(0);
	}, []);

	const completeStage = useCallback(
		(onComplete: (time: number) => void) => {
			const endTime = Date.now();
			const timeTaken = (endTime - (startTime ?? endTime)) / 1000;
			onComplete(timeTaken);
		},
		[startTime],
	);

	return {
		startTime,
		elapsed,
		startTimer,
		resetTimer,
		completeStage,
	};
};
