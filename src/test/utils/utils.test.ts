import { shuffleArray } from "../../utils/utils";

describe("shuffleArray", () => {
	it("returns an array with the same length", () => {
		const input = [1, 2, 3, 4, 5];
		expect(shuffleArray(input)).toHaveLength(5);
	});

	it("returns an array containing the same elements", () => {
		const input = ["a", "b", "c", "d"];
		const result = shuffleArray(input);
		expect(result).toHaveLength(input.length);
		expect(result.sort()).toEqual([...input].sort());
	});

	it("does not mutate the original array", () => {
		const input = [1, 2, 3];
		const copy = [...input];
		shuffleArray(input);
		expect(input).toEqual(copy);
	});

	it("returns a new array reference", () => {
		const input = [1, 2, 3];
		const result = shuffleArray(input);
		expect(result).not.toBe(input);
	});

	it("handles an empty array", () => {
		expect(shuffleArray([])).toEqual([]);
	});

	it("handles a single-element array", () => {
		expect(shuffleArray([42])).toEqual([42]);
	});

	it("works with arrays of objects", () => {
		const input = [{ id: 1 }, { id: 2 }, { id: 3 }];
		const result = shuffleArray(input);
		expect(result).toHaveLength(3);
		// All original objects should still be present
		input.forEach((obj) => {
			expect(result).toContain(obj);
		});
	});
});
