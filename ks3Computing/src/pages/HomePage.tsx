import React from 'react';
import type { Page } from '../types/types';

interface HomePageProps {
    setActivePage: (page: Page) => void;
}

const HomePage: React.FC<HomePageProps> = ({ setActivePage }) => (
    <div className="text-center max-w-4xl mx-auto p-8">
        <h2 className="text-4xl font-bold text-slate-800 mb-4">Welcome to KS3 Computing! 🎉</h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-6">
            Hello Year 7, 8, and 9 students! This website contains a collection of interactive tools and activities designed to help you learn and practice key concepts in Computing.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
            <div
                className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 rounded-xl shadow-lg cursor-pointer transform hover:-translate-y-1 transition-transform"
                onClick={() => setActivePage('input-output')}
            >
                <h3 className="text-2xl font-bold mb-2">🖥️ Input & Output</h3>
                <p>Categorize hardware with a Venn diagram.</p>
            </div>
             <div className="bg-gradient-to-br from-slate-600 to-slate-800 text-white p-6 rounded-xl shadow-lg cursor-not-allowed">
                <h3 className="text-2xl font-bold mb-2">🌐 Networks</h3>
                <p>Coming Soon!</p>
            </div>
             <div className="bg-gradient-to-br from-slate-600 to-slate-800 text-white p-6 rounded-xl shadow-lg cursor-not-allowed">
                <h3 className="text-2xl font-bold mb-2">🔄 Algorithms</h3>
                <p>Coming Soon!</p>
            </div>
        </div>
    </div>
);

export default HomePage;