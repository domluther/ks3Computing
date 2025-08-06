import type { Page } from './types/types';

export interface RouteConfig {
  page: Page;
  path: string;
}

export const routeConfigs: RouteConfig[] = [
  { page: 'home', path: '/' },
  { page: 'input-output', path: '/input-output' },
  { page: 'online-safety', path: '/online-safety' },
  { page: 'algorithms', path: '/algorithms' },
  { page: 'it-skills', path: '/it-skills' },
];

export const pageToPath = (page: Page): string => {
  const config = routeConfigs.find(c => c.page === page);
  return config?.path || '/';
};

export const pathToPage = (pathname: string): Page => {
  // Handle nested IT Skills routes
  if (pathname.startsWith('/it-skills')) {
    return 'it-skills';
  }
  
  // Handle nested Online Safety routes
  if (pathname.startsWith('/online-safety')) {
    return 'online-safety';
  }
  
  const config = routeConfigs.find(c => c.path === pathname);
  return config?.page || 'home';
};
