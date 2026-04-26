// PWA Utilities for Torquesmart Fleet Management

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export class PWAUtils {
  private static deferredPrompt: BeforeInstallPromptEvent | null = null;
  private static isInstalled = false;

  // Initialize PWA functionality
  static init() {
    this.registerServiceWorker();
    this.setupInstallPrompt();
    this.setupOnlineStatus();
    this.setupVisibilityChange();
  }

  // Register Service Worker
  private static registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('[PWA] Service Worker registered:', registration.scope);
            
            // Check for updates periodically
            setInterval(() => {
              registration.update();
            }, 60 * 60 * 1000); // Check every hour
          })
          .catch((error) => {
            console.error('[PWA] Service Worker registration failed:', error);
          });
      });
    }
  }

  // Setup install prompt for PWA installation
  private static setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e as BeforeInstallPromptEvent;
      console.log('[PWA] Install prompt ready');
    });
  }

  // Show install prompt
  static async showInstallPrompt(): Promise<boolean> {
    if (!this.deferredPrompt || this.isInstalled) {
      return false;
    }

    try {
      await this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('[PWA] PWA installed successfully');
        this.isInstalled = true;
        this.deferredPrompt = null;
        return true;
      } else {
        console.log('[PWA] PWA installation dismissed');
        return false;
      }
    } catch (error) {
      console.error('[PWA] Error showing install prompt:', error);
      return false;
    }
  }

  // Check if PWA can be installed
  static canInstall(): boolean {
    return !!(this.deferredPrompt && !this.isInstalled);
  }

  // Check if running as PWA
  static isPWA(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.matchMedia('(display-mode: minimal-ui)').matches ||
           (window.navigator as any).standalone === true;
  }

  // Setup online/offline status monitoring
  private static setupOnlineStatus() {
    const updateOnlineStatus = () => {
      const isOnline = navigator.onLine;
      console.log('[PWA] Network status:', isOnline ? 'online' : 'offline');
      
      // Dispatch custom event for components to listen
      window.dispatchEvent(new CustomEvent('networkstatuschange', {
        detail: { isOnline }
      }));
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
  }

  // Setup visibility change detection
  private static setupVisibilityChange() {
    document.addEventListener('visibilitychange', () => {
      const isVisible = !document.hidden;
      console.log('[PWA] App visibility:', isVisible ? 'visible' : 'hidden');
      
      // Dispatch custom event for components to listen
      window.dispatchEvent(new CustomEvent('visibilitychange', {
        detail: { isVisible }
      }));
    });
  }

  // Request notification permission
  static async requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('[PWA] Notifications not supported');
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      console.log('[PWA] Notification permission:', permission);
      return permission;
    }

    return 'denied';
  }

  // Show notification
  static async showNotification(title: string, options?: NotificationOptions) {
    const permission = await this.requestNotificationPermission();
    
    if (permission === 'granted') {
      try {
        const notification = new Notification(title, {
          icon: '/icons/icon-192x192.png',
          badge: '/icons/icon-72x72.png',
          ...options
        });

        // Auto-close after 5 seconds
        setTimeout(() => {
          notification.close();
        }, 5000);

        return notification;
      } catch (error) {
        console.error('[PWA] Error showing notification:', error);
      }
    }
  }

  // Get device information
  static getDeviceInfo() {
    return {
      isPWA: this.isPWA(),
      isOnline: navigator.onLine,
      isSecure: window.location.protocol === 'https:',
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      hardwareConcurrency: navigator.hardwareConcurrency,
      deviceMemory: (navigator as any).deviceMemory,
      connection: (navigator as any).connection ? {
        effectiveType: (navigator as any).connection.effectiveType,
        downlink: (navigator as any).connection.downlink,
        rtt: (navigator as any).connection.rtt
      } : null
    };
  }

  // Share functionality
  static async share(data: ShareData): Promise<boolean> {
    if (navigator.share) {
      try {
        await navigator.share(data);
        return true;
      } catch (error) {
        console.error('[PWA] Share failed:', error);
        return false;
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      console.warn('[PWA] Web Share API not supported');
      return false;
    }
  }

  // Get current location
  static getCurrentLocation(): string {
    return window.location.href;
  }

  // Copy to clipboard
  static async copyToClipboard(text: string): Promise<boolean> {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return true;
      }
    } catch (error) {
      console.error('[PWA] Copy to clipboard failed:', error);
      return false;
    }
  }

  // Vibration API
  static vibrate(pattern: number | number[]): boolean {
    if ('vibrate' in navigator) {
      return navigator.vibrate(pattern);
    }
    return false;
  }

  // Geolocation
  static async getCurrentPosition(options?: PositionOptions): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
        ...options
      });
    });
  }

  // Camera access
  static async requestCamera(constraints?: MediaStreamConstraints): Promise<MediaStream> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        ...constraints
      });
      return stream;
    } catch (error) {
      console.error('[PWA] Camera access denied:', error);
      throw error;
    }
  }

  // File system access (if supported)
  static async requestFileSystemAccess(): Promise<boolean> {
    if ('showDirectoryPicker' in window) {
      try {
        await (window as any).showDirectoryPicker();
        return true;
      } catch (error) {
        console.error('[PWA] File system access denied:', error);
        return false;
      }
    }
    return false;
  }

  // Battery API (if supported)
  static async getBatteryInfo(): Promise<any> {
    if ('getBattery' in navigator) {
      try {
        const battery = await (navigator as any).getBattery();
        return {
          level: battery.level,
          charging: battery.charging,
          chargingTime: battery.chargingTime,
          dischargingTime: battery.dischargingTime
        };
      } catch (error) {
        console.error('[PWA] Battery API error:', error);
        return null;
      }
    }
    return null;
  }

  // Screen wake lock (if supported)
  static async requestWakeLock(): Promise<any> {
    if ('wakeLock' in navigator) {
      try {
        const wakeLock = await (navigator as any).wakeLock.request('screen');
        return wakeLock;
      } catch (error) {
        console.error('[PWA] Wake lock request failed:', error);
        return null;
      }
    }
    return null;
  }

  // Check if specific PWA features are supported
  static getSupportedFeatures() {
    return {
      serviceWorker: 'serviceWorker' in navigator,
      notifications: 'Notification' in window,
      push: 'PushManager' in window,
      share: 'share' in navigator,
      clipboard: 'clipboard' in navigator,
      vibration: 'vibrate' in navigator,
      geolocation: 'geolocation' in navigator,
      camera: 'mediaDevices' in navigator,
      fileSystem: 'showDirectoryPicker' in window,
      battery: 'getBattery' in navigator,
      wakeLock: 'wakeLock' in navigator,
      onlineStatus: 'onLine' in navigator,
      visibility: 'hidden' in document
    };
  }
}

export default PWAUtils;
