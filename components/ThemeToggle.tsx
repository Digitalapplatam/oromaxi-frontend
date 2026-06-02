'use client';

import { useTheme } from './ThemeProvider';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      className="p-2 rounded-lg border border-gray-dark hover:border-gold transition font-bold text-lg"
      title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      {theme === 'dark' ? (
        <span style={{ color: '#D4AF37' }}>☀️</span>
      ) : (
        <span>🌙</span>
      )}
    </button>
  );
}
