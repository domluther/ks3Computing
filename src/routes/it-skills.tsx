import { createFileRoute } from "@tanstack/react-router";
import HubLayout from "../components/HubLayout";

function ITSkillsLayout() {
	return (
		<HubLayout
			basePath="/it-skills"
			title="IT Skills Hub"
			description="Practice essential computer skills through hands-on activities. Master mouse control and file management!"
			buttons={[
				{
					text: "Mouse Skills Challenge",
					route: "/it-skills/mouse-skills",
					color: "blue",
				},
				{
					text: "Files & Folders",
					route: "/it-skills/files-and-folders",
					color: "green",
				},
			]}
		/>
	);
}

export const Route = createFileRoute("/it-skills")({
	component: ITSkillsLayout,
});
