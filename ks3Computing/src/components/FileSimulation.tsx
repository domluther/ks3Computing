// --- Helper component for desktop icons ---
// src/pages/ITSkillsGame.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import GameButton from '../components/GameButton';

// --- SVG ICONS ---
// Using inline SVGs to keep this component self-contained.

const FolderIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-16 h-16 text-yellow-500"}>
    <path d="M19.5 21a3 3 0 003-3v-9a3 3 0 00-3-3h-9.259a3 3 0 01-2.23-1.01l-.932-.99a3 3 0 00-2.23-1.01H4.5a3 3 0 00-3 3v12a3 3 0 003 3h15z" />
  </svg>
);

const FileIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-16 h-16 text-gray-400"}>
    <path fillRule="evenodd" d="M4.5 3.75a3 3 0 00-3 3v10.5a3 3 0 003 3h15a3 3 0 003-3V9.162a3 3 0 00-.879-2.121l-3.53-3.531A3 3 0 0015.963 2.25H4.5zM15 5.625a.75.75 0 00-.75.75v2.25a.75.75 0 00.75.75h2.25a.75.75 0 000-1.5h-1.5V6.375a.75.75 0 00-.75-.75z" clipRule="evenodd" />
  </svg>
);

const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
);

// For the File Simulation
interface FsItem {
    id: string;
    name: string;
    type: 'folder' | 'file';
    parentId: string | null;
}

interface Task {
    id: number;
    description: string;
    type: 'CREATE_FOLDER' | 'RENAME_FOLDER' | 'DELETE_FOLDER' | 'NAVIGATE' | 'MOVE_FILE';
    targetName?: string;
    originalName?: string;
    parentId?: string;
    isCompleted: (items: Record<string, FsItem>, currentPathId: string) => boolean;
}

