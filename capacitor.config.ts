import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.torquesmart.app',
  appName: 'Torquesmart',
  webDir: 'client/build',
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
    cleartext: true,
    allowNavigation: ['*']
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#0f0f0f",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      spinnerStyle: "large",
      spinnerColor: "#00ff88"
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0f0f0f'
    },
    App: {
      appendUserAgent: 'Torquesmart/1.0'
    }
  }
};

export default config;
