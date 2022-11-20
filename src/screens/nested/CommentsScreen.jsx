import { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ImageBackground,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import db from '../../../firebase/config';

export default function CommentsScreen({ route }) {
  const { postId, photo, allComments } = route.params;

  const [comments, setComments] = useState(allComments || []);
  const [newComment, setNewComment] = useState('');
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);

  const { userId, name, avatar } = useSelector(state => state.auth);

  const keyboardHide = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
  };

  const createComment = async () => {
    const createdAt = new Date().toLocaleString('en', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });

    newComment.trim() &&
      (await db
        .firestore()
        .collection('posts')
        .doc(postId)
        .update({
          comments: [
            ...comments,
            {
              newComment,
              name,
              // avatar: avatar ? avatar : null,
              avatar,
              userId,
              createdAt,
            },
          ],
        }));

    const data = await db.firestore().collection('posts').doc(postId).get();
    setComments(data.data().comments);

    keyboardHide();
    setNewComment('');
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' && 'padding'}>
      <TouchableWithoutFeedback onPress={keyboardHide}>
        <View style={styles.postImageContainer}>
          <Image style={styles.postImage} source={{ uri: photo }} />
        </View>
      </TouchableWithoutFeedback>
      {comments && (
        <SafeAreaView style={styles.commentsListContainer}>
          <FlatList
            data={comments}
            keyExtractor={(item, idx) => idx.toString()}
            renderItem={({ item }) => {
              const currentUser = userId === item.userId;
              return (
                <View
                  style={{
                    ...styles.commentContainer,
                    flexDirection: currentUser ? 'row-reverse' : 'row',
                  }}
                >
                  <View
                    style={{
                      ...styles.avatarContainer,
                      marginRight: currentUser ? 0 : 10,
                      marginLeft: currentUser ? 10 : 0,
                    }}
                  >
                    <ImageBackground
                      style={styles.avatar}
                      source={require('../../../assets/images/user/defaultAvatar.jpg')}
                    >
                      {item.avatar && <Image style={styles.avatar} source={{ uri: item.avatar }} />}
                    </ImageBackground>
                  </View>
                  <View
                    style={{
                      ...styles.comment,
                      backgroundColor: currentUser
                        ? 'rgba(0, 0, 255, 0.03)'
                        : 'rgba(0, 0, 0, 0.03)',
                      borderTopLeftRadius: currentUser ? 20 : 0,
                      borderTopRightRadius: currentUser ? 0 : 20,
                    }}
                  >
                    <Text
                      style={{
                        ...styles.commentAuthor,
                        textAlign: currentUser ? 'right' : 'left',
                      }}
                    >
                      {currentUser ? 'Вы' : item.name}
                    </Text>
                    <Text style={styles.commentMessage}>{item.newComment}</Text>
                    <Text
                      style={{
                        ...styles.commentDate,
                        textAlign: currentUser ? 'left' : 'right',
                      }}
                    >
                      {item.createdAt}
                    </Text>
                  </View>
                </View>
              );
            }}
          />
        </SafeAreaView>
      )}
      <View
        style={{
          ...styles.inputWrapper,
          marginBottom: isShowKeyboard ? 100 : 10,
        }}
      >
        <TextInput
          style={styles.input}
          placeholder="Комментировать..."
          onFocus={() => setIsShowKeyboard(true)}
          value={newComment}
          onChangeText={setNewComment}
        />
        <TouchableOpacity
          style={styles.addCommentButton}
          activeOpacity={0.8}
          onPress={createComment}
        >
          <AntDesign name="arrowup" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-end',
  },
  postImageContainer: {
    marginHorizontal: 16,
    marginTop: 32,
  },
  postImage: {
    height: 240,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  postImageTitle: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    color: '#212121',
  },
  commentsListContainer: {
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
  },
  commentContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    overflow: 'hidden',
    borderRadius: 50,
  },
  avatar: {
    width: 50,
    height: 50,
    resizeMode: 'cover',
    borderRadius: 50,
  },
  comment: {
    padding: 16,
    borderRadius: 20,
  },
  commentAuthor: {
    marginBottom: 8,
    fontFamily: 'Roboto-Medium',
    fontSize: 13,
    color: '#212121',
  },
  commentMessage: {
    marginBottom: 8,
    fontFamily: 'Roboto-Regular',
    fontSize: 13,
    color: '#212121',
  },
  commentDate: {
    fontFamily: 'Roboto-Regular',
    fontSize: 10,
    color: '#BDBDBD',
  },
  inputWrapper: {
    position: 'relative',
    marginHorizontal: 16,
  },
  input: {
    justifyContent: 'center',
    height: 50,
    paddingLeft: 16,
    paddingRight: 60,
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    color: '#212121',
    backgroundColor: '#F6F6F6',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  addCommentButton: {
    position: 'absolute',
    right: 10,
    bottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    backgroundColor: '#FF6C00',
    borderRadius: 50,
  },
});
