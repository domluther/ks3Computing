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
    const [pageKey, setPageKey] = useState<number>(0);

    // This function updates the active page and forces a re-render if the same page is clicked again.
    const handleSetActivePage = (page: Page) => {
        if (page === activePage) {
            setPageKey(prev => prev + 1);
        } else {
            setActivePage(page);
            setPageKey(prev => prev + 1);
        }
    };

    // This function determines which component to render based on the activePage state.
    const renderPage = () => {
        switch (activePage) {
            case 'home':
                return <HomePage setActivePage={handleSetActivePage} />;
            case 'input-output':
                return <InputOutputTool key={pageKey}/>;
            case 'networks':
                return <PlaceholderPage key={pageKey} title="Networks" icon="🌐" />;
            case 'algorithms':
                return <PlaceholderPage key={pageKey} title="Algorithms" icon="🔄" />;
            case 'it-skills':
                return <ITSkillsGame key={pageKey}/>;
            default:
                return <HomePage key={pageKey} setActivePage={handleSetActivePage} />;
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen font-sans">
            <div className="max-w-7xl mx-auto bg-white shadow-2xl rounded-b-lg">
                <Header />
                <Navbar activePage={activePage} setActivePage={handleSetActivePage} />
                <main>
                    {renderPage()}
                </main>
            </div>
        </div>
    );
}