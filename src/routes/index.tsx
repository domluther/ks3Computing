import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { navItems } from '../data/pages';
import HomePageButton from '../components/HomePageButton';

const HomePage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="text-center max-w-4xl mx-auto p-8">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Welcome to KS3 Computing! 🎉</h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-6">
                Hello Year 7, 8, and 9 students! This website contains a collection of interactive tools and activities designed to help you learn and practice key concepts in Computing.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
                {/* Don't show the home button on the home screen */}
                {navItems.map(item => (
                    item.id !== 'home' ? (
                        <HomePageButton key={item.id} navItem={item} navigate={navigate} />
                    ) : null
                ))}
            </div>
        </div>
    );
};

export const Route = createFileRoute('/')({
  component: HomePage,
})
