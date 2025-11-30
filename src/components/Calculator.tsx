import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { ParsedLine } from '../types';
import { NumiParser } from '../utils/parser';
import { updateExchangeRates } from '../utils/currency';
import { ThemeToggle } from './ThemeToggle';
import { MobileKeyboard } from './MobileKeyboard';
import { saveContent, loadContent } from '../utils/storage';
import './Calculator.css';

const parser = new NumiParser();

export function Calculator() {
  const [content, setContent] = useState<string>('');
  const [parsedLines, setParsedLines] = useState<ParsedLine[]>([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [autocompleteOptions, setAutocompleteOptions] = useState<string[]>([]);
  const [autocompletePosition, setAutocompletePosition] = useState({ top: 0, left: 0 });
  const [selectedAutocompleteIndex, setSelectedAutocompleteIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(true);

  const editorRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // Load saved content on mount
    const savedState = loadContent();
    if (savedState && savedState.content) {
      setContent(savedState.content);
      if (editorRef.current) {
        editorRef.current.textContent = savedState.content;
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

    // Mark as unsaved when content changes
    setIsSaved(false);

    // Debounce save for 2 seconds
    saveTimeoutRef.current = window.setTimeout(() => {
      saveContent(content);
      setIsSaved(true);
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
    setContent('');
    setParsedLines([]);
    parser.clearVariables();
    if (editorRef.current) {
      editorRef.current.textContent = '';
      editorRef.current.focus();
    }
  };

  const copyResult = async (result: string) => {
    try {
      await navigator.clipboard.writeText(result);
      // Could add a toast notification here in the future
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const insertText = (text: string) => {
    if (!editorRef.current) return;

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
        <h1>Numi</h1>
        <p className="tagline">
          Beautiful calculator
          <span className={`save-indicator ${isSaved ? 'saved' : 'saving'}`}>
            {isSaved ? ' • Saved' : ' • Saving...'}
          </span>
        </p>
        <ThemeToggle />
        <button className="clear-button" onClick={clearAll}>Clear All</button>
      </header>

      <div className="calculator-body">
        <div className="editor-container">
          <div
            ref={editorRef}
            className="main-editor"
            contentEditable
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            suppressContentEditableWarning
          />

          <div ref={overlayRef} className="results-overlay">
            {parsedLines.map((line, i) => (
              <div key={i} className="result-line" data-type={line.type}>
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

      <MobileKeyboard onInsert={insertText} editorRef={editorRef} />

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
