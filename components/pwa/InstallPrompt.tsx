'use client';

import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Share2, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/lib/toast';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const isMobile = useIsMobile();

  // Handle SSR
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load dismissed state from localStorage
  useEffect(() => {
    if (!isClient) return;

    try {
      const dismissed = localStorage.getItem('pwa-prompt-dismissed');
      if (dismissed) {
        const dismissedTime = parseInt(dismissed, 10);
        // Show prompt again after 7 days
        if (
          !isNaN(dismissedTime) &&
          Date.now() - dismissedTime < 7 * 24 * 60 * 60 * 1000
        ) {
          setIsDismissed(true);
        }
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
    }
  }, [isClient]);

  const handleDismiss = useCallback(() => {
    setIsDismissed(true);
    try {
      localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, []);

  useEffect(() => {
    if (!isClient) return;

    try {
      // Check if the device is iOS
      const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
      setIsIOS(isIOSDevice);

      // Only set up beforeinstallprompt for non-iOS devices
      if (!isIOSDevice) {
        const handleBeforeInstallPrompt = (e: Event) => {
          e.preventDefault();
          setDeferredPrompt(e as BeforeInstallPromptEvent);
          setIsInstallable(true);
        };

        window.addEventListener(
          'beforeinstallprompt',
          handleBeforeInstallPrompt
        );

        // Check if already installed
        const isStandalone = window.matchMedia(
          '(display-mode: standalone)'
        ).matches;
        if (isStandalone) {
          setIsInstallable(false);
        }

        return () => {
          window.removeEventListener(
            'beforeinstallprompt',
            handleBeforeInstallPrompt
          );
        };
      } else {
        // For iOS, check if it's not already installed
        const nav = navigator as NavigatorWithStandalone;
        const isStandalone = nav.standalone === true;
        setIsInstallable(!isStandalone);
      }
    } catch (error) {
      console.error('Error setting up PWA prompt:', error);
      setIsInstallable(false);
    }
  }, [isClient]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;

      if (choiceResult.outcome === 'accepted') {
        setIsInstallable(false);
        toast.success(
          'Installation started',
          'The app is being installed on your device'
        );
      } else {
        toast.info(
          'Installation cancelled',
          'You can install the app later from the prompt'
        );
      }
    } catch (err) {
      console.error('Error installing app:', err);
      toast.error(
        'Installation failed',
        'Please try again or check your browser settings'
      );
    } finally {
      setDeferredPrompt(null);
    }
  };

  const handleIOSInstallClick = () => {
    toast.info(
      'Install on iOS',
      'Tap the share button in your browser and select "Add to Home Screen"'
    );
  };

  // Don't render anything during SSR or if conditions aren't met
  if (!isClient || !isInstallable || !isMobile || isDismissed) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="install-prompt-title"
      aria-describedby="install-prompt-description"
      className="fixed bottom-4 left-4 right-4 z-50 bg-card rounded-lg shadow-lg border p-4 animate-fade-up"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <h3 id="install-prompt-title" className="font-semibold">
            Install Dishyy App
          </h3>
          <p
            id="install-prompt-description"
            className="text-sm text-muted-foreground"
          >
            {isIOS
              ? 'Get easy access to Dishyy from your home screen'
              : 'Get the best experience on your phone'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isIOS ? (
            <Button
              size="sm"
              className="shrink-0"
              onClick={handleIOSInstallClick}
              aria-label="Show iOS installation instructions"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Add to Home Screen
            </Button>
          ) : (
            <Button
              onClick={handleInstallClick}
              size="sm"
              className="shrink-0"
              aria-label="Install application"
            >
              <Download className="h-4 w-4 mr-2" />
              Install
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="shrink-0"
            onClick={handleDismiss}
            aria-label="Dismiss installation prompt"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
