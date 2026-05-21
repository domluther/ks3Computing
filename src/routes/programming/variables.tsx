import { createFileRoute } from "@tanstack/react-router";
import VariableTracerGame from "../../components/VariableTracerGame";

export const Route = createFileRoute("/programming/variables")({
	component: VariableTracerGame,
});
