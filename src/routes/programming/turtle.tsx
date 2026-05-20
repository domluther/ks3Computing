import { createFileRoute } from "@tanstack/react-router";
import PythonTurtleTool from "../../components/PythonTurtleTool";

export const Route = createFileRoute("/programming/turtle")({
	component: PythonTurtleTool,
});
