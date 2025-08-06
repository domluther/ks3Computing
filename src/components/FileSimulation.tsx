// src/pages/ITSkillsGame.tsx

import { useNavigate } from "@tanstack/react-router";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import GameButton from "./GameButton";

// --- SVG ICONS ---
const FolderIcon = ({ className }: { className?: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="currentColor"
		className={className || "w-16 h-16 text-yellow-500"}
	>
		<path d="M19.5 21a3 3 0 003-3v-9a3 3 0 00-3-3h-9.259a3 3 0 01-2.23-1.01l-.932-.99a3 3 0 00-2.23-1.01H4.5a3 3 0 00-3 3v12a3 3 0 003 3h15z" />
	</svg>
);

const FileIcon = ({ className }: { className?: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="currentColor"
		className={className || "w-16 h-16 text-gray-400"}
	>
		<path
			fillRule="evenodd"
			d="M4.5 3.75a3 3 0 00-3 3v10.5a3 3 0 003 3h15a3 3 0 003-3V9.162a3 3 0 00-.879-2.121l-3.53-3.531A3 3 0 0015.963 2.25H4.5zM15 5.625a.75.75 0 00-.75.75v2.25a.75.75 0 00.75.75h2.25a.75.75 0 000-1.5h-1.5V6.375a.75.75 0 00-.75-.75z"
			clipRule="evenodd"
		/>
	</svg>
);

const BackIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		strokeWidth={1.5}
		stroke="currentColor"
		className="w-6 h-6"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
		/>
	</svg>
);

// --- DATA STRUCTURES ---
interface FsItem {
	id: string;
	name: string;
	type: "folder" | "file";
	parentId: string | null;
}

interface Step {
	id: number;
	description: string;
	isCompleted: (
		items: Record<string, FsItem>,
		currentPathId: string,
		history: string[],
	) => boolean;
}

interface Level {
	id: number;
	title: string;
	initialItems: Record<string, FsItem>;
	steps: Step[];
}

// --- GAME LEVELS ---
const simulationLevels: Level[] = [
	{
		id: 1,
		title: "Level 1: Core Skills",
		initialItems: {
			root: { id: "root", name: "Desktop", type: "folder", parentId: null },
			docs_folder: {
				id: "docs_folder",
				name: "Documents",
				type: "folder",
				parentId: "root",
			},
			report_file: {
				id: "report_file",
				name: "IT Skills Report.docx",
				type: "file",
				parentId: "docs_folder",
			},
		},
		steps: [
			{
				id: 1,
				description:
					"First, let's navigate to the 'Documents' folder. Double-click on it.",
				isCompleted: (_, currentId) => currentId === "docs_folder",
			},
			{
				id: 2,
				description: "Great! Now, create a new folder and name it 'Computing'.",
				isCompleted: (items) =>
					Object.values(items).some(
						(i) => i.name === "Computing" && i.parentId === "docs_folder",
					),
			},
			{
				id: 3,
				description:
					"Good. Now, move the 'IT Skills Report.docx' file into the 'Computing' folder by dragging and dropping it.",
				isCompleted: (items) => {
					const computingFolder = Object.values(items).find(
						(i) => i.name === "Computing" && i.parentId === "docs_folder",
					);
					if (!computingFolder) return false;
					const report = Object.values(items).find(
						(i) => i.id === "report_file",
					);
					return report?.parentId === computingFolder.id;
				},
			},
			{
				id: 4,
				description: "Excellent. Now navigate inside the 'Computing' folder.",
				isCompleted: (items, currentId) =>
					items[currentId]?.name === "Computing",
			},
			{
				id: 5,
				description: "Create a sub-folder here called 'IT Skills'.",
				isCompleted: (items, currentId) =>
					Object.values(items).some(
						(i) => i.name === "IT Skills" && i.parentId === currentId,
					),
			},
			{
				id: 6,
				description:
					"Good. Now, rename the 'IT Skills' folder to 'Web Design'.",
				isCompleted: (items, currentId) =>
					Object.values(items).some(
						(i) => i.name === "Web Design" && i.parentId === currentId,
					),
			},
			{
				id: 7,
				description: "Perfect. Finally, delete the 'Web Design' folder.",
				isCompleted: (items) =>
					!Object.values(items).some((i) => i.name === "Web Design"),
			},
		],
	},
	{
		id: 2,
		title: "Level 2: Building a Structure",
		initialItems: {
			root: { id: "root", name: "Desktop", type: "folder", parentId: null },
			docs_folder: {
				id: "docs_folder",
				name: "Documents",
				type: "folder",
				parentId: "root",
			},
		},
		steps: [
			{
				id: 1,
				description: "Navigate into the 'Documents' folder.",
				isCompleted: (_, currentId) => currentId === "docs_folder",
			},
			{
				id: 2,
				description: "Create a new folder called 'Year 7'.",
				isCompleted: (items) =>
					Object.values(items).some(
						(i) => i.name === "Year 7" && i.parentId === "docs_folder",
					),
			},
			{
				id: 3,
				description: "Open the 'Year 7' folder.",
				isCompleted: (items, currentId) => items[currentId]?.name === "Year 7",
			},
			{
				id: 4,
				description:
					"Create two folders inside 'Year 7': 'Homework' and 'Projects'.",
				isCompleted: (items, currentId) => {
					const children = Object.values(items).filter(
						(i) => i.parentId === currentId,
					);
					return (
						children.some((c) => c.name === "Homework") &&
						children.some((c) => c.name === "Projects")
					);
				},
			},
			{
				id: 5,
				description: "Navigate into the 'Homework' folder.",
				isCompleted: (items, currentId) =>
					items[currentId]?.name === "Homework",
			},
			{
				id: 6,
				description:
					"Create three folders for your subjects: 'Maths', 'English', and 'Science'.",
				isCompleted: (items, currentId) => {
					const children = Object.values(items).filter(
						(i) => i.parentId === currentId,
					);
					return ["Maths", "English", "Science"].every((s) =>
						children.some((c) => c.name === s),
					);
				},
			},
		],
	},
	{
		id: 3,
		title: "Level 3: Organizing a Messy Folder",
		initialItems: {
			root: { id: "root", name: "Desktop", type: "folder", parentId: null },
			downloads: {
				id: "downloads",
				name: "Downloads",
				type: "folder",
				parentId: "root",
			},
			img1: {
				id: "img1",
				name: "photo_1.jpg",
				type: "file",
				parentId: "downloads",
			},
			img2: {
				id: "img2",
				name: "screenshot.png",
				type: "file",
				parentId: "downloads",
			},
			doc1: {
				id: "doc1",
				name: "essay.docx",
				type: "file",
				parentId: "downloads",
			},
			doc2: {
				id: "doc2",
				name: "notes.txt",
				type: "file",
				parentId: "downloads",
			},
			other: {
				id: "other",
				name: "archive.zip",
				type: "file",
				parentId: "downloads",
			},
		},
		steps: [
			{
				id: 1,
				description: "Open the 'Downloads' folder.",
				isCompleted: (_, currentId) => currentId === "downloads",
			},
			{
				id: 2,
				description:
					"Create three new folders: 'Pictures', 'Documents', and 'Archives'.",
				isCompleted: (items, currentId) => {
					const children = Object.values(items).filter(
						(i) => i.parentId === currentId,
					);
					return ["Pictures", "Documents", "Archives"].every((s) =>
						children.some((c) => c.name === s),
					);
				},
			},
			{
				id: 3,
				description:
					"Move the image files ('photo_1.jpg', 'screenshot.png') into the 'Pictures' folder.",
				isCompleted: (items) => {
					const picsFolder = Object.values(items).find(
						(i) => i.name === "Pictures",
					);
					if (!picsFolder) return false;
					return (
						items["img1"]?.parentId === picsFolder.id &&
						items["img2"]?.parentId === picsFolder.id
					);
				},
			},
			{
				id: 4,
				description:
					"Move the document files ('essay.docx', 'notes.txt') into the 'Documents' folder.",
				isCompleted: (items) => {
					const docsFolder = Object.values(items).find(
						(i) => i.name === "Documents",
					);
					if (!docsFolder) return false;
					return (
						items["doc1"]?.parentId === docsFolder.id &&
						items["doc2"]?.parentId === docsFolder.id
					);
				},
			},
			{
				id: 5,
				description: "Finally, move 'archive.zip' into the 'Archives' folder.",
				isCompleted: (items) => {
					const archFolder = Object.values(items).find(
						(i) => i.name === "Archives",
					);
					if (!archFolder) return false;
					return items["other"]?.parentId === archFolder.id;
				},
			},
		],
	},
	{
		id: 4,
		title: "Level 4: Sorting School Subjects",
		initialItems: {
			root: { id: "root", name: "Desktop", type: "folder", parentId: null },
			docs: { id: "docs", name: "Documents", type: "folder", parentId: "root" },
			maths_homework: {
				id: "maths_homework",
				name: "Fractions Practice.pdf",
				type: "file",
				parentId: "docs",
			},
			eng_essay: {
				id: "eng_essay",
				name: "First Day Essay.docx",
				type: "file",
				parentId: "docs",
			},
			sci_project: {
				id: "sci_project",
				name: "Volcano Presentation.pptx",
				type: "file",
				parentId: "docs",
			},
		},
		steps: [
			{
				id: 1,
				description: "Open the 'Documents' folder.",
				isCompleted: (_, currentId) => currentId === "docs",
			},
			{
				id: 2,
				description: "Create folders named 'Maths', 'English', and 'Science'.",
				isCompleted: (items, currentId) => {
					const children = Object.values(items).filter(
						(i) => i.parentId === currentId,
					);
					return ["Maths", "English", "Science"].every((name) =>
						children.some((c) => c.name === name),
					);
				},
			},
			{
				id: 3,
				description: "Move 'Fractions Practice.pdf' into the 'Maths' folder.",
				isCompleted: (items) => {
					const maths = Object.values(items).find((i) => i.name === "Maths");
					return !!(maths && items["maths_homework"].parentId === maths.id);
				},
			},
			{
				id: 4,
				description: "Move 'First Day Essay.docx' into the 'English' folder.",
				isCompleted: (items) => {
					const english = Object.values(items).find(
						(i) => i.name === "English",
					);
					return !!(english && items["eng_essay"].parentId === english.id);
				},
			},
			{
				id: 5,
				description:
					"Move 'Volcano Presentation.pptx' into the 'Science' folder.",
				isCompleted: (items) => {
					const science = Object.values(items).find(
						(i) => i.name === "Science",
					);
					return !!(science && items["sci_project"].parentId === science.id);
				},
			},
		],
	},
	{
		id: 5,
		title: "Level 5: Cleaning Up Documents",
		initialItems: {
			root: { id: "root", name: "Desktop", type: "folder", parentId: null },
			documents: {
				id: "documents",
				name: "Documents",
				type: "folder",
				parentId: "root",
			},
			downloads: {
				id: "downloads",
				name: "Downloads",
				type: "folder",
				parentId: "root",
			},
			file1: {
				id: "file1",
				name: "Times Tables Practice.docx",
				type: "file",
				parentId: "documents",
			},
			file2: {
				id: "file2",
				name: "Review.docx",
				type: "file",
				parentId: "documents",
			},
			file3: {
				id: "file3",
				name: "Silly Face.png",
				type: "file",
				parentId: "documents",
			},
			file4: {
				id: "file4",
				name: "Checklist.docx",
				type: "file",
				parentId: "documents",
			},
			file5: {
				id: "file5",
				name: "Funny Dog.jpg",
				type: "file",
				parentId: "documents",
			},
		},
		steps: [
			{
				id: 1,
				description: "Open the 'Documents' folder.",
				isCompleted: (_, currentId) => currentId === "documents",
			},
			{
				id: 2,
				description:
					"Delete the files that are not school-related: 'Silly Face.png' and 'Funny Dog.jpg'.",
				isCompleted: (items) => {
					return !items["file3"] && !items["file5"];
				},
			},
			{
				id: 3,
				description: "Create folders: 'Maths', 'English', and 'Other'.",
				isCompleted: (items, currentId) => {
					const children = Object.values(items).filter(
						(i) => i.parentId === currentId,
					);
					return ["Maths", "English", "Other"].every((name) =>
						children.some((c) => c.name === name),
					);
				},
			},
			{
				id: 4,
				description:
					"Move 'Times Tables Practice.docx' into the 'Maths' folder.",
				isCompleted: (items) => {
					const maths = Object.values(items).find((i) => i.name === "Maths");
					return !!(maths && items["file1"]?.parentId === maths.id);
				},
			},
			{
				id: 5,
				description:
					"Rename 'Review.docx' to 'Book Review.docx' and move it into the 'English' folder.",
				isCompleted: (items) => {
					const english = Object.values(items).find(
						(i) => i.name === "English",
					);
					const renamedFile = Object.values(items).find(
						(i) => i.name === "Book Review.docx",
					);
					return !!(
						english &&
						renamedFile &&
						renamedFile.parentId === english.id
					);
				},
			},
			{
				id: 6,
				description: "Move 'Checklist.docx' into the 'Other' folder.",
				isCompleted: (items) => {
					const other = Object.values(items).find((i) => i.name === "Other");
					return !!(other && items["file4"]?.parentId === other.id);
				},
			},
		],
	},
	{
		id: 6,
		title: "Level 6: Getting Ready for a Presentation",
		initialItems: {
			root: { id: "root", name: "Desktop", type: "folder", parentId: null },
			documents: {
				id: "documents",
				name: "Documents",
				type: "folder",
				parentId: "root",
			},
			desktop_file1: {
				id: "desktop_file1",
				name: "Climate Change.pptx",
				type: "file",
				parentId: "root",
			},
			desktop_file2: {
				id: "desktop_file2",
				name: "Speaker Notes.docx",
				type: "file",
				parentId: "root",
			},
			desktop_file3: {
				id: "desktop_file3",
				name: "Melting Glacier.png",
				type: "file",
				parentId: "root",
			},
		},
		steps: [
			{
				id: 1,
				description: "Move all three files into the 'Documents' folder.",
				isCompleted: (items) => {
					return ["desktop_file1", "desktop_file2", "desktop_file3"].every(
						(id) => items[id]?.parentId === "documents",
					);
				},
			},
			{
				id: 2,
				description: "Create a new folder inside 'Documents' called 'Science'.",
				isCompleted: (items) => {
					return !!Object.values(items).find(
						(i) => i.name === "Science" && i.parentId === "documents",
					);
				},
			},
			{
				id: 3,
				description: "Move all three files into the 'Science' folder.",
				isCompleted: (items) => {
					const science = Object.values(items).find(
						(i) => i.name === "Science" && i.parentId === "documents",
					);
					if (!science) return false;
					return ["desktop_file1", "desktop_file2", "desktop_file3"].every(
						(id) => items[id]?.parentId === science.id,
					);
				},
			},
			{
				id: 4,
				description: "Open the 'Science' folder.",
				isCompleted: (items, currentId) => {
					return items[currentId]?.name === "Science";
				},
			},
			{
				id: 5,
				description:
					"Create a new folder inside 'Science' called 'Climate Change'.",
				isCompleted: (items, currentId) => {
					return !!Object.values(items).find(
						(i) => i.name === "Climate Change" && i.parentId === currentId,
					);
				},
			},
			{
				id: 6,
				description: "Move all three files into the 'Climate Change' folder.",
				isCompleted: (items) => {
					const presentation = Object.values(items).find(
						(i) => i.name === "Climate Change",
					);
					if (!presentation) return false;
					return ["desktop_file1", "desktop_file2", "desktop_file3"].every(
						(id) => items[id]?.parentId === presentation.id,
					);
				},
			},
			{
				id: 7,
				description: "Open the 'Climate Change' folder.",
				isCompleted: (items, currentId) => {
					return items[currentId]?.name === "Climate Change";
				},
			},
			{
				id: 8,
				description:
					"Create a new folder inside 'Climate Change' called 'Images'.",
				isCompleted: (items, currentId) => {
					return !!Object.values(items).find(
						(i) => i.name === "Images" && i.parentId === currentId,
					);
				},
			},
			{
				id: 9,
				description: "Move 'Melting Glacier.png' into the 'Images' folder.",
				isCompleted: (items) => {
					const images = Object.values(items).find((i) => i.name === "Images");
					return !!(images && items["desktop_file3"]?.parentId === images.id);
				},
			},
		],
	},

	// More levels can be added here
];

const FileSimulation = () => {
	const navigate = useNavigate();

	// --- STATE MANAGEMENT ---
	const [levelIndex, setLevelIndex] = useState(0);
	const [stepIndex, setStepIndex] = useState(0);

	const currentLevel = simulationLevels[levelIndex];
	const currentStep = currentLevel?.steps[stepIndex];

	const [items, setItems] = useState<Record<string, FsItem>>(
		currentLevel.initialItems,
	);
	const [history, setHistory] = useState<string[]>(["root"]);
	const [isStepComplete, setIsStepComplete] = useState(false);
	const [isLevelComplete, setIsLevelComplete] = useState(false);
	const [isGameComplete, setIsGameComplete] = useState(false);

	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [renamingId, setRenamingId] = useState<string | null>(null);
	const [contextMenu, setContextMenu] = useState<{
		x: number;
		y: number;
		visible: boolean;
		targetId: string | null;
	}>({ x: 0, y: 0, visible: false, targetId: null });
	const [feedback, setFeedback] = useState<{
		message: string;
		type: "success" | "error";
	} | null>(null);
	const [isWindowOpen, setIsWindowOpen] = useState(false);

	const currentPathId = history[history.length - 1];

	// Effect to reset state when the level changes
	useEffect(() => {
		const level = simulationLevels[levelIndex];
		if (level) {
			setItems(level.initialItems);
			setStepIndex(0);
			setHistory(["root"]);
			setIsWindowOpen(false);
			setSelectedId(null);
			setRenamingId(null);
			setIsStepComplete(false);
			setIsLevelComplete(false);
			setIsGameComplete(false);
			setFeedback(null);
		}
	}, [levelIndex]);

	// Handle Enter key  when level is complete - Accidentally triggers if they press enter to name folder
	// useEffect(() => {
	//     const handleKeyDown = (e: KeyboardEvent) => {
	//         if (e.key === 'Enter' && isLevelComplete && !isGameComplete) {
	//             handleNext();
	//         }
	//         if (e.key === 'Enter' && isLevelComplete && isGameComplete) {
	//             restartGame();
	//         }
	//     };

	//     window.addEventListener('keydown', handleKeyDown);
	//     return () => window.removeEventListener('keydown', handleKeyDown);
	// }, [isLevelComplete, isGameComplete]);

	const restartLevel = () => {
		// This re-triggers the useEffect by setting the same index
		setLevelIndex(levelIndex);
		// Manually trigger if index hasn't changed (e.g. on level 0)
		const level = simulationLevels[levelIndex];
		if (level) {
			setItems(level.initialItems);
			setStepIndex(0);
			setHistory(["root"]);
			setIsWindowOpen(false);
			setSelectedId(null);
			setRenamingId(null);
			setIsStepComplete(false);
			setIsLevelComplete(false);
			setIsGameComplete(false);
			setFeedback(null);
		}
	};

	const restartGame = () => {
		setLevelIndex(0);
	};

	const checkStepCompletion = useCallback(
		(
			updatedItems: Record<string, FsItem>,
			pathId: string,
			currentHistory: string[],
		) => {
			if (!currentStep || isStepComplete || isLevelComplete || isGameComplete)
				return;

			if (currentStep.isCompleted(updatedItems, pathId, currentHistory)) {
				const isLastStep = stepIndex >= currentLevel.steps.length - 1;

				if (isLastStep) {
					// Last step of level completed
					setFeedback({
						message: `Level ${currentLevel.id} Complete!`,
						type: "success",
					});
					setIsLevelComplete(true);

					// Check if this was the last level
					if (levelIndex >= simulationLevels.length - 1) {
						setIsGameComplete(true);
					}

					// Don't auto-advance to next level - wait for manual click
					setTimeout(() => {
						setFeedback(null);
					}, 2000);
				} else {
					// Regular step completed
					setFeedback({ message: "Step Complete!", type: "success" });
					setIsStepComplete(true);

					// Auto-advance to next step after delay
					setTimeout(() => {
						setFeedback(null);
						setIsStepComplete(false);
						setStepIndex((i) => i + 1);
					}, 1500);
				}
			}
		},
		[
			currentStep,
			isStepComplete,
			isLevelComplete,
			isGameComplete,
			stepIndex,
			currentLevel,
			levelIndex,
		],
	);

	const handleNext = () => {
		// This function is used for manual progression from level complete to next level
		setIsStepComplete(false);
		setIsLevelComplete(false);
		if (levelIndex < simulationLevels.length - 1) {
			setLevelIndex((i) => i + 1);
		}
	};

	const handleDoubleClick = (itemId: string) => {
		if (renamingId) return;
		const item = items[itemId];
		if (item?.type === "folder") {
			const newHistory = [...history, itemId];
			if (history[history.length - 1] === "root") {
				setIsWindowOpen(true);
			}
			setHistory(newHistory);
			setSelectedId(null);
			checkStepCompletion(items, itemId, newHistory);
		}
	};

	const handleGoBack = () => {
		if (history.length > 2) {
			const newHistory = history.slice(0, -1);
			setHistory(newHistory);
			checkStepCompletion(items, newHistory[newHistory.length - 1], newHistory);
		} else if (history.length === 2) {
			setHistory(["root"]);
			setIsWindowOpen(false);
			checkStepCompletion(items, "root", ["root"]);
		}
	};

	const handleContainerClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		setSelectedId(null);
		if (renamingId) {
			const originalItem = items[renamingId];
			if (originalItem && originalItem.name.startsWith("New folder")) {
				const updatedItems = { ...items };
				delete updatedItems[renamingId];
				setItems(updatedItems);
			}
			setRenamingId(null);
		}
		if (contextMenu.visible) {
			setContextMenu({ ...contextMenu, visible: false });
		}
	};

	const handleRightClick = (
		e: React.MouseEvent,
		itemId: string | null = null,
	) => {
		e.preventDefault();
		e.stopPropagation();
		if (renamingId) return;
		// Take into account window scroll position
		setContextMenu({
			x: e.clientX + window.scrollX,
			y: e.clientY + window.scrollY,
			visible: true,
			targetId: itemId,
		});
		if (itemId) setSelectedId(itemId);
	};

	const handleCreateFolder = () => {
		const siblings = Object.values(items).filter(
			(i) => i.parentId === currentPathId,
		);
		const baseName = "New folder";
		let newName = baseName;
		let counter = 2;
		while (
			siblings.some((s) => s.name.toLowerCase() === newName.toLowerCase())
		) {
			newName = `${baseName} (${counter})`;
			counter++;
		}
		const newId = `item_${Date.now()}`;
		const newFolder: FsItem = {
			id: newId,
			name: newName,
			type: "folder",
			parentId: currentPathId,
		};
		const newItems = { ...items, [newId]: newFolder };
		setItems(newItems);
		setSelectedId(newId);
		setRenamingId(newId);
		setContextMenu({ ...contextMenu, visible: false });
	};

	const handleRenameStart = () => {
		if (!contextMenu.targetId) return;
		setRenamingId(contextMenu.targetId);
		setContextMenu({ ...contextMenu, visible: false });
	};

	const handleRenameCommit = (id: string, newName: string) => {
		const originalItem = items[id];
		if (!newName || newName.trim() === "") {
			setRenamingId(null);
			if (originalItem.name.startsWith("New folder")) {
				const updatedItems = { ...items };
				delete updatedItems[id];
				setItems(updatedItems);
			}
			return;
		}
		const parentId = originalItem.parentId;
		const siblings = Object.values(items).filter(
			(i) => i.parentId === parentId && i.id !== id,
		);
		if (siblings.some((s) => s.name.toLowerCase() === newName.toLowerCase())) {
			setFeedback({
				message: `An item named "${newName}" already exists.`,
				type: "error",
			});
			setTimeout(() => setFeedback(null), 3000);
			if (originalItem.name.startsWith("New folder")) {
				const updatedItems = { ...items };
				delete updatedItems[id];
				setItems(updatedItems);
			}
			setRenamingId(null);
			return;
		}
		const updatedItems = { ...items, [id]: { ...originalItem, name: newName } };
		setItems(updatedItems);
		checkStepCompletion(updatedItems, currentPathId, history);
		setRenamingId(null);
	};

	const handleDelete = () => {
		if (!contextMenu.targetId || !items[contextMenu.targetId]) return;
		const updatedItems = { ...items };
		delete updatedItems[contextMenu.targetId];
		setItems(updatedItems);
		checkStepCompletion(updatedItems, currentPathId, history);
		setContextMenu({ ...contextMenu, visible: false });
		setSelectedId(null);
	};

	const handleDragStart = (e: React.DragEvent, itemId: string) => {
		e.dataTransfer.setData("application/fs-item-id", itemId);
		e.dataTransfer.effectAllowed = "move";
	};

	const handleDrop = (e: React.DragEvent, targetFolderId: string) => {
		e.preventDefault();
		const draggedItemId = e.dataTransfer.getData("application/fs-item-id");
		if (!draggedItemId) return;
		const draggedItem = items[draggedItemId];
		const targetFolder = items[targetFolderId];
		if (
			targetFolder.type !== "folder" ||
			draggedItemId === targetFolderId ||
			draggedItem.parentId === targetFolderId
		)
			return;
		if (draggedItem.type === "folder") {
			let pId: string | null = targetFolderId;
			while (pId) {
				if (pId === draggedItemId) {
					setFeedback({
						message: "You cannot move a folder into one of its subfolders.",
						type: "error",
					});
					setTimeout(() => setFeedback(null), 3000);
					return;
				}
				pId = items[pId]?.parentId;
			}
		}
		const updatedItems = {
			...items,
			[draggedItemId]: { ...items[draggedItemId], parentId: targetFolderId },
		};
		setItems(updatedItems);
		checkStepCompletion(updatedItems, currentPathId, history);
	};

	// --- RENDER LOGIC ---
	const desktopItems = Object.values(items).filter(
		(item) => item.parentId === "root",
	);
	const windowCurrentItems = Object.values(items).filter(
		(item) => item.parentId === currentPathId,
	);
	const pathString = history.map((id) => items[id]?.name).join(" > ");

	return (
		<>
			<div className="w-full font-sans select-none">
				<div className="bg-black/50 text-white p-3 rounded-t-lg text-center relative">
					<h3 className="text-xl font-bold">
						{isGameComplete
							? "Congratulations!"
							: isLevelComplete
								? `Level ${currentLevel.id} Complete!`
								: currentLevel.title}
					</h3>
					<p className="text-lg text-yellow-300 min-h-[5rem] flex items-center justify-center px-16">
						{isGameComplete
							? "You've completed all levels! You're a folder navigation pro!"
							: isLevelComplete
								? `Great job! ${levelIndex < simulationLevels.length - 1 ? `Ready for Level ${levelIndex + 2}?` : "You completed all levels!"}`
								: `Step ${stepIndex + 1}: ${currentStep?.description}`}
					</p>
					<GameButton
						onClick={() => navigate({ to: "/it-skills" as any })}
						className="!absolute top-1/2 -translate-y-1/2 right-4 !py-2 !px-4"
					>
						Exit
					</GameButton>
				</div>

				<div
					className="w-full h-[50vh] bg-teal-600 p-4 relative"
					onClick={handleContainerClick}
					onContextMenu={(e) =>
						handleRightClick(e, currentPathId === "root" ? "root" : null)
					}
				>
					<div className="w-full h-full flex flex-wrap gap-4 content-start">
						{currentPathId === "root" &&
							!isWindowOpen &&
							desktopItems.map((item) => (
								<DesktopIcon
									key={item.id}
									item={item}
									isSelected={selectedId === item.id}
									isRenaming={renamingId === item.id}
									onClick={() => {
										if (!renamingId) setSelectedId(item.id);
									}}
									onDoubleClick={() => handleDoubleClick(item.id)}
									onContextMenu={(e) => handleRightClick(e, item.id)}
									onRenameCommit={(newName) =>
										handleRenameCommit(item.id, newName)
									}
									onItemDragStart={handleDragStart}
									onItemDrop={handleDrop}
								/>
							))}
					</div>

					{isWindowOpen && (
						<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#3a95d5] border-4 border-gray-600 rounded-lg shadow-2xl flex flex-col w-11/12 max-w-4xl h-5/6">
							<div className="flex items-center bg-gray-200 p-1 border-b-2 border-gray-300 rounded-t-md">
								<button
									onClick={handleGoBack}
									disabled={history.length <= 1}
									className="p-1 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									<BackIcon />
								</button>
								<div className="ml-2 p-1 bg-white border border-gray-400 rounded w-full text-gray-700">
									{pathString}
								</div>
							</div>
							<div
								className="p-4 flex flex-wrap gap-4 content-start flex-grow overflow-y-auto"
								onClick={handleContainerClick}
								onContextMenu={(e) => handleRightClick(e)}
							>
								{windowCurrentItems.map((item) => (
									<DesktopIcon
										key={item.id}
										item={item}
										isSelected={selectedId === item.id}
										isRenaming={renamingId === item.id}
										onClick={() => {
											if (!renamingId) setSelectedId(item.id);
										}}
										onDoubleClick={() => handleDoubleClick(item.id)}
										onContextMenu={(e) => handleRightClick(e, item.id)}
										onRenameCommit={(newName) =>
											handleRenameCommit(item.id, newName)
										}
										onItemDragStart={handleDragStart}
										onItemDrop={handleDrop}
									/>
								))}
							</div>
						</div>
					)}
				</div>

				{contextMenu.visible && (
					<div
						style={{ top: contextMenu.y, left: contextMenu.x }}
						className="absolute bg-gray-200 border border-gray-400 rounded shadow-lg py-1 w-40 z-50 text-sm"
						onClick={(e) => e.stopPropagation()}
					>
						{contextMenu.targetId && contextMenu.targetId !== "root" ? (
							<>
								<div
									onClick={handleRenameStart}
									className="px-3 py-1 hover:bg-blue-500 hover:text-white cursor-pointer"
								>
									Rename
								</div>
								<div
									onClick={handleDelete}
									className="px-3 py-1 hover:bg-blue-500 hover:text-white cursor-pointer"
								>
									Delete
								</div>
							</>
						) : (
							<div
								onClick={handleCreateFolder}
								className="px-3 py-1 hover:bg-blue-500 hover:text-white cursor-pointer"
							>
								New folder
							</div>
						)}
					</div>
				)}
			</div>
			<div className="text-center p-2 rounded-b-lg h-20 flex items-center justify-center gap-4">
				{feedback && (
					<div
						className={`p-4 rounded-lg shadow-xl text-white ${feedback.type === "success" ? "bg-green-600" : "bg-red-600"} z-50`}
					>
						{feedback.message}
					</div>
				)}
				{isLevelComplete && !isGameComplete && (
					<GameButton
						onClick={handleNext}
						className="animate-pulse !bg-green-600"
					>
						Next Level
					</GameButton>
				)}
				{!feedback && !isGameComplete && !isLevelComplete && (
					<>
						<GameButton onClick={restartLevel}>Restart Level</GameButton>
						<GameButton
							onClick={restartGame}
							className="!bg-red-600 hover:!bg-red-800"
						>
							Restart All
						</GameButton>
					</>
				)}
				{isGameComplete && (
					<GameButton
						onClick={restartGame}
						className="!bg-blue-600 hover:!bg-blue-800"
					>
						Play Again
					</GameButton>
				)}
			</div>
		</>
	);
};

