import { hardwareData, sortedHardwareItems } from "../../data/hardwareData";

describe("hardwareData", () => {
	it("categorises input devices correctly", () => {
		expect(hardwareData.Keyboard).toBe("input");
		expect(hardwareData.Mouse).toBe("input");
		expect(hardwareData.Scanner).toBe("input");
		expect(hardwareData.Webcam).toBe("input");
		expect(hardwareData.Microphone).toBe("input");
	});

	it("categorises output devices correctly", () => {
		expect(hardwareData.Monitor).toBe("output");
		expect(hardwareData.Printer).toBe("output");
		expect(hardwareData.Speakers).toBe("output");
		expect(hardwareData.Headphones).toBe("output");
		expect(hardwareData.Projector).toBe("output");
	});

	it("categorises both input and output devices correctly", () => {
		expect(hardwareData.Touchscreen).toBe("both");
		expect(hardwareData["Game Controller"]).toBe("both");
		expect(hardwareData.Smartwatch).toBe("both");
	});

	it("only contains valid category values", () => {
		const validCategories = new Set(["input", "output", "both"]);
		for (const value of Object.values(hardwareData)) {
			expect(validCategories.has(value)).toBe(true);
		}
	});
});

describe("sortedHardwareItems", () => {
	it("contains all keys from hardwareData", () => {
		const keys = Object.keys(hardwareData);
		expect(sortedHardwareItems).toHaveLength(keys.length);
		keys.forEach((key) => {
			expect(sortedHardwareItems).toContain(key);
		});
	});

	it("is sorted in ascending alphabetical order", () => {
		const manuallySorted = [...sortedHardwareItems].sort((a, b) =>
			a.localeCompare(b),
		);
		expect(sortedHardwareItems).toEqual(manuallySorted);
	});

	it("does not contain duplicate entries", () => {
		const unique = new Set(sortedHardwareItems);
		expect(unique.size).toBe(sortedHardwareItems.length);
	});
});
