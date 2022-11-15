import { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';
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
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(null);
  const [place, setPlace] = useState(null);
  const [placeValue, setPlaceValue] = useState(null);
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);

  // const { userId, name } = useSelector(state => state.auth);

  useEffect(() => {
    (async () => {
      await Camera.requestCameraPermissionsAsync();
      await Location.requestForegroundPermissionsAsync();
      await MediaLibrary.requestPermissionsAsync();

      const location = await Location.getCurrentPositionAsync({});
      const place = await Location.reverseGeocodeAsync({
        longitude: location.coords.longitude,
        latitude: location.coords.latitude,
      });
      setLocation(location);
      setPlace(...place);
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
  };

  const remove = () => {
    setPhoto(null);
    setDescription(null);
    setPlace(null);
  };

  const sendPost = () => {
    if (!photo || !title || !addressValue) return;
    // createPost();
    navigation.navigate('Home');
    setPhoto(null);
    setTitle('');
    setPlaceValue(null);
  };

  const keyboardHide = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={keyboardHide}>
        <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
          {photo ? (
            <View style={styles.photoContainer}>
              <TouchableOpacity style={styles.retakePhotoBtn} onPress={cancelPhoto}>
                <Octicons name="x" size={45} color="#F6F6F6" />
              </TouchableOpacity>
              <Image style={styles.photo} source={{ uri: photo }} />
            </View>
          ) : (
            <Camera style={styles.camera} type={type} flashMode="auto" ref={ref => setCamera(ref)}>
              <TouchableOpacity style={styles.cameraTypeButton} onPress={toggleCameraType}>
                <Octicons name="sync" size={30} color="#F6F6F6" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.cameraSnapButton} onPress={takePhoto}>
                <Octicons name="issue-opened" size={50} color="#F6F6F6" />
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
                Take a photo
              </Text>
            )}
          </View>
          <View style={styles.inputWrapper}>
            <TextInput
              style={{ ...styles.input, marginBottom: 16 }}
              placeholder="Description..."
              onFocus={() => setIsShowKeyboard(true)}
              value={description}
              onChangeText={setDescription}
            />

            <TextInput
              style={{ ...styles.input, paddingLeft: 28 }}
              placeholder="Place..."
              editable={false}
              onChangeText={() => setPlaceValue(place)}
              value={placeValue && `${placeValue?.city}, ${placeValue?.country}`}
            />
            <TouchableOpacity
              style={{ position: 'absolute', top: 77, left: 16 }}
              activeOpacity={0.7}
              onPress={() => setPlaceValue(place)}
            >
              <Octicons name="location" size={25} color="#CECDCD" />
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              style={{
                ...styles.sendBtn,
                backgroundColor: photo && description && place ? '#FF6C00' : '#F6F6F6',
              }}
              disabled={!photo || !description || !place}
              activeOpacity={0.7}
              onPress={sendPost}
            >
              <Text
                style={{
                  ...styles.sendBtnTitle,
                  color: photo && description && place ? '#fff' : '#BDBDBD',
                }}
              >
                Share
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.remove}
            disabled={!photo && !description && !place}
            activeOpacity={0.7}
            onPress={remove}
          >
            <Octicons name="trash" size={30} color="#BDBDBD" />
          </TouchableOpacity>
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
    justifyContent: 'flex-start',
  },
  camera: {
    position: 'relative',
    height: 240,
    marginTop: 32,
    marginHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'flex-end',
    alignItems: 'center',
    overflow: 'hidden',
  },
  cameraTypeButton: {
    position: 'absolute',
    top: 10,
    right: 13,
    opacity: 0.7,
  },
  cameraSnapButton: {
    marginBottom: 20,
    opacity: 0.7,
  },
  photoContainer: {
    position: 'relative',
    marginHorizontal: 16,
    height: 240,
    marginTop: 32,
  },
  photo: {
    position: 'relative',
    height: 240,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  retakePhotoBtn: {
    position: 'absolute',
    top: 2,
    right: 11,
    opacity: 0.7,
    zIndex: 1,
  },
  inputWrapper: {
    position: 'relative',
    marginTop: 32,
  },
  input: {
    height: 50,
    marginHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    color: '#656565',
  },
  sendBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    marginHorizontal: 16,
    marginTop: 50,
    marginBottom: 50,
    marginBottom: 120,
    borderRadius: 100,
  },
  sendBtnTitle: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
  },
  remove: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: 80,
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 20,
    backgroundColor: '#F6F6F6',
  },
});
