import 'dotenv/config';
export default{
    expo: {
      name: "Bike Components Manager",
      description: "Bike components manager helps you to track everything about your bike's components",
      version: "1.0.14", 
      ios: {
        supportsTablet: true
      },
      
      slug: "bikeComponentsManager",
      scheme: "bikecomponentsmanager",
      android: {
        package: "com.bike_components_manager",
        permissions: [],
      },
      splash: {
        image: "./App/assets/splash.png",
        backgroundColor: "#F44336"
      },
      icon: "./App/assets/icon.png",
      extra: {
        eas: {
          projectId: "71924f02-c39e-4fc7-af6b-ddb691a6fc4b"
        }
      },
    }
  }