import { useEffect, useState } from 'react';
import './MobileKeyboard.css';

interface MobileKeyboardProps {
  onInsert: (text: string) => void;
  editorRef: React.RefObject<HTMLDivElement>;
}

export function MobileKeyboard({ onInsert, editorRef }: MobileKeyboardProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show toolbar only on mobile/touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsVisible(isTouchDevice);
  }, []);

  const symbols = [
    { label: '=', value: ' = ' },
    { label: '+', value: ' + ' },
    { label: '-', value: ' - ' },
    { label: '×', value: ' * ' },
    { label: '÷', value: ' / ' },
    { label: '%', value: '%' },
    { label: '(', value: '(' },
    { label: ')', value: ')' },
    { label: '$', value: '$' },
    { label: '€', value: '€' },
    { label: '£', value: '£' },
    { label: '#', value: '# ' },
  ];

  const handleSymbolClick = (value: string) => {
    onInsert(value);
    // Return focus to editor
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="mobile-keyboard">
      <div className="mobile-keyboard-inner">
        {symbols.map((symbol) => (
          <button
            key={symbol.label}
            className="mobile-keyboard-button"
            onClick={() => handleSymbolClick(symbol.value)}
            type="button"
          >
            {symbol.label}
          </button>
        ))}
      </div>
    </div>
  );
}
