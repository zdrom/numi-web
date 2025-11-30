import { useState, useEffect } from 'react';
import './InstallPrompt.css';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Save the event so it can be triggered later
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show our custom install prompt
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    console.log(`User response to the install prompt: ${outcome}`);

    // Clear the deferredPrompt so it can be garbage collected
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="install-prompt">
      <div className="install-prompt-content">
        <div className="install-prompt-icon">📱</div>
        <div className="install-prompt-text">
          <h3>Install Numi</h3>
          <p>Add to your home screen for quick access and offline use</p>
        </div>
        <div className="install-prompt-actions">
          <button className="install-button" onClick={handleInstallClick}>
            Install
          </button>
          <button className="dismiss-button" onClick={handleDismiss}>
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
