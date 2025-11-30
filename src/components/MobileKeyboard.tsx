import { useEffect, useState } from 'react';
import { triggerHaptic } from '../utils/haptics';
import './MobileKeyboard.css';

interface MobileKeyboardProps {
  onInsert: (text: string) => void;
  editorRef: React.RefObject<HTMLDivElement | HTMLTextAreaElement>;
  keyboardHeight: number;
}

export function MobileKeyboard({ onInsert, editorRef, keyboardHeight }: MobileKeyboardProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show toolbar only on mobile/touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsVisible(isTouchDevice);
  }, []);

  // Operation-focused buttons (since numbers come from native keyboard)
  const symbols = [
    { label: '+', value: ' + ', type: 'operator' },
    { label: '−', value: ' - ', type: 'operator' },
    { label: '×', value: ' * ', type: 'operator' },
    { label: '÷', value: ' / ', type: 'operator' },
    { label: '=', value: ' = ', type: 'operator' },
    { label: '%', value: '%', type: 'operator' },
    { label: '(', value: '(', type: 'symbol' },
    { label: ')', value: ')', type: 'symbol' },
    { label: '$', value: '$', type: 'currency' },
    { label: '€', value: '€', type: 'currency' },
    { label: '£', value: '£', type: 'currency' },
    { label: '#', value: '# ', type: 'symbol' },
    { label: 'prev', value: 'prev', type: 'function' },
    { label: 'sum', value: 'sum', type: 'function' },
  ];

  const handleSymbolClick = (value: string) => {
    triggerHaptic('light');
    onInsert(value);
    // Return focus to editor
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className="mobile-keyboard"
      style={{
        bottom: keyboardHeight > 0 ? `${keyboardHeight}px` : '0px'
      }}
    >
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
