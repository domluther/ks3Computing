import type { PageDescription } from "../types/types";

export const navItems: PageDescription[] = [
	{
		id: "home",
		emoji: "🏠",
		title: "Home",
		description: "Welcome to KS3 Computing",
		path: "/",
		enabled: true,
	},
	{
		id: "it-skills",
		emoji: "🖱️",
		title: "IT Skills",
		description: "Practice essential computer skills",
		path: "/it-skills",
		enabled: true,
	},
	{
		id: "hardware-software",
		emoji: "🖥️",
		title: "Hardware & Software",
		description: "Explore hardware, software, and input/output",
		path: "/hardware-software",
		enabled: true,
	},
	{
		id: "online-safety",
		emoji: "🌐",
		title: "Online Safety",
		description: "Stay safe and smart online",
		path: "/online-safety",
		enabled: true,
	},
	{
		id: "maths",
		emoji: "🧮",
		title: "Maths",
		description: "Learn how computers represent data",
		path: "/maths",
		enabled: true,
	},
	{
		id: "programming",
		emoji: "💻",
		title: "Programming",
		description: "Learn to code with Python",
		path: "/programming",
		enabled: true,
	},
];

export const getRouteByPageId = (pageId: string): string => {
	const item = navItems.find((navItem) => navItem.id === pageId);
	return item?.path ?? "/";
};

export const pathToPageId = (pathname: string): string => {
	const match = navItems.find((item) =>
		item.path === "/" ? pathname === "/" : pathname.startsWith(item.path),
	);
	return match?.id ?? "home";
};
