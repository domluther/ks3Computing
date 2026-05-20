import type { PageDescription } from "../types/types";

export const navItems: PageDescription[] = [
	{
		id: "home",
		emoji: "",
		title: "Home",
		description: "Welcome to KS3 Computing",
		path: "/",
		enabled: true,
	},
	{
		id: "it-skills",
		emoji: "🖱️",
		title: "IT Skills",
		description: "Practice mouse & folder skills",
		path: "/it-skills",
		enabled: true,
	},
	{
		id: "hardware-software",
		emoji: "🖥️",
		title: "Hardware & Software",
		description: "Categorize hardware with a Venn diagram",
		path: "/hardware-software",
		enabled: true,
	},
	{
		id: "online-safety",
		emoji: "🌐",
		title: "Online Safety",
		description: "Learn about staying safe online",
		path: "/online-safety",
		enabled: true,
	},
	{
		id: "maths",
		emoji: "🧮",
		title: "Maths",
		description: "Understand basic Computing Maths",
		path: "/maths",
		enabled: true,
	},
	{
		id: "programming",
		emoji: "💻",
		title: "Programming",
		description: "Learn programming with Python",
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
