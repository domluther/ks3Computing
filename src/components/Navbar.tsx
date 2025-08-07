import { useLocation, useNavigate } from "@tanstack/react-router";
import type React from "react";
import { getRouteByPageId, navItems, pathToPageId } from "../data/pages";

const Navbar: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const currentPageId = pathToPageId(location.pathname);

	return (
		<nav className="bg-slate-800 flex justify-center flex-wrap">
			{navItems.map((item) => (
				<button
					key={item.id}
					onClick={() => navigate({ to: getRouteByPageId(item.id) })}
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
