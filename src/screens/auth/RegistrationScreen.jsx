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
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const initialFormData = {
  name: '',
  email: '',
  password: '',
};

const RegistrationScreen = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [avatar, setAvatar] = useState(null);
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [isSecureEntry, setIsSecureEntry] = useState(true);
  const [dimensions, setDimensions] = useState(Dimensions.get('window').width - 20 * 2);

  // const dispatch = useDispatch();

  useEffect(() => {
    const onChange = () => {
      const width = Dimensions.get('window').width - 20 * 2;
      setDimensions(width);
    };
    Dimensions.addEventListener('change', onChange);
    return () => {
      Dimensions.removeEventListener('change', onChange);
    };
  }, []);

  const keyboardHide = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
    console.log(formData);
    setFormData(initialFormData);
  };

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0,
    });

    if (!result.cancelled) {
      setAvatar(result.uri);
    }
  };

  const deleteAvatar = async () => {
    setAvatar(null);
  };

  const toggleSecureEntry = () => setIsSecureEntry(!isSecureEntry);

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <View style={styles.container}>
        <ImageBackground
          style={styles.bgImg}
          source={require('../../../assets/images/bg/mainBg.jpg')}
        >
          <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
            <View style={styles.formWrapper}>
              <View style={{ ...styles.form, marginBottom: isShowKeyboard ? 32 : 78 }}>
                <View style={styles.avatarWrapper}>
                  <View style={{ overflow: 'hidden', borderRadius: 16 }}>
                    <ImageBackground
                      style={styles.avatar}
                      source={require('../../../assets/images/user/defaultAvatar.jpg')}
                    >
                      {avatar && <Image style={styles.avatar} source={{ uri: avatar }} />}
                    </ImageBackground>
                  </View>
                  {avatar ? (
                    <TouchableOpacity
                      style={{ ...styles.avatarBtn, borderColor: '#BDBDBD' }}
                      onPress={deleteAvatar}
                    >
                      <MaterialIcons name="close" size={26} color="#BDBDBD" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity style={styles.avatarBtn} onPress={pickAvatar}>
                      <MaterialIcons name="add" size={26} color="#FF6C00" />
                    </TouchableOpacity>
                  )}
                </View>

                <Text style={styles.title}>Registration</Text>
                <View style={{ position: 'relative' }}>
                  <TextInput
                    style={styles.input}
                    placeholder="Name"
                    value={formData.name}
                    onFocus={() => setIsShowKeyboard(true)}
                    onChangeText={value =>
                      setFormData(prevFormData => ({ ...prevFormData, name: value }))
                    }
                  />
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
                  <TouchableOpacity style={styles.signUpBtn} activeOpacity={0.7} onPress={null}>
                    <Text style={styles.signUpBtnTitle}>Sign up</Text>
                  </TouchableOpacity>

                  {!isShowKeyboard && (
                    <TouchableOpacity style={{ marginTop: 16 }} activeOpacity={0.7} onPress={null}>
                      <Text style={styles.loginNavBtnTitle}>Already have an account? Log in</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default RegistrationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
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
  avatarWrapper: {
    position: 'absolute',
    alignSelf: 'center',
    top: -60,
    zIndex: 100,
  },
  avatar: {
    width: 120,
    height: 120,
    resizeMode: 'cover',
  },
  avatarBtn: {
    position: 'absolute',
    bottom: 10,
    right: -16,
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FF6C00',
    borderRadius: 50,
  },
  form: {
    marginHorizontal: 16,
    paddingTop: 80,
  },
  title: {
    marginBottom: 33,
    fontFamily: 'Roboto-Medium',
    fontSize: 24,
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
  loginNavBtnTitle: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    textAlign: 'center',
    color: '#1B4371',
  },
});