import React from 'react';
import type { PageDescription } from '../types/types';
import type { UseNavigateResult } from '@tanstack/react-router';

type Props = {
  navItem: PageDescription;
  navigate: UseNavigateResult<string>;
};

// Map page IDs to routes
const pageToRoute = (pageId: string): string => {
  switch (pageId) {
    case 'home': return '/';
    case 'input-output': return '/input-output';
    case 'online-safety': return '/online-safety';
    case 'algorithms': return '/algorithms';
    case 'it-skills': return '/it-skills';
    default: return '/';
  }
};

const HomePageButton: React.FC<Props> = ({ navItem, navigate }) => {
  const isEnabled = navItem.enabled;

  const baseClasses =
    'text-white p-6 rounded-xl shadow-lg transition-transform';
  const enabledClasses =
    'bg-gradient-to-br from-green-500 to-emerald-600 cursor-pointer transform hover:-translate-y-1';
  const disabledClasses =
    'bg-gradient-to-br from-slate-600 to-slate-800 cursor-not-allowed';

  return (
    <div
      key={navItem.id}
      className={`${baseClasses} ${
        isEnabled ? enabledClasses : disabledClasses
      }`}
      onClick={isEnabled ? () => navigate({ to: pageToRoute(navItem.id) }) : undefined}
    >
      <h3 className="text-2xl font-bold mb-2">
        {navItem.emoji} {navItem.title}
      </h3>
      <p>{navItem.description}</p>
    </div>
  );
};

export default HomePageButton;
