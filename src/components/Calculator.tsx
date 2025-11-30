import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { ParsedLine } from '../types';
import { NumiParser } from '../utils/parser';
import { updateExchangeRates } from '../utils/currency';
import { ThemeToggle } from './ThemeToggle';
import { MobileToolbar, ToolbarAction } from './MobileToolbar';
import { InstallPrompt } from './InstallPrompt';
import { saveContent, loadContent } from '../utils/storage';
import { getContentFromURL, updateURL, createShareableURL } from '../utils/url';
import { triggerHaptic } from '../utils/haptics';
import './Calculator.css';

const parser = new NumiParser();

export function Calculator() {
  const [content, setContent] = useState<string>('');
  const [parsedLines, setParsedLines] = useState<ParsedLine[]>([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [autocompleteOptions, setAutocompleteOptions] = useState<string[]>([]);
  const [autocompletePosition, setAutocompletePosition] = useState({ top: 0, left: 0 });
  const [selectedAutocompleteIndex, setSelectedAutocompleteIndex] = useState(0);
  const [showShareFeedback, setShowShareFeedback] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [activeLineIndex, setActiveLineIndex] = useState(0);

  const editorRef = useRef<HTMLDivElement | HTMLTextAreaElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<number | null>(null);
  const shareFeedbackTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // Detect touch device
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(isTouch);

    // Load content on mount: priority is URL > localStorage > empty
    const urlContent = getContentFromURL();

    if (urlContent) {
      // Content from URL takes precedence
      setContent(urlContent);
      if (editorRef.current) {
        if (isTouch && 'value' in editorRef.current) {
          editorRef.current.value = urlContent;
        } else {
          editorRef.current.textContent = urlContent;
        }
      }
    } else {
      // Fall back to localStorage
      const savedState = loadContent();
      if (savedState && savedState.content) {
        setContent(savedState.content);
        if (editorRef.current) {
          if (isTouch && 'value' in editorRef.current) {
            editorRef.current.value = savedState.content;
          } else {
            editorRef.current.textContent = savedState.content;
          }
        }
      }
    }

    // Update currency rates on mount
    updateExchangeRates();

    // Update every hour
    const interval = setInterval(updateExchangeRates, 3600000);
    return () => clearInterval(interval);
  }, []);

  // Auto-save effect
  useEffect(() => {
    // Clear any existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Debounce save for 2 seconds
    saveTimeoutRef.current = window.setTimeout(() => {
      saveContent(content);
      updateURL(content);
    }, 2000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [content]);

  useEffect(() => {
    // Parse content whenever it changes
    const parsed = parser.parseDocument(content);

    // Ensure we have at least as many lines as in the content
    const lineCount = content.split('\n').length;
    const paddedLines = [...parsed];

    // Add empty lines if parsed is shorter than actual content
    while (paddedLines.length < lineCount) {
      paddedLines.push({
        lineNumber: paddedLines.length,
        input: '',
        result: null,
        error: null,
        type: 'blank'
      });
    }

    setParsedLines(paddedLines);
  }, [content]);

  useEffect(() => {
    // Calculate active line index based on cursor position
    const linesBeforeCursor = content.substring(0, cursorPosition).split('\n');
    setActiveLineIndex(linesBeforeCursor.length - 1);
  }, [cursorPosition, content]);

  const updateCursorPosition = () => {
    if (editorRef.current && 'selectionStart' in editorRef.current) {
      setCursorPosition((editorRef.current as HTMLTextAreaElement).selectionStart);
    }
  };

  useEffect(() => {
    // Sync scroll between editor and overlay
    const handleScroll = () => {
      if (editorRef.current && overlayRef.current) {
        overlayRef.current.scrollTop = editorRef.current.scrollTop;
      }
    };

    const editor = editorRef.current;
    if (editor) {
      editor.addEventListener('scroll', handleScroll);
      return () => editor.removeEventListener('scroll', handleScroll);
    }
  }, []);



  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    // Get text content preserving newlines from <br> and <div> elements
    const element = e.currentTarget;
    let text = '';

    // Walk through the DOM and extract text with newlines
    const extractText = (node: Node): void => {
      if (node.nodeType === Node.TEXT_NODE) {
        text += node.textContent || '';
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;

        // Add newline before block elements (except the first one)
        if (text.length > 0 && (el.tagName === 'DIV' || el.tagName === 'P')) {
          text += '\n';
        }

        // Process children
        node.childNodes.forEach(extractText);

        // Add newline after <br>
        if (el.tagName === 'BR') {
          text += '\n';
        }
      }
    };

    element.childNodes.forEach(extractText);

    setContent(text);

    // Check for autocomplete trigger
    checkAutocomplete(element);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setContent(text);
    updateCursorPosition();
    // Note: autocomplete is disabled for textarea (mobile) for now
    // Can be enhanced in future if needed
  };

  const handleToolbarAction = (action: ToolbarAction) => {
    if (!editorRef.current || !('value' in editorRef.current)) return;
    const textarea = editorRef.current as HTMLTextAreaElement;

    switch (action) {
      case 'left':
        textarea.setSelectionRange(Math.max(0, textarea.selectionStart - 1), Math.max(0, textarea.selectionStart - 1));
        updateCursorPosition();
        break;
      case 'right':
        textarea.setSelectionRange(Math.min(textarea.value.length, textarea.selectionStart + 1), Math.min(textarea.value.length, textarea.selectionStart + 1));
        updateCursorPosition();
        break;
      case 'dismiss':
        textarea.blur();
        break;
      case 'undo':
        document.execCommand('undo');
        setContent(textarea.value); // Sync state
        updateCursorPosition();
        break;
      case 'clear':
        // Clear current line
        const lines = content.split('\n');
        if (activeLineIndex >= 0 && activeLineIndex < lines.length) {
          // Find start and end indices of the current line
          let start = 0;
          for (let i = 0; i < activeLineIndex; i++) {
            start += lines[i].length + 1; // +1 for newline
          }
          const end = start + lines[activeLineIndex].length;

          const newContent = content.substring(0, start) + content.substring(end);
          textarea.value = newContent;
          setContent(newContent);
          textarea.setSelectionRange(start, start);
          updateCursorPosition();
        }
        break;
    }
    textarea.focus();
  };

  const checkAutocomplete = (element: HTMLDivElement) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      setShowAutocomplete(false);
      return;
    }

    const range = selection.getRangeAt(0);
    const textBeforeCursor = range.startContainer.textContent?.substring(0, range.startOffset) || '';

    // Match word being typed (alphanumeric + underscore)
    const wordMatch = textBeforeCursor.match(/([a-zA-Z_]\w*)$/);

    if (wordMatch) {
      const partialWord = wordMatch[1];
      const variables = parser.getVariables();
      const keywords = ['prev', 'sum', 'total', 'average', 'avg', 'pi', 'e'];

      const allOptions = [
        ...variables.map(v => v.name),
        ...keywords
      ];

      const matches = allOptions.filter(opt =>
        opt.toLowerCase().startsWith(partialWord.toLowerCase()) && opt !== partialWord
      );

      if (matches.length > 0) {
        // Get cursor position for autocomplete dropdown
        const rect = range.getBoundingClientRect();
        const editorRect = element.getBoundingClientRect();

        setAutocompleteOptions(matches);
        setAutocompletePosition({
          top: rect.bottom - editorRect.top + element.scrollTop,
          left: rect.left - editorRect.left
        });
        setSelectedAutocompleteIndex(0);
        setShowAutocomplete(true);
      } else {
        setShowAutocomplete(false);
      }
    } else {
      setShowAutocomplete(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (showAutocomplete) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedAutocompleteIndex(prev =>
          Math.min(prev + 1, autocompleteOptions.length - 1)
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedAutocompleteIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Tab' || e.key === 'Enter') {
        if (autocompleteOptions.length > 0) {
          e.preventDefault();
          insertAutocomplete(autocompleteOptions[selectedAutocompleteIndex]);
        }
      } else if (e.key === 'Escape') {
        setShowAutocomplete(false);
      }
    }
  };

  const insertAutocomplete = (option: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const textNode = range.startContainer;
    const textBefore = textNode.textContent?.substring(0, range.startOffset) || '';
    const textAfter = textNode.textContent?.substring(range.startOffset) || '';

    // Find the partial word to replace
    const wordMatch = textBefore.match(/([a-zA-Z_]\w*)$/);
    if (wordMatch) {
      const partialWord = wordMatch[1];
      const beforeWord = textBefore.substring(0, textBefore.length - partialWord.length);
      const newText = beforeWord + option + textAfter;

      if (textNode.nodeType === Node.TEXT_NODE) {
        textNode.textContent = newText;

        // Set cursor position after inserted word
        const newOffset = beforeWord.length + option.length;
        range.setStart(textNode, newOffset);
        range.setEnd(textNode, newOffset);
        selection.removeAllRanges();
        selection.addRange(range);
      }

      setShowAutocomplete(false);

      // Trigger update
      if (editorRef.current) {
        setContent(editorRef.current.textContent || '');
      }
    }
  };

  const clearAll = () => {
    triggerHaptic('heavy');
    setContent('');
    setParsedLines([]);
    parser.clearVariables();
    if (editorRef.current) {
      if (isTouchDevice && 'value' in editorRef.current) {
        editorRef.current.value = '';
      } else {
        editorRef.current.textContent = '';
      }
      editorRef.current.focus();
    }
  };

  const copyResult = async (result: string) => {
    try {
      await navigator.clipboard.writeText(result);
      triggerHaptic('medium');
      // Could add a toast notification here in the future
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const shareURL = async () => {
    try {
      const url = createShareableURL(content);
      await navigator.clipboard.writeText(url);

      // Show feedback
      setShowShareFeedback(true);

      // Clear any existing timeout
      if (shareFeedbackTimeoutRef.current) {
        clearTimeout(shareFeedbackTimeoutRef.current);
      }

      // Hide feedback after 2 seconds
      shareFeedbackTimeoutRef.current = window.setTimeout(() => {
        setShowShareFeedback(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy share URL:', error);
    }
  };

  const insertText = (text: string) => {
    if (!editorRef.current) return;

    // Handle textarea (mobile) vs contentEditable (desktop)
    if (isTouchDevice && 'value' in editorRef.current) {
      const textarea = editorRef.current as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentContent = textarea.value;

      const newContent = currentContent.substring(0, start) + text + currentContent.substring(end);
      textarea.value = newContent;
      setContent(newContent);

      // Set cursor position after inserted text
      const newPosition = start + text.length;
      textarea.setSelectionRange(newPosition, newPosition);
      textarea.focus();
      return;
    }

    // ContentEditable handling (desktop)
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      // No selection, append to end
      const currentContent = editorRef.current.textContent || '';
      const newContent = currentContent + text;
      editorRef.current.textContent = newContent;
      setContent(newContent);
      return;
    }

    const range = selection.getRangeAt(0);
    range.deleteContents();

    const textNode = document.createTextNode(text);
    range.insertNode(textNode);

    // Move cursor after inserted text
    range.setStartAfter(textNode);
    range.setEndAfter(textNode);
    selection.removeAllRanges();
    selection.addRange(range);

    // Update content
    setContent(editorRef.current.textContent || '');
  };

  return (
    <div className="calculator">
      <header className="calculator-header">
        <button className="clear-button" onClick={clearAll} title="Clear all">🗑️</button>
        <h1>Numi</h1>
        <div className="header-actions">
          <button
            className="share-button"
            onClick={shareURL}
            title="Copy shareable link"
          >
            {showShareFeedback ? '✓ Copied!' : '🔗 Share'}
          </button>
          <ThemeToggle />
        </div>
      </header>

      <MobileToolbar
        onInsert={insertText}
        onAction={handleToolbarAction}
        currentResult={parsedLines[activeLineIndex]?.result || null}
      />


      <InstallPrompt />

      <div className="calculator-body">
        <div className="editor-container">
          {isTouchDevice ? (
            <textarea
              ref={editorRef as React.RefObject<HTMLTextAreaElement>}
              className="main-editor"
              value={content}
              onChange={handleTextareaChange}
              spellCheck={false}
              inputMode="decimal"
              placeholder="Start typing... Try '20 + 15'"
              onClick={updateCursorPosition}
              onKeyUp={updateCursorPosition}
              onSelect={updateCursorPosition}
            />
          ) : (
            <div
              ref={editorRef as React.RefObject<HTMLDivElement>}
              className="main-editor"
              contentEditable
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              suppressContentEditableWarning
            />
          )}

          <div ref={overlayRef} className="results-overlay">
            {parsedLines.map((line, i) => (
              <div key={i} className={`result-line ${i === activeLineIndex && isTouchDevice ? 'active-mobile' : ''}`} data-type={line.type}>
                {line.type === 'header' && line.headerLevel && (
                  <span className={`header-indicator h${line.headerLevel}`}>
                    {'#'.repeat(line.headerLevel)}
                  </span>
                )}
                {line.result && (
                  <div className="result-container">
                    <span className="result">{line.result}</span>
                    <button
                      className="copy-button"
                      onClick={() => copyResult(line.result!)}
                      aria-label="Copy result"
                      title="Copy to clipboard"
                    >
                      📋
                    </button>
                  </div>
                )}
                {line.error && (
                  <span className="error">{line.error}</span>
                )}
              </div>
            ))}
          </div>

          {showAutocomplete && (
            <div
              className="autocomplete-dropdown"
              style={{
                top: `${autocompletePosition.top}px`,
                left: `${autocompletePosition.left}px`
              }}
            >
              {autocompleteOptions.map((option, index) => (
                <div
                  key={option}
                  className={`autocomplete-option ${index === selectedAutocompleteIndex ? 'selected' : ''}`}
                  onClick={() => insertAutocomplete(option)}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <footer className="calculator-footer">
        <div className="hints">
          <div className="hint-group">
            <strong>Examples:</strong>
            <span>20 inches in cm</span>
            <span>$100 in EUR - 5%</span>
            <span>sum</span>
            <span>prev * 2</span>
          </div>
          <div className="hint-group">
            <strong>Tips:</strong>
            <span># for headers</span>
            <span>// for comments</span>
            <span>x = 10 for variables</span>
            <span>blank lines separate groups</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
