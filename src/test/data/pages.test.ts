import { getRouteByPageId, navItems, pathToPageId } from "../../data/pages";

describe("navItems", () => {
	it("contains a home entry", () => {
		const home = navItems.find((item) => item.id === "home");
		expect(home).toBeDefined();
		expect(home?.path).toBe("/");
	});

	it("all items have required fields", () => {
		navItems.forEach((item) => {
			expect(item.id).toBeTruthy();
			expect(item.title).toBeTruthy();
			expect(item.path).toBeTruthy();
			expect(typeof item.enabled).toBe("boolean");
		});
	});

	it("all paths start with /", () => {
		navItems.forEach((item) => {
			expect(item.path).toMatch(/^\//);
		});
	});

	it("has no duplicate IDs", () => {
		const ids = navItems.map((item) => item.id);
		const uniqueIds = new Set(ids);
		expect(uniqueIds.size).toBe(ids.length);
	});

	it("has no duplicate paths", () => {
		const paths = navItems.map((item) => item.path);
		const uniquePaths = new Set(paths);
		expect(uniquePaths.size).toBe(paths.length);
	});
});

describe("getRouteByPageId", () => {
	it("returns the correct path for known page IDs", () => {
		expect(getRouteByPageId("home")).toBe("/");
		expect(getRouteByPageId("hardware-software")).toBe("/hardware-software");
		expect(getRouteByPageId("online-safety")).toBe("/online-safety");
		expect(getRouteByPageId("maths")).toBe("/maths");
		expect(getRouteByPageId("programming")).toBe("/programming");
		expect(getRouteByPageId("it-skills")).toBe("/it-skills");
	});

	it("returns '/' as a fallback for unknown page IDs", () => {
		expect(getRouteByPageId("unknown-page")).toBe("/");
		expect(getRouteByPageId("")).toBe("/");
	});
});

describe("pathToPageId", () => {
	it("returns the correct ID for known paths", () => {
		expect(pathToPageId("/")).toBe("home");
		expect(pathToPageId("/hardware-software")).toBe("hardware-software");
		expect(pathToPageId("/online-safety")).toBe("online-safety");
		expect(pathToPageId("/maths")).toBe("maths");
		expect(pathToPageId("/programming")).toBe("programming");
		expect(pathToPageId("/it-skills")).toBe("it-skills");
	});

	it("matches sub-paths to the parent page ID", () => {
		expect(pathToPageId("/hardware-software/input-output")).toBe(
			"hardware-software",
		);
		expect(pathToPageId("/programming/turtle")).toBe("programming");
		expect(pathToPageId("/online-safety/phishing")).toBe("online-safety");
	});

	it("returns 'home' as a fallback for unknown paths", () => {
		expect(pathToPageId("/unknown-route")).toBe("home");
	});
});
