import { createFileRoute } from "@tanstack/react-router";
import BinaryImageTool from "../../components/BinaryImageTool";

export const Route = createFileRoute("/maths/binary-image")({
	component: BinaryImageTool,
});
