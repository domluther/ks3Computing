import { createFileRoute } from "@tanstack/react-router";
import NameHardware from "../../components/NameHardware";

export const Route = createFileRoute("/hardware-software/name-hardware")({
	component: NameHardware,
});
