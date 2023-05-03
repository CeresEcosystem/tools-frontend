import { screens as _screens } from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export const content = [
  './pages/**/*.{js,ts,jsx,tsx,mdx}',
  './components/**/*.{js,ts,jsx,tsx,mdx}',
  './layouts/**/*.{js,ts,jsx,tsx,mdx}',
];
export const theme = {
  extend: {
    colors: {
      backgroundBody: '#2d093e',
      backgroundSidebar: '#3c154e',
      backgroundHeader: '#532968',
      pink: '#f0398c',
    },
  },
  screens: {
    xxxs: '320px',
    xxs: '375px',
    xs: '480px',
    ..._screens,
    '3xl': '1740px',
  },
};
export const plugins = [];
