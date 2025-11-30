import { useTheme } from '../contexts/ThemeContext';
import './ThemeToggle.css';

export function ThemeToggle() {
  const { theme, effectiveTheme, setTheme } = useTheme();

  const handleToggle = () => {
    if (theme === 'auto') {
      setTheme('light');
    } else if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('auto');
    }
  };

  const getIcon = () => {
    if (theme === 'auto') {
      return '🌓'; // Auto mode
    } else if (effectiveTheme === 'dark') {
      return '🌙'; // Dark mode
    } else {
      return '☀️'; // Light mode
    }
  };

  const getLabel = () => {
    if (theme === 'auto') {
      return 'Auto';
    } else if (effectiveTheme === 'dark') {
      return 'Dark';
    } else {
      return 'Light';
    }
  };

  return (
    <button
      className="theme-toggle"
      onClick={handleToggle}
      aria-label={`Current theme: ${getLabel()}. Click to switch.`}
      title={`Theme: ${getLabel()} (click to change)`}
    >
      <span className="theme-icon">{getIcon()}</span>
    </button>
  );
}
