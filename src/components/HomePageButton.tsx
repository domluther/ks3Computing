import type { UseNavigateResult } from "@tanstack/react-router";
import type React from "react";
import { getRouteByPageId } from "../data/pages";
import type { PageDescription } from "../types/types";

type Props = {
	navItem: PageDescription;
	navigate: UseNavigateResult<string>;
};

const HomePageButton: React.FC<Props> = ({ navItem, navigate }) => {
	const isEnabled = navItem.enabled;

	const baseClasses =
		"text-white p-6 rounded-xl shadow-lg transition-transform";
	const enabledClasses =
		"bg-gradient-to-br from-green-500 to-emerald-600 cursor-pointer transform hover:-translate-y-1";
	const disabledClasses =
		"bg-gradient-to-br from-slate-600 to-slate-800 cursor-not-allowed";

	return (
		<button
			key={navItem.id}
			className={`${baseClasses} ${
				isEnabled ? enabledClasses : disabledClasses
			}`}
			onClick={
				isEnabled
					? () => navigate({ to: getRouteByPageId(navItem.id) })
					: undefined
			}
			disabled={!isEnabled}
			type="button"
		>
			<h3 className="text-2xl font-bold mb-2">
				{navItem.emoji} {navItem.title}
			</h3>
			<p>{navItem.description}</p>
		</button>
	);
};

export default HomePageButton;