// --- Helper component for desktop icons ---
const DesktopIcon = ({
	item,
	isSelected,
	isRenaming,
	onClick,
	onDoubleClick,
	onContextMenu,
	onRenameCommit,
	onItemDragStart,
	onItemDrop,
}: {
	item: FsItem;
	isSelected: boolean;
	isRenaming: boolean;
	onClick: () => void;
	onDoubleClick: () => void;
	onContextMenu: (e: React.MouseEvent) => void;
	onRenameCommit: (newName: string) => void;
	onItemDragStart: (e: React.DragEvent, itemId: string) => void;
	onItemDrop: (e: React.DragEvent, folderId: string) => void;
}) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const [isDragOver, setIsDragOver] = useState(false);
	useEffect(() => {
		if (isRenaming && inputRef.current) {
			inputRef.current.focus();
			inputRef.current.select();
		}
	}, [isRenaming]);
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();
			onRenameCommit(e.currentTarget.value);
		} else if (e.key === "Escape") {
			(e.currentTarget as HTMLInputElement).blur();
		}
	};
	const handleDragOver = (e: React.DragEvent) => {
		if (item.type === "folder") {
			e.preventDefault();
			e.dataTransfer.dropEffect = "move";
			setIsDragOver(true);
		}
	};
	const handleDragLeave = () => setIsDragOver(false);
	const handleDropInternal = (e: React.DragEvent) => {
		if (item.type === "folder") {
			onItemDrop(e, item.id);
			setIsDragOver(false);
		}
	};
	return (
		<div
			draggable={!isRenaming}
			onDragStart={(e) => onItemDragStart(e, item.id)}
			onDrop={handleDropInternal}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			className={`flex flex-col items-center justify-start w-28 h-28 p-2 rounded cursor-pointer transition-colors ${isSelected ? "bg-blue-400/50 border border-blue-500" : "hover:bg-blue-400/30"} ${isDragOver ? "!bg-blue-500/60 border-2 border-dashed border-white" : ""}`}
			onClick={(e) => {
				e.stopPropagation();
				onClick();
			}}
			onDoubleClick={onDoubleClick}
			onContextMenu={onContextMenu}
		>
			<div className="flex-shrink-0">
				{item.type === "folder" ? <FolderIcon /> : <FileIcon />}
			</div>
			<div className="flex-grow w-full flex items-center justify-center mt-1">
				{isRenaming ? (
					<input
						ref={inputRef}
						defaultValue={item.name}
						onBlur={(e) => onRenameCommit(e.target.value)}
						onKeyDown={handleKeyDown}
						onClick={(e) => e.stopPropagation()}
						onContextMenu={(e) => {
							e.stopPropagation();
							e.preventDefault();
						}}
						className="w-full text-center bg-white border border-blue-500 text-black px-1 text-sm z-10"
					/>
				) : (
					<p className="text-center text-white text-sm break-words w-full">
						{item.name}
					</p>
				)}
			</div>
		</div>
	);
};

export default FileSimulation;
