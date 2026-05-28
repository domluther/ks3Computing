import { createFileRoute } from "@tanstack/react-router";
import HubLayout from "../components/HubLayout";

function ProgrammingLayout() {
	const buttons = [
		{
			text: "Python Turtle",
			route: "/programming/turtle",
			color: "green" as const,
		},
		{
			text: "Variable Tracer",
			route: "/programming/variables",
			color: "purple" as const,
		},
	];

	return (
		<HubLayout
			basePath="/programming"
			title="Programming Hub"
			description="Learn to program with Python. Use Python Turtle to create drawings and animations with code."
			buttons={buttons}
		/>
	);
}

export const Route = createFileRoute("/programming")({
	component: ProgrammingLayout,
});
