import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const initialState = {
  nickname: '',
  email: '',
  password: '',
};

const RegistrationScreen = () => {
  const [state, setState] = useState(initialState);

  return (
    <TouchableWithoutFeedback>
      <View style={styles.container}>
        <ImageBackground
          style={styles.image}
          source={require('../../../assets/images/bg/mainBg.jpg')}
        ></ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default RegistrationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
  },
});
