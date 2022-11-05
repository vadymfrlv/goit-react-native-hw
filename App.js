import { useState, useEffect, useCallback } from 'react';
import { Provider } from 'react-redux';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { AppLoading } from 'expo';
import { StatusBar } from 'expo-status-bar';
import RegistrationScreen from './src/screens/auth/RegistrationScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import { KeyboardAvoidingView, Platform, View } from 'react-native';

SplashScreen.preventAutoHideAsync();

// const loadApplication = async () => {
//   await Font.loadAsync({
//     'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
//     'Roboto-Medium': require('./assets/fonts/Roboto-Medium.ttf'),
//     'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
//   });
// };

export default function App() {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync({
          'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
          'Roboto-Medium': require('./assets/fonts/Roboto-Medium.ttf'),
          'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
        });
      } catch (error) {
        console.warn(error);
      } finally {
        setIsAppReady(true);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (isAppReady) {
      await SplashScreen.hideAsync();
    }
  }, [isAppReady]);

  if (!isAppReady) {
    return null;
  }

  // if (!isReady) {
  //   return (
  //     <AppLoading
  //       startAsync={loadApplication}
  //       onFinish={() => setIsReady(true)}
  //       onError={console.warn}
  //     />
  //   );
  // }

  return (
    // <Provider>
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <RegistrationScreen />
      {/* <LoginScreen /> */}
      <StatusBar style="auto" />
    </View>
    // </Provider>
  );
}
