import { act, renderHook } from "@testing-library/react";
import { useStageTimer } from "../../hooks/useStageTimer";

describe("useStageTimer", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("starts with null startTime and zero elapsed", () => {
		const { result } = renderHook(() => useStageTimer());
		expect(result.current.startTime).toBeNull();
		expect(result.current.elapsed).toBe(0);
	});

	it("sets startTime when startTimer is called", () => {
		const { result } = renderHook(() => useStageTimer());
		act(() => {
			result.current.startTimer();
		});
		expect(result.current.startTime).not.toBeNull();
	});

	it("updates elapsed time after startTimer is called", () => {
		const { result } = renderHook(() => useStageTimer());
		act(() => {
			result.current.startTimer();
		});
		act(() => {
			vi.advanceTimersByTime(2000);
		});
		expect(result.current.elapsed).toBeGreaterThan(0);
	});

	it("resets startTime and elapsed when resetTimer is called", () => {
		const { result } = renderHook(() => useStageTimer());
		act(() => {
			result.current.startTimer();
		});
		act(() => {
			vi.advanceTimersByTime(1000);
		});
		act(() => {
			result.current.resetTimer();
		});
		expect(result.current.startTime).toBeNull();
		expect(result.current.elapsed).toBe(0);
	});

	it("calls the callback with the elapsed time when completeStage is called", () => {
		const { result } = renderHook(() => useStageTimer());
		act(() => {
			result.current.startTimer();
		});
		act(() => {
			vi.advanceTimersByTime(3000);
		});
		const onComplete = vi.fn();
		act(() => {
			result.current.completeStage(onComplete);
		});
		expect(onComplete).toHaveBeenCalledOnce();
		const timeTaken = onComplete.mock.calls[0][0] as number;
		expect(timeTaken).toBeGreaterThanOrEqual(3);
	});

	it("passes 0 to callback when completeStage is called before startTimer", () => {
		const { result } = renderHook(() => useStageTimer());
		const onComplete = vi.fn();
		act(() => {
			result.current.completeStage(onComplete);
		});
		expect(onComplete).toHaveBeenCalledWith(0);
	});
});
