import 'dotenv/config';
export default{
    expo: {
      name: "Bike Components Manager",
      description: "Bike components manager helps you to track everything about your bike's components",
      version: "1.0.10", 
      ios: {
        supportsTablet: true
      },
      
      slug: "bikeComponentsManager",
      scheme: "bikecomponentsmanager",
      android: {
        package: "com.bike_components_manager",
        permissions: [],
        versionCode:27
      },
      splash: {
        image: "./App/assets/splash.png",
        backgroundColor: "#F44336"
      },
      icon: "./App/assets/icon.png",
      extra: {
        apiKey: process.env.API_KEY,
        authDomain: process.env.AUTH_DOMAIN,
        projectId: process.env.PROJECT_ID,
        storageBucket: process.env.STORAGE_BUCKET,
        messagingSenderId: process.env.MESSAGING_SENDER_ID,
        appId: process.env.APP_ID,
        measurementId: process.env.MEASUREMENT_ID,
        stravaClientId: process.env.STRAVA_APP_CLIEND_ID,
        stravaSecret: process.env.STRAVA_APP_SEC,
        stravaAccPwdSec: process.env.STRAVA_ACC_PWD_SEC,
        useProxyAuthServer: true
      },
    }
  }