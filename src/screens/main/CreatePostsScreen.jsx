import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { Octicons, MaterialIcons, EvilIcons } from '@expo/vector-icons';

import { Camera, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as Location from 'expo-location';

const CreatePostsScreen = ({ navigation }) => {
  const [type, setType] = useState(CameraType.back);
  const [camera, setCamera] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState(null);
  // const [address, setAddress] = useState(null);
  // const [addressValue, setAddressValue] = useState(null);
  const [title, setTitle] = useState('');
  const [keyboardShown, setKeyboardShown] = useState(false);

  // const { userId, name } = useSelector(state => state.auth);

  useEffect(() => {
    (async () => {
      await Camera.requestCameraPermissionsAsync();
      await Location.requestForegroundPermissionsAsync();
      await MediaLibrary.requestPermissionsAsync();

      const location = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync({
        longitude: location.coords.longitude,
        latitude: location.coords.latitude,
      });
      setLocation(location);
      setAddress(...address);
    })();
  }, []);

  const toggleCameraType = () => {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  };

  const takePhoto = async () => {
    if (!camera) return;
    try {
      const photo = await camera.takePictureAsync();
      await MediaLibrary.createAssetAsync(photo.uri);
      setPhoto(photo.uri);
    } catch (error) {
      console.log(error);
    }
  };

  const cancelPhoto = () => {
    setPhoto(null);
    setTitle('');
    setAddressValue(null);
  };

  const sendPost = () => {
    if (!photo || !title || !addressValue) return;
    // createPost();
    navigation.navigate('Home');
    setPhoto(null);
    setTitle('');
    setAddressValue(null);
  };

  const keyboardHide = () => {
    setKeyboardShown(false);
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={keyboardHide}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' && 'padding'}>
          <View>
            {photo && location ? (
              <View style={styles.photoContainer}>
                <TouchableOpacity style={styles.cancelPhotoButton} onPress={cancelPhoto}>
                  <MaterialIcons name="close" size={40} color="#BDBDBD" />
                </TouchableOpacity>
                <Image style={styles.photo} source={{ uri: photo }} />
              </View>
            ) : (
              <Camera
                style={styles.camera}
                type={type}
                flashMode="auto"
                ref={ref => setCamera(ref)}
              >
                <TouchableOpacity style={styles.cameraTypeButton} onPress={toggleCameraType}>
                  {type === CameraType.back ? (
                    <MaterialIcons name="camera-front" size={32} color="#BDBDBD" />
                  ) : (
                    <MaterialIcons name="camera-rear" size={32} color="#BDBDBD" />
                  )}
                </TouchableOpacity>
                <TouchableOpacity style={styles.cameraSnapButton} onPress={takePhoto}>
                  <MaterialIcons name="camera-alt" size={32} color="#BDBDBD" />
                </TouchableOpacity>
              </Camera>
            )}
            <View style={{ marginTop: 8, marginHorizontal: 16 }}>
              {photo ? (
                <Text
                  style={{
                    fontFamily: 'Roboto-Regular',
                    fontSize: 16,
                    color: '#BDBDBD',
                  }}
                >
                  Edit photo
                </Text>
              ) : (
                <Text
                  style={{
                    fontFamily: 'Roboto-Regular',
                    fontSize: 16,
                    color: '#BDBDBD',
                  }}
                >
                  Upload photo
                </Text>
              )}
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                style={{ ...styles.input, marginBottom: 16 }}
                placeholder="Name..."
                onFocus={() => setKeyboardShown(true)}
                value={title}
                onChangeText={setTitle}
              />
              <TextInput
                style={{ ...styles.input, paddingLeft: 30 }}
                placeholder="Location..."
                editable={false}
                onFocus={() => setKeyboardShown(true)}
                value={addressValue && `${addressValue?.city}, ${addressValue?.name}`}
              />
              <TouchableOpacity
                style={{ position: 'absolute', top: 76, left: 5 }}
                activeOpacity={0.8}
                onPress={() => setAddressValue(address)}
              >
                {/* <EvilIcons name="location" size={40} color="#BDBDBD" /> */}
                <Octicons name="location" size={40} color="#BDBDBD" />
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity style={styles.sendButton} activeOpacity={0.8} onPress={sendPost}>
                <Text style={styles.sendButtonTitle}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default CreatePostsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-end',
  },
  camera: {
    position: 'relative',
    height: 440,
    marginHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  cameraTypeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 50,
    opacity: 0.5,
  },
  cameraSnapButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
    opacity: 0.5,
  },
  photoContainer: {
    position: 'relative',
    height: 440,
    marginHorizontal: 16,
    marginTop: 32,
    borderRadius: 8,
  },
  photo: {
    height: 440,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  cancelPhotoButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 100,
  },
  inputWrapper: {
    position: 'relative',
    marginTop: 20,
  },
  input: {
    height: 50,
    marginHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    color: '#212121',
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    marginHorizontal: 16,
    marginTop: 50,
    marginBottom: 40,
    backgroundColor: '#FF6C00',
    borderRadius: 100,
  },
  sendButtonTitle: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    color: '#fff',
  },
});
