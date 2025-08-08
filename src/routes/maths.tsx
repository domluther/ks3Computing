import { createFileRoute } from "@tanstack/react-router";
import HubLayout from "../components/HubLayout";

function MathsLayout() {
	const buttons = [
		{
			text: "ASCII",
			route: "/maths/ascii",
			color: "blue" as const,
		},
		// Commented out until implementation
		// {
		// 	text: "File Simulation",
		// 	route: "/maths/file-simulation",
		// 	color: "green" as const,
		// },
	];

	return (
		<HubLayout
			basePath="/maths"
			title="Computing Maths Hub"
			description="Learn how computers represent data. Discover how to decode ASCII and understand how computers represent text!"
			buttons={buttons}
		/>
	);
}

export const Route = createFileRoute("/maths")({
	component: MathsLayout,
});
