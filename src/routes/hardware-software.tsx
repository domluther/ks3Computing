import { createFileRoute } from "@tanstack/react-router";
import HubLayout from "../components/HubLayout";

function HardwareSoftwareLayout() {
	return (
		<HubLayout
			basePath="/hardware-software"
			title="Hardware & Software Hub"
			description="Learn all about hardware & software. What is a computer? What types of hardware are there?"
			buttons={[
				{
					text: "Name that hardware",
					route: "/hardware-software/name-hardware",
					color: "green",
				},
				{
					text: "Input Output Challenge",
					route: "/hardware-software/input-output",
					color: "blue",
				},
			]}
		/>
	);
}

export const Route = createFileRoute("/hardware-software")({
	component: HardwareSoftwareLayout,
});
