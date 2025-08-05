import React from 'react';
import type { Page, PageDescription } from '../types/types';

type Props = {
  navItem: PageDescription;
  setActivePage: (page: Page) => void;
};

const HomePageButton: React.FC<Props> = ({ navItem, setActivePage }) => {
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
      onClick={isEnabled ? () => setActivePage(navItem.id) : undefined}
    >
      <h3 className="text-2xl font-bold mb-2">
        {navItem.emoji} {navItem.title}
      </h3>
      <p>{navItem.description}</p>
    </div>
  );
};

export default HomePageButton;
