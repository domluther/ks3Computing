import { createFileRoute } from "@tanstack/react-router";
import SoftwareIdentificationGame from '../../components/SoftwareIdentificationGame';

export const Route = createFileRoute("/hardware-software/identify-software")({
	component: SoftwareIdentificationGame,
});
