import { createFileRoute } from "@tanstack/react-router";
import SoundSamplingTool from "../../components/SoundSamplingTool";

export const Route = createFileRoute("/maths/sound")({
	component: SoundSamplingTool,
});
