import { createFileRoute } from "@tanstack/react-router";
import PlaceholderPage from "../components/PlaceholderPage";

export const Route = createFileRoute("/algorithms")({
	component: () => <PlaceholderPage title="Algorithms" icon="🔄" />,
});
