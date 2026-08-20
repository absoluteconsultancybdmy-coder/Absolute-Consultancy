import { memo } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="theme-toggle fixed right-5 sm:right-6 z-50 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-105 active:scale-95"
      style={{
        top: '88px',
        width: 42,
        height: 42,
        backgroundColor: 'rgba(2, 22, 53, 0.55)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgb(var(--color-gold) / 0.55)',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.25)',
        color: 'rgb(var(--color-gold))',
        cursor: 'pointer',
      }}
    >
      <span
        aria-hidden="true"
        className="theme-toggle__icon-wrap"
        style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 18,
          height: 18,
        }}
      >
        <Sun
          size={18}
          strokeWidth={1.8}
          className="theme-toggle__sun"
          style={{
            position: 'absolute',
            transition: 'opacity 320ms ease, transform 320ms ease',
            opacity: isDark ? 0 : 1,
            transform: isDark ? 'rotate(-45deg) scale(0.7)' : 'rotate(0deg) scale(1)',
          }}
        />
        <Moon
          size={18}
          strokeWidth={1.8}
          className="theme-toggle__moon"
          style={{
            position: 'absolute',
            transition: 'opacity 320ms ease, transform 320ms ease',
            opacity: isDark ? 1 : 0,
            transform: isDark ? 'rotate(0deg) scale(1)' : 'rotate(45deg) scale(0.7)',
          }}
        />
      </span>
    </button>
  );
}

export default memo(ThemeToggle);
