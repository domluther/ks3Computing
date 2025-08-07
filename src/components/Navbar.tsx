import { useLocation, useNavigate } from "@tanstack/react-router";
import type React from "react";
import { navItems } from "../data/pages";

// Map page IDs to routes
const pageToRoute = (pageId: string): string => {
	switch (pageId) {
		case "home":
			return "/";
		case "hardware-software":
			return "/hardware-software";
		case "online-safety":
			return "/online-safety";
		case "algorithms":
			return "/algorithms";
		case "it-skills":
			return "/it-skills";
		default:
			return "/";
	}
};

// Map current pathname to page ID for active state
const pathToPageId = (pathname: string): string => {
	if (pathname === "/") return "home";
	if (pathname === "/hardware-software") return "hardware-software";
	if (pathname.startsWith("/online-safety")) return "online-safety";
	if (pathname === "/algorithms") return "algorithms";
	if (pathname.startsWith("/it-skills")) return "it-skills";
	return "home";
};

const Navbar: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const currentPageId = pathToPageId(location.pathname);

	return (
		<nav className="bg-slate-800 flex justify-center flex-wrap">
			{navItems.map((item) => (
				<button
					key={item.id}
					onClick={() => navigate({ to: pageToRoute(item.id) })}
					className={`flex-1 min-w-[150px] p-4 text-white font-semibold text-lg cursor-pointer transition-all duration-300
                        ${currentPageId === item.id ? "bg-red-500" : "bg-slate-700 hover:bg-blue-600"}`}
					type="button"
				>
					{item.title}
				</button>
			))}
		</nav>
	);
};

export default Navbar;
