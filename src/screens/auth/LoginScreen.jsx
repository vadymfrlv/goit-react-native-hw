import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

const initialFormData = {
  email: '',
  password: '',
};

const LoginScreen = ({ navigation }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [isSecureEntry, setIsSecureEntry] = useState(true);
  const [dimensions, setDimensions] = useState(Dimensions.get('window').width - 20 * 2);

  // const dispatch = useDispatch();

  useEffect(() => {
    const onChange = () => {
      const width = Dimensions.get('window').width - 20 * 2;
      setDimensions(width);
    };
    const dimensionsSubscription = Dimensions.addEventListener('change', onChange);

    return () => {
      dimensionsSubscription?.remove();
    };
  }, []);

  const handleSubmit = () => {
    console.log('click');
    console.log(formData);
    setIsShowKeyboard(false);
    Keyboard.dismiss();
    // dispatch(authSignInUser(state));
    setFormData(initialFormData);
  };

  const keyboardHide = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
  };

  const toggleSecureEntry = () => setIsSecureEntry(!isSecureEntry);

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <ImageBackground
        style={styles.bgImg}
        source={require('../../../assets/images/bg/mainBg.jpg')}
      >
        <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
          <View style={styles.formWrapper}>
            <View
              style={{
                ...styles.form,
                marginBottom: isShowKeyboard ? 32 : 144,
                width: dimensions,
              }}
            >
              <Text style={styles.title}>Log in</Text>
              <View style={{ position: 'relative' }}>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={formData.email}
                  onFocus={() => setIsShowKeyboard(true)}
                  onChangeText={value =>
                    setFormData(prevFormData => ({ ...prevFormData, email: value }))
                  }
                />
                <TextInput
                  style={{ ...styles.input, marginBottom: 0 }}
                  placeholder="Password"
                  value={formData.password}
                  secureTextEntry={isSecureEntry}
                  onFocus={() => setIsShowKeyboard(true)}
                  onChangeText={value =>
                    setFormData(prevFormData => ({ ...prevFormData, password: value }))
                  }
                />
                {formData.password && (
                  <TouchableOpacity
                    style={styles.showPasswordBtn}
                    activeOpacity={0.7}
                    onPress={toggleSecureEntry}
                  >
                    {isSecureEntry ? (
                      <Ionicons name="eye" size={30} color="#BDBDBD" />
                    ) : (
                      <Ionicons name="eye-off" size={30} color="#BDBDBD" />
                    )}
                  </TouchableOpacity>
                )}
              </View>

              <View>
                {!isShowKeyboard && (
                  <>
                    <TouchableOpacity
                      style={styles.signUpBtn}
                      activeOpacity={0.7}
                      onPress={handleSubmit}
                    >
                      <Text style={styles.signUpBtnTitle}>Log in</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{ marginTop: 16 }}
                      activeOpacity={0.7}
                      onPress={() => navigation.navigate('Registration')}
                    >
                      <Text style={styles.signUpNavBtnTitle}>Don't have an account? Sign up</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  bgImg: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'flex-end',
  },
  formWrapper: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  form: {
    marginHorizontal: 20,
    paddingTop: 32,
  },
  title: {
    marginBottom: 32,
    fontFamily: 'Roboto-Medium',
    fontSize: 30,
    textAlign: 'center',
    textTransform: 'uppercase',
    color: '#212121',
  },
  input: {
    height: 50,
    paddingLeft: 16,
    marginBottom: 16,
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    color: '#212121',
    backgroundColor: '#F6F6F6',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 8,
  },
  showPasswordBtn: {
    position: 'absolute',
    bottom: 10,
    right: 20,
  },
  signUpBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    marginTop: 43,
    backgroundColor: '#FF6C00',
    borderRadius: 100,
  },
  signUpBtnTitle: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    color: '#fff',
  },
  signUpNavBtnTitle: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    textAlign: 'center',
    color: '#1B4371',
  },
});
