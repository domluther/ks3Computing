import { createFileRoute } from "@tanstack/react-router";
import HubLayout from "../components/HubLayout";

function OnlineSafetyLayout() {
	return (
		<HubLayout
			basePath="/online-safety"
			title="Online Safety Hub"
			description="Staying safe online is a vital skill. These activities will help you think critically about your digital footprint and online interactions."
			buttons={[
				{
					text: "The Social Credit Game",
					route: "/online-safety/social-credit",
					color: "red",
				},
				{
					text: "Spot the Phish!",
					route: "/online-safety/phishing",
					color: "orange",
				},
			]}
		/>
	);
}

export const Route = createFileRoute("/online-safety")({
	component: OnlineSafetyLayout,
});
