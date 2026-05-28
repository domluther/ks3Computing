import { createFileRoute } from "@tanstack/react-router";
import BinaryDenaryTool from "../../components/BinaryDenaryTool";

export const Route = createFileRoute("/maths/binary-denary")({
	component: BinaryDenaryTool,
});
