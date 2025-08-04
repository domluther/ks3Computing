import { useState } from 'react';
import type { Page } from './types/types';

import Header from './components/Header';
import Navbar from './components/Navbar';
import PlaceholderPage from './components/PlaceholderPage';
import HomePage from './pages/HomePage';
import InputOutputTool from './pages/InputOutputTool';
import ITSkillsGame from './pages/ITSkillsGame';

export default function App() {
    // This 'state' variable controls which page is currently visible.
    const [activePage, setActivePage] = useState<Page>('home');

    // This function determines which component to render based on the activePage state.
    const renderPage = () => {
        switch (activePage) {
            case 'home':
                return <HomePage setActivePage={setActivePage} />;
            case 'input-output':
                return <InputOutputTool />;
            case 'networks':
                return <PlaceholderPage title="Networks" icon="🌐" />;
            case 'algorithms':
                return <PlaceholderPage title="Algorithms" icon="🔄" />;
            case 'it-skills':
                return <ITSkillsGame />;
            default:
                return <HomePage setActivePage={setActivePage} />;
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen font-sans">
            <div className="max-w-7xl mx-auto bg-white shadow-2xl rounded-b-lg">
                <Header />
                <Navbar activePage={activePage} setActivePage={setActivePage} />
                <main>
                    {renderPage()}
                </main>
            </div>
        </div>
    );
}