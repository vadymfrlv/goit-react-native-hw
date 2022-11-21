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
import { Octicons } from '@expo/vector-icons';
import { Camera, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as Location from 'expo-location';

import db from '../../../firebase/config';

const initialPostData = {
  photo: '',
  description: '',
  place: '',
};

const CreatePostsScreen = ({ navigation }) => {
  const [postData, setPostData] = useState(initialPostData);

  const [camera, setCamera] = useState(null);
  const [location, setLocation] = useState(null);
  const [type, setType] = useState(CameraType.back);
  const [isPostDataReady, setIsPostDataReady] = useState(true);
  const [isDisableTrash, setIsDisableTrash] = useState(true);
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);

  const { userId, name } = useSelector(state => state.auth);

  useEffect(() => {
    (async () => {
      await Camera.requestCameraPermissionsAsync();
      await MediaLibrary.requestPermissionsAsync();

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  useEffect(() => {
    const postDataReady = Object.values(postData).every(value => value !== '');
    setIsPostDataReady(!postDataReady);

    const isPostDataToRemove = Object.values(postData).some(value => value !== '');
    setIsDisableTrash(!isPostDataToRemove);
  }, [postData]);

  const handleInput = (type, value) => {
    setPostData(prevState => ({ ...prevState, [type]: value }));
  };

  const toggleCameraType = () => {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  };

  const takePhoto = async () => {
    try {
      const photo = await camera.takePictureAsync();
      await MediaLibrary.createAssetAsync(photo.uri);
      setPostData(prevState => ({ ...prevState, photo: photo.uri }));
    } catch (error) {
      console.log(error);
    }
  };

  const retakePhoto = () => {
    setPostData(prevState => ({ ...prevState, photo: '' }));
  };

  const removeAll = () => {
    setPostData(initialPostData);
  };

  const uploadPhotoToServer = async () => {
    const response = await fetch(postData.photo);
    const file = await response.blob();
    const postId = Date.now().toString();
    await db.storage().ref(`postImages/${postId}`).put(file);
    const processedPhoto = await db.storage().ref('postImages').child(postId).getDownloadURL();
    return processedPhoto;
  };

  const createPost = async () => {
    const createdAt = new Date();
    const photo = await uploadPhotoToServer();
    await db.firestore().collection('posts').add({
      photo,
      description: postData.description,
      place: postData.place,
      location: location.coords,
      userId,
      name,
      createdAt: createdAt.toLocaleString(),
    });
  };

  const sendPost = () => {
    createPost();
    navigation.navigate('Posts');
    setPostData(initialPostData);
  };

  const keyboardHide = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={keyboardHide}>
        <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
          {postData.photo ? (
            <View style={styles.photoContainer}>
              <TouchableOpacity style={styles.retakePhotoBtn} onPress={retakePhoto}>
                <Octicons name="x" size={45} color="#F6F6F6" />
              </TouchableOpacity>
              <Image style={styles.photo} source={{ uri: postData.photo }} />
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
            {postData.photo ? (
              <Text
                style={{
                  fontFamily: 'Roboto-Regular',
                  fontSize: 16,
                  color: '#BDBDBD',
                }}
              >
                Reshot
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
              value={postData.description}
              onChangeText={value => handleInput('description', value)}
            />
            <TextInput
              style={{ ...styles.input, paddingLeft: 28 }}
              placeholder="Place..."
              onFocus={() => setIsShowKeyboard(true)}
              value={postData.place}
              onChangeText={value => handleInput('place', value)}
            />
            <Octicons
              name="location"
              size={25}
              style={{ position: 'absolute', top: 77, left: 16, color: '#CECDCD' }}
            />
          </View>
          <View>
            <TouchableOpacity
              style={{
                ...styles.sendBtn,
                backgroundColor: !isPostDataReady ? '#FF6C00' : '#F6F6F6',
              }}
              disabled={isPostDataReady}
              activeOpacity={0.7}
              onPress={sendPost}
            >
              <Text
                style={{
                  ...styles.sendBtnTitle,
                  color: !isPostDataReady ? '#fff' : '#BDBDBD',
                }}
              >
                Share
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.removeAll}
            disabled={isDisableTrash}
            activeOpacity={0.7}
            onPress={removeAll}
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
  removeAll: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: 80,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 30,
    borderRadius: 20,
    backgroundColor: '#F6F6F6',
  },
});
