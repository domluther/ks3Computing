import { createFileRoute } from "@tanstack/react-router";
import InputOutputTool from "../../components/InputOutputTool";

export const Route = createFileRoute("/hardware-software/input-output")({
	component: InputOutputTool,
});
