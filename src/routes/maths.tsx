import { createFileRoute } from "@tanstack/react-router";
import HubLayout from "../components/HubLayout";

function MathsLayout() {
	const buttons = [
		{
			text: "ASCII",
			route: "/maths/ascii",
			color: "blue" as const,
		},
		{
			text: "Binary Images",
			route: "/maths/binary-image",
			color: "purple" as const,
		},
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
