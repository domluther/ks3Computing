import { createFileRoute } from "@tanstack/react-router";
import HubLayout from "../components/HubLayout";

function MathsLayout() {
	const buttons = [
		{
			text: "Binary numbers",
			route: "/maths/binary-denary",
			color: "green" as const,
		},
		{
			text: "Characters",
			route: "/maths/ascii",
			color: "blue" as const,
		},
		{
			text: "Binary images",
			route: "/maths/binary-image",
			color: "purple" as const,
		},
	];

	return (
		<HubLayout
			basePath="/maths"
			title="Computing Maths Hub"
			description="Learn how computers represent data with binary. Understand how numbers, text, and images can be represented with just 0s and 1s."
			buttons={buttons}
		/>
	);
}

export const Route = createFileRoute("/maths")({
	component: MathsLayout,
});
