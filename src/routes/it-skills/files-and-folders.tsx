import { createFileRoute } from "@tanstack/react-router";
import FilesAndFolders from "../../components/FilesAndFolders";

export const Route = createFileRoute("/it-skills/files-and-folders")({
	component: FilesAndFolders,
});
