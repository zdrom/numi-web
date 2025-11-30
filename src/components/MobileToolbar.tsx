import { useEffect, useState } from 'react';
import { triggerHaptic } from '../utils/haptics';
import './MobileToolbar.css';

export type ToolbarAction = 'undo' | 'clear' | 'left' | 'right' | 'dismiss' | 'return';

interface MobileToolbarProps {
    onInsert: (text: string) => void;
    onAction: (action: ToolbarAction) => void;
    currentResult: string | null;
}

export function MobileToolbar({ onInsert, onAction, currentResult }: MobileToolbarProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Show toolbar only on mobile/touch devices
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        setIsVisible(isTouchDevice);
    }, []);

    const handleKeyClick = (value: string) => {
        triggerHaptic('light');
        onInsert(value);
    };

    const handleActionClick = (action: ToolbarAction) => {
        triggerHaptic('medium');
        onAction(action);
    };

    const handleResultClick = () => {
        if (currentResult) {
            triggerHaptic('medium');
            onInsert(currentResult);
        }
    };

    if (!isVisible) return null;

    const keys = [
        { label: '+', value: ' + ', type: 'operator' },
        { label: '−', value: ' - ', type: 'operator' },
        { label: '×', value: ' * ', type: 'operator' },
        { label: '÷', value: ' / ', type: 'operator' },
        { label: '=', value: ' = ', type: 'operator' },
        { label: '(', value: '(', type: 'operator' },
        { label: ')', value: ')', type: 'operator' },
        { label: '$', value: '$', type: 'unit' },
        { label: '%', value: '%', type: 'unit' },
        { label: 'in', value: ' in ', type: 'unit' },
        { label: 'cm', value: ' cm', type: 'unit' },
        { label: 'kg', value: ' kg', type: 'unit' },
        { label: 'lb', value: ' lb', type: 'unit' },
        { label: 'prev', value: 'prev', type: 'function' },
        { label: 'sum', value: 'sum', type: 'function' },
        { label: 'avg', value: 'average', type: 'function' },
    ];

    return (
        <div
            className="mobile-toolbar"
        >
            {/* Row 1: Live Result & Actions */}
            <div className="toolbar-top-row">
                <div
                    className={`live-result ${!currentResult ? 'empty' : ''}`}
                    onClick={handleResultClick}
                >
                    {currentResult || ''}
                </div>

                <div className="toolbar-actions">
                    <button className="action-btn" onClick={() => handleActionClick('left')} title="Move Left">
                        ←
                    </button>
                    <button className="action-btn" onClick={() => handleActionClick('right')} title="Move Right">
                        →
                    </button>
                    <button className="action-btn" onClick={() => handleActionClick('return')} title="Return">
                        ↵
                    </button>
                    <button className="action-btn" onClick={() => handleActionClick('undo')} title="Undo">
                        ↶
                    </button>
                    <button className="action-btn" onClick={() => handleActionClick('dismiss')} title="Hide Keyboard">
                        ✕
                    </button>
                </div>
            </div>

            {/* Row 2: Scrollable Keys */}
            <div className="toolbar-keys-row">
                {keys.map((key) => (
                    <button
                        key={key.label}
                        className={`key-btn ${key.type}`}
                        onClick={() => handleKeyClick(key.value)}
                    >
                        {key.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
