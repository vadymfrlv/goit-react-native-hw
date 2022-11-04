import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

export default function App() {
  const [value, setValue] = useState('');

  const inputHandler = text => setValue(text);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.text}>TEST</Text>
        <Text style={styles.text}>🥹</Text>

        <KeyboardAvoidingView // определяем ОС и настраиваем поведение клавиатуры
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        >
          <TextInput
            style={styles.input}
            placeholder="Type text"
            value={value}
            onChangeText={inputHandler}
            textAlign={'center'}
          />
        </KeyboardAvoidingView>
        <StatusBar style="auto" />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 50,
    marginBottom: 20,
  },
  input: {
    width: 180,
    padding: 15,
    fontSize: 15,
    borderWidth: 2,
    borderColor: 'blue',
    borderRadius: 7,
  },
});
