import { 
  createRouter, 
  createRoute, 
  createRootRoute,
  Outlet,
  useNavigate,
  useLocation
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

import Header from './components/Header';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import InputOutputTool from './pages/InputOutputTool';
import OnlineSafetyLayout from './components/OnlineSafetyLayout';
import PlaceholderPage from './components/PlaceholderPage';
import ITSkillsLayout from './components/ITSkillsLayout';
import MouseSkillsChallenge from './components/MouseSkillsChallenge';
import FileSimulation from './components/FileSimulation';
import PhishingGame from './components/PhishingGame';
import SocialCreditGame from './components/SocialCreditGame';
import type { Page } from './types/types';
import { pageToPath, pathToPage } from './routeConfig';

// Root Layout Component
function RootLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Handle page navigation
  const handleSetActivePage = (page: Page) => {
    navigate({ to: pageToPath(page) });
  };

  const currentPage = pathToPage(location.pathname);

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto bg-white shadow-2xl rounded-b-lg">
        <Header />
        <Navbar activePage={currentPage} setActivePage={handleSetActivePage} />
        <main>
          <Outlet />
        </main>
      </div>
      <TanStackRouterDevtools />
    </div>
  );
}

// Home Page Wrapper Component
function HomePageWrapper() {
  const navigate = useNavigate();
  
  const handleSetActivePage = (page: Page) => {
    navigate({ to: pageToPath(page) });
  };

  return <HomePage setActivePage={handleSetActivePage} />;
}

// Create a root route
const rootRoute = createRootRoute({
  component: RootLayout,
});

// Create individual route definitions
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePageWrapper,
});

const inputOutputRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/input-output',
  component: InputOutputTool,
});

const onlineSafetyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/online-safety',
  component: OnlineSafetyLayout,
});

// Online Safety child routes
const onlineSafetyIndexRoute = createRoute({
  getParentRoute: () => onlineSafetyRoute,
  path: '/',
  component: () => null, // The index content is handled by OnlineSafetyLayout
});

const phishingRoute = createRoute({
  getParentRoute: () => onlineSafetyRoute,
  path: '/phishing',
  component: PhishingGame,
});

const socialCreditRoute = createRoute({
  getParentRoute: () => onlineSafetyRoute,
  path: '/social-credit',
  component: SocialCreditGame,
});

const algorithmsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/algorithms',
  component: () => <PlaceholderPage title="Algorithms" icon="🔄" />,
});

const itSkillsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/it-skills',
  component: ITSkillsLayout,
});

// IT Skills child routes
const itSkillsIndexRoute = createRoute({
  getParentRoute: () => itSkillsRoute,
  path: '/',
  component: () => null, // The index content is handled by ITSkillsLayout
});

const mouseSkillsRoute = createRoute({
  getParentRoute: () => itSkillsRoute,
  path: '/mouse-skills',
  component: MouseSkillsChallenge,
});

const fileSimulationRoute = createRoute({
  getParentRoute: () => itSkillsRoute,
  path: '/file-simulation',
  component: FileSimulation,
});

// Create the route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  inputOutputRoute,
  onlineSafetyRoute.addChildren([
    onlineSafetyIndexRoute,
    phishingRoute,
    socialCreditRoute,
  ]),
  algorithmsRoute,
  itSkillsRoute.addChildren([
    itSkillsIndexRoute,
    mouseSkillsRoute,
    fileSimulationRoute,
  ]),
]);

// Create the router
export const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
