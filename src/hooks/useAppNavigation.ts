import { useNavigate } from '@tanstack/react-router';
import type { Page } from '../types/types';
import { pageToPath } from '../routeConfig';

/**
 * Custom hook for navigation in the KS3 Computing app
 * Provides a type-safe way to navigate between pages
 */
export function useAppNavigation() {
  const navigate = useNavigate();

  const navigateToPage = (page: Page) => {
    navigate({ to: pageToPath(page) });
  };

  return { navigateToPage };
}
