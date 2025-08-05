import React from 'react';
import type { Page } from '../types/types';
import { navItems } from '../data/pages';
import HomePageButton from '../components/HomePageButton';

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
            {navItems.map(item => (
            <HomePageButton key={item.id} navItem={item} setActivePage={setActivePage} />
            ))}

        </div>
    </div>
);

export default HomePage;