import React, { useState, useEffect, useCallback } from 'react';
import type { UserAnswers } from '../types/types';
import { hardwareData, sortedHardwareItems } from '../data/hardwareData';

const InputOutputTool: React.FC = () => {
    // State management using React Hooks
    const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
    const [isMarked, setIsMarked] = useState(false);
    const [showAnswers, setShowAnswers] = useState(false);
    const [draggedItem, setDraggedItem] = useState<string | null>(null);

    const placedItems = Object.keys(userAnswers);
    const availableItems = sortedHardwareItems.filter(item => !placedItems.includes(item));

    // Drag and Drop Handlers
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: string) => {
        setDraggedItem(item);
        e.dataTransfer.setData('text/plain', item);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, category: 'input' | 'output' | 'both') => {
        e.preventDefault();
        const item = e.dataTransfer.getData('text/plain');
        setUserAnswers(prev => ({ ...prev, [item]: category }));
        setIsMarked(false); // Reset marking when an item is moved
        e.currentTarget.classList.remove('bg-blue-100');
    };
    
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.currentTarget.classList.add('bg-blue-100');
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.currentTarget.classList.remove('bg-blue-100');
    };

    const handleDragEnd = () => {
        setDraggedItem(null);
    };
    
    // Function to return an item to the list
    const returnItemToList = (item: string) => {
        const newAnswers = { ...userAnswers };
        delete newAnswers[item];
        setUserAnswers(newAnswers);
        setIsMarked(false);
    };

    // Marking logic
    const handleMarkWork = () => {
        setIsMarked(true);
    };

    // Reset logic
    const resetAll = useCallback(() => {
        setUserAnswers({});
        setIsMarked(false);
        setShowAnswers(false);
    }, []);

    // Effect to reset the tool when the component is unmounted (user navigates away)
    useEffect(() => {
        return () => resetAll();
    }, [resetAll]);

    let score = 0;
    if (isMarked) {
        Object.keys(userAnswers).forEach(item => {
            if (hardwareData[item] === userAnswers[item]) {
                score++;
            }
        });
    }
    
    // Helper to get styling for placed items
    const getItemClasses = (item: string) => {
        const baseClass = 'bg-green-500 text-white py-2 px-4 rounded-full cursor-pointer transition-all';
        if (isMarked && showAnswers) {
            const isCorrect = hardwareData[item] === userAnswers[item];
            return `${baseClass} ${isCorrect ? 'ring-2 ring-offset-2 ring-green-500' : 'bg-red-500 ring-2 ring-offset-2 ring-red-500'}`;
        }
        return baseClass;
    };

    return (
        <div className="flex flex-col md:flex-row min-h-[70vh]">
            {/* Sidebar */}
            <aside className="w-full md:w-1/4 bg-slate-100 p-4 border-r-2 border-slate-200">
                <h3 className="text-xl font-bold text-center mb-4">Hardware Items</h3>
                <div className="space-y-3">
                    {availableItems.map(item => (
                        <div
                            key={item}
                            draggable
                            onDragStart={(e) => handleDragStart(e, item)}
                            className={`p-3 rounded-lg shadow cursor-grab active:cursor-grabbing text-white font-semibold text-center bg-gradient-to-r from-blue-500 to-cyan-500 ${draggedItem === item ? 'opacity-50' : ''}`}
                        >
                            {item}
                        </div>
                    ))}
                </div>
            </aside>
            
            {/* Main Diagram Area */}
            <main className="flex-1 p-6 flex flex-col items-center">
                <div className="relative w-full max-w-4xl h-[450px] mb-6">
                    {/* Venn Diagram Circles */}
                    <div className="absolute top-0 left-[10%] w-[55%] h-[90%] border-4 border-red-400 rounded-full bg-red-100/50">
                       <span className="absolute top-4 left-1/4 text-red-600 font-bold text-xl">INPUT</span>
                    </div>
                    <div className="absolute top-0 right-[10%] w-[55%] h-[90%] border-4 border-blue-400 rounded-full bg-blue-100/50">
                       <span className="absolute top-4 right-1/4 text-blue-600 font-bold text-xl">OUTPUT</span>
                    </div>

                    {/* Drop Zones */}
                    <div onDrop={(e) => handleDrop(e, 'input')} onDragOver={handleDragOver} onDragLeave={handleDragLeave} className="absolute top-[15%] left-[12%] w-[25%] h-[60%] rounded-full flex flex-wrap gap-2 p-2 justify-center content-start transition-colors">
                    {placedItems.filter(item => userAnswers[item] === 'input').map(item => (
                        <div
                            key={item}
                            draggable
                            onDragStart={(e) => handleDragStart(e, item)}
                            onDragEnd={handleDragEnd}
                            onClick={() => returnItemToList(item)}
                            className={`${getItemClasses(item)} cursor-grab active:cursor-grabbing`}
                        >
                            {item}
                        </div>
                    ))}
                    </div>
                    <div onDrop={(e) => handleDrop(e, 'output')} onDragOver={handleDragOver} onDragLeave={handleDragLeave} className="absolute top-[15%] right-[12%] w-[25%] h-[60%] rounded-full flex flex-wrap gap-2 p-2 justify-center content-start transition-colors">
                         {placedItems.filter(item => userAnswers[item] === 'output').map(item => (
                            <div
                                key={item}
                                draggable
                                onDragStart={(e) => handleDragStart(e, item)}
                                onDragEnd={handleDragEnd}
                                onClick={() => returnItemToList(item)}
                                className={`${getItemClasses(item)} cursor-grab active:cursor-grabbing`}
                            >
                                {item}
                            </div>
                        ))}
                    </div>
                    <div onDrop={(e) => handleDrop(e, 'both')} onDragOver={handleDragOver} onDragLeave={handleDragLeave} className="absolute top-[25%] left-1/2 -translate-x-1/2 w-[30%] h-[40%] flex flex-wrap gap-2 p-2 justify-center content-start transition-colors">
                         {placedItems.filter(item => userAnswers[item] === 'both').map(item => (
                            <div
                                key={item}
                                draggable
                                onDragStart={(e) => handleDragStart(e, item)}
                                onDragEnd={handleDragEnd}
                                onClick={() => returnItemToList(item)}
                                className={`${getItemClasses(item)} cursor-grab active:cursor-grabbing`}
                            >
                                {item}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4 flex-wrap justify-center">
                    <button onClick={handleMarkWork} className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:scale-105 transition-transform">
                        Mark My Work
                    </button>
                    <button onClick={resetAll} className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:scale-105 transition-transform">
                        Reset
                    </button>
                    
                    {isMarked && (
                    <>
                        <label className="flex items-center gap-2 text-lg">
                            <input type="checkbox" checked={showAnswers} onChange={(e) => setShowAnswers(e.target.checked)} className="w-5 h-5"/>
                            Answer feedback
                        </label>
                        <div className="bg-green-200 text-green-800 font-bold text-xl py-3 px-6 rounded-full">
                            Score: {score} / {placedItems.length}
                        </div>
                    </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default InputOutputTool;