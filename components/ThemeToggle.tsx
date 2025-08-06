'use client';

import React from 'react';
import { useTheme } from './ThemeProvider';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const getIcon = () => {
    return theme === 'light' ? '☀️' : '🌙';
  };

  const getLabel = () => {
    return theme === 'light' ? 'Light' : 'Dark';
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
      title={`Current theme: ${getLabel()}. Click to toggle theme.`}
      type="button"
    >
      <span className="text-lg">{getIcon()}</span>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
        {getLabel()}
      </span>
    </button>
  );
};

export default ThemeToggle;