const FileSimulation = ({ onExit }: { onExit: () => void }) => {
    // --- INITIAL STATE & DATA ---
    const initialItems: Record<string, FsItem> = {
        'root': { id: 'root', name: 'Desktop', type: 'folder', parentId: null },
        'docs': { id: 'docs', name: 'Documents', type: 'folder', parentId: 'root' },
        'report': { id: 'report', name: 'IT Skills Report.docx', type: 'file', parentId: 'docs' },
    };

    const simulationTasks: Task[] = [
        { id: 1, description: "First, let's navigate to the 'Documents' folder. Double-click on it.", type: 'NAVIGATE', parentId: 'root', isCompleted: (_, currentId) => currentId === 'docs' },
        { id: 2, description: "Great! Now, create a new folder and name it 'Computing'.", type: 'CREATE_FOLDER', targetName: 'Computing', parentId: 'docs', isCompleted: (items) => Object.values(items).some(i => i.name === 'Computing' && i.parentId === 'docs') },
        { id: 3, description: "Good. Now, move the 'IT Skills Report.docx' file into the 'Computing' folder by dragging and dropping it.", type: 'MOVE_FILE', targetName: 'IT Skills Report.docx', isCompleted: (items) => {
            const computingFolder = Object.values(items).find(i => i.name === 'Computing' && i.parentId === 'docs');
            if (!computingFolder) return false;
            const report = Object.values(items).find(i => i.name === 'IT Skills Report.docx');
            return report?.parentId === computingFolder.id;
        }},
        { id: 4, description: "Excellent. Now navigate inside the 'Computing' folder.", type: 'NAVIGATE', targetName: 'Computing', isCompleted: (items, currentId) => items[currentId]?.name === 'Computing' },
        { id: 5, description: "Create a sub-folder here called 'IT Skills'.", type: 'CREATE_FOLDER', targetName: 'IT Skills', isCompleted: (items, currentId) => Object.values(items).some(i => i.name === 'IT Skills' && i.parentId === currentId) },
        { id: 6, description: "Good. Now, rename the 'IT Skills' folder to 'Web Design'.", type: 'RENAME_FOLDER', originalName: 'IT Skills', targetName: 'Web Design', isCompleted: (items) => {
            const computingFolder = Object.values(items).find(i => i.name === 'Computing' && i.parentId === 'docs');
            if (!computingFolder) return false;
            const webDesignFolder = Object.values(items).find(i => i.name === 'Web Design');
            return webDesignFolder?.parentId === computingFolder.id;
        }},
        { id: 7, description: "Perfect. Finally, delete the 'Web Design' folder.", type: 'DELETE_FOLDER', targetName: 'Web Design', isCompleted: (items) => !Object.values(items).some(i => i.name === 'Web Design') },
    ];

    // --- STATE MANAGEMENT ---
    const [items, setItems] = useState<Record<string, FsItem>>(initialItems);
    const [history, setHistory] = useState<string[]>(['root']);
    const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [renamingId, setRenamingId] = useState<string | null>(null);
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, visible: boolean, targetId: string | null }>({ x: 0, y: 0, visible: false, targetId: null });
    const [feedback, setFeedback] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    const currentPathId = history[history.length - 1];
    const currentTask = simulationTasks[currentTaskIndex];
    
    const resetGame = () => {
        setItems(initialItems);
        setHistory(['root']);
        setCurrentTaskIndex(0);
        setSelectedId(null);
        setRenamingId(null);
        setContextMenu({ x: 0, y: 0, visible: false, targetId: null });
        setFeedback(null);
    };
    
    // --- UTILITY & EVENT HANDLERS ---
    const checkTaskCompletion = useCallback((updatedItems: Record<string, FsItem>, pathId: string) => {
        if (!currentTask) return;
        if (currentTask.isCompleted(updatedItems, pathId)) {
            setFeedback({ message: "Correct!", type: 'success' });
            setTimeout(() => {
                setCurrentTaskIndex(i => i + 1);
                setFeedback(null);
            }, 1200);
        }
    }, [currentTask, setCurrentTaskIndex, setFeedback]);

    const handleDoubleClick = (itemId: string) => {
        if (renamingId) return;
        if (items[itemId]?.type === 'folder') {
            const newHistory = [...history, itemId];
            setHistory(newHistory);
            setSelectedId(null);
            checkTaskCompletion(items, itemId);
        }
    };

    const handleGoBack = () => {
        if (history.length > 1) {
            const newHistory = history.slice(0, -1);
            setHistory(newHistory);
            checkTaskCompletion(items, newHistory[newHistory.length - 1]);
        }
    };
    
    const handleContainerClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedId(null);
        if (renamingId) {
            setRenamingId(null);
        }
        if (contextMenu.visible) {
            setContextMenu({ ...contextMenu, visible: false });
        }
    };

    const handleRightClick = (e: React.MouseEvent, itemId: string | null = null) => {
        e.preventDefault();
        e.stopPropagation();
        if (renamingId) return;
        setContextMenu({ x: e.clientX, y: e.clientY, visible: true, targetId: itemId });
        if(itemId) setSelectedId(itemId);
    };

    const handleCreateFolder = () => {
        const newId = `item_${Date.now()}`;
        const newFolder: FsItem = { id: newId, name: 'New folder', type: 'folder', parentId: currentPathId };
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
        if (!newName || newName.trim() === '' || newName === originalItem.name) {
            setRenamingId(null);
            if (originalItem.name === 'New folder') {
                const updatedItems = { ...items };
                delete updatedItems[id];
                setItems(updatedItems);
            }
            return;
        }

        const updatedItems = { ...items, [id]: { ...originalItem, name: newName } };
        setItems(updatedItems);
        checkTaskCompletion(updatedItems, currentPathId);
        setRenamingId(null);
    };
    
    const handleDelete = () => {
        if (!contextMenu.targetId || !items[contextMenu.targetId]) return;
        if (contextMenu.targetId === 'report') {
            setContextMenu({ ...contextMenu, visible: false });
            return;
        }
        
        const updatedItems = { ...items };
        delete updatedItems[contextMenu.targetId];
        setItems(updatedItems);
        checkTaskCompletion(updatedItems, currentPathId);
        setContextMenu({ ...contextMenu, visible: false });
        setSelectedId(null);
    };

    // --- DRAG AND DROP HANDLERS ---
    const handleDragStart = (e: React.DragEvent, itemId: string) => {
        console.log(`DEBUG: Drag Start on item: ${itemId}`);
        e.dataTransfer.setData("application/fs-item-id", itemId);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDrop = (e: React.DragEvent, targetFolderId: string) => {
        e.preventDefault();
        const draggedItemId = e.dataTransfer.getData("application/fs-item-id");
        console.log(`DEBUG: Drop event on folder ${targetFolderId}, dragged item ID: ${draggedItemId}`);

        if (!draggedItemId) return;

        const draggedItem = items[draggedItemId];
        const targetFolder = items[targetFolderId];

        // Prevent invalid drop operations
        if (
            targetFolder.type !== 'folder' || // Can't drop on a file
            draggedItemId === targetFolderId || // Can't drop on itself
            draggedItem.parentId === targetFolderId // Can't drop in the same folder
        ) {
            return;
        }

        // Prevent dropping a parent folder into one of its own children/descendants
        if (draggedItem.type === 'folder') {
            let pId: string | null = targetFolderId;
            while (pId) {
                if (pId === draggedItemId) {
                    console.error("DEBUG: Cannot drop a folder into its own descendant.");
                    setFeedback({ message: "You cannot move a folder into one of its subfolders.", type: 'error' });
                    setTimeout(() => setFeedback(null), 3000);
                    return;
                }
                pId = items[pId]?.parentId;
            }
        }

        console.log(`DEBUG: Moving item ${draggedItemId} to folder ${targetFolderId}`);
        const updatedItems = {
            ...items,
            [draggedItemId]: { ...items[draggedItemId], parentId: targetFolderId }
        };
        setItems(updatedItems);
        checkTaskCompletion(updatedItems, currentPathId);
    };

    // --- RENDER LOGIC ---
    const currentItems = Object.values(items).filter(item => item.parentId === currentPathId);
    const pathString = history.map(id => items[id]?.name).join(' > ');

    return (
        <>
        <div className="w-full h-[80vh] bg-teal-600 flex flex-col font-sans select-none p-4" onClick={handleContainerClick}>
            <div className="bg-black/50 text-white p-3 rounded-t-lg text-center">
                <h3 className="text-xl font-bold">File & Folder Simulation</h3>
                <p className="text-lg text-yellow-300 min-h-[2.5rem]">
                    {currentTask ? `Task ${currentTask.id}: ${currentTask.description}` : "🎉 All tasks completed! Well done!"}
                </p>
            </div>

            <div className="flex-grow bg-[#3a95d5] border-x-4 border-b-4 border-gray-600 rounded-b-lg shadow-2xl flex flex-col" onContextMenu={(e) => handleRightClick(e)}>
                <div className="flex items-center bg-gray-200 p-1 border-b-2 border-gray-300">
                    <button onClick={handleGoBack} disabled={history.length <= 1} className="p-1 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
                        <BackIcon />
                    </button>
                    <div className="ml-2 p-1 bg-white border border-gray-400 rounded w-full text-gray-700">{pathString}</div>
                </div>

                <div className="p-4 flex flex-wrap gap-4 content-start flex-grow">
                    {currentItems.map(item => (
                        <DesktopIcon
                            key={item.id}
                            item={item}
                            isSelected={selectedId === item.id}
                            isRenaming={renamingId === item.id}
                            onClick={() => { if(!renamingId) setSelectedId(item.id) }}
                            onDoubleClick={() => handleDoubleClick(item.id)}
                            onContextMenu={(e) => handleRightClick(e, item.id)}
                            onRenameCommit={(newName) => handleRenameCommit(item.id, newName)}
                            onRenameCancel={() => setRenamingId(null)}
                            onItemDragStart={handleDragStart}
                            onItemDrop={handleDrop}
                        />
                    ))}
                </div>
            </div>

            {contextMenu.visible && (
                <div 
                    style={{ top: contextMenu.y, left: contextMenu.x }} 
                    className="absolute bg-gray-200 border border-gray-400 rounded shadow-lg py-1 w-40 z-50 text-sm"
                    onClick={(e) => e.stopPropagation()}
                >
                    {contextMenu.targetId ? (
                        <>
                            {contextMenu.targetId !== 'report' && (
                                <div onClick={handleRenameStart} className="px-3 py-1 hover:bg-blue-500 hover:text-white cursor-pointer">Rename</div>
                            )}
                            {contextMenu.targetId !== 'report' && (
                                <div onClick={handleDelete} className="px-3 py-1 hover:bg-blue-500 hover:text-white cursor-pointer">Delete</div>
                            )}
                            {contextMenu.targetId === 'report' && (
                                <div className="px-3 py-1 text-gray-400 cursor-not-allowed">System File</div>
                            )}
                        </>
                    ) : (
                         <div onClick={handleCreateFolder} className="px-3 py-1 hover:bg-blue-500 hover:text-white cursor-pointer">New folder</div>
                    )}
                </div>
            )}
            
            {feedback && (
                <div className={`absolute bottom-5 right-5 p-4 rounded-lg shadow-xl text-white ${feedback.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
                    {feedback.message}
                </div>
            )}

            <GameButton onClick={onExit} className="!absolute top-6 right-6 !py-2 !px-4">Exit Simulation</GameButton>
        </div>
        <div>
            <GameButton onClick={resetGame} className="mt-4">Restart Game</GameButton>
        </div>
        </>
    );
};

// --- Helper component for desktop icons ---
const DesktopIcon = ({ item, isSelected, isRenaming, onClick, onDoubleClick, onContextMenu, onRenameCommit, onRenameCancel, onItemDragStart, onItemDrop }: {
    item: FsItem,
    isSelected: boolean,
    isRenaming: boolean,
    onClick: () => void,
    onDoubleClick: () => void,
    onContextMenu: (e: React.MouseEvent) => void,
    onRenameCommit: (newName: string) => void,
    onRenameCancel: () => void,
    onItemDragStart: (e: React.DragEvent, itemId: string) => void,
    onItemDrop: (e: React.DragEvent, folderId: string) => void,
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
        if (e.key === 'Enter') onRenameCommit(e.currentTarget.value);
        else if (e.key === 'Escape') onRenameCancel();
    };

    // --- Drag and Drop handlers for the icon ---
    const handleDragOver = (e: React.DragEvent) => {
        if (item.type === 'folder') {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
            setIsDragOver(true);
        }
    };

    const handleDragLeave = (e: React.DragEvent) => {
        setIsDragOver(false);
    };

    const handleDropInternal = (e: React.DragEvent) => {
        if (item.type === 'folder') {
            onItemDrop(e, item.id);
            setIsDragOver(false);
        }
    };

    return (
        <div
            draggable={true}
            onDragStart={(e) => onItemDragStart(e, item.id)}
            onDrop={handleDropInternal}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`flex flex-col items-center justify-start w-28 h-28 p-2 rounded cursor-pointer transition-colors
                ${isSelected ? 'bg-blue-400/50 border border-blue-500' : 'hover:bg-blue-400/30'}
                ${isDragOver ? '!bg-blue-500/60 border-2 border-dashed border-white' : ''}`}
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            onDoubleClick={onDoubleClick}
            onContextMenu={onContextMenu}
        >
            <div className="flex-shrink-0">
                {item.type === 'folder' ? <FolderIcon /> : <FileIcon />}
            </div>
            <div className="flex-grow w-full flex items-center justify-center mt-1">
                {isRenaming ? (
                    <input
                        ref={inputRef}
                        defaultValue={item.name}
                        onBlur={(e) => onRenameCommit(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onClick={(e) => e.stopPropagation()}
                        onContextMenu={(e) => { e.stopPropagation(); e.preventDefault(); }}
                        className="w-full text-center bg-white border border-blue-500 text-black px-1 text-sm"
                    />
                ) : (
                    <p className="text-center text-white text-sm break-words w-full">{item.name}</p>
                )}
            </div>
        </div>
    );
};

export default FileSimulation;
