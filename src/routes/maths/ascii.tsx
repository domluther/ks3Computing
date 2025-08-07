import { createFileRoute } from "@tanstack/react-router";
import ASCIIBinaryTool from "../../components/ASCIIBinaryTool";

export const Route = createFileRoute("/maths/ascii")({
	component: ASCIIBinaryTool,
});
