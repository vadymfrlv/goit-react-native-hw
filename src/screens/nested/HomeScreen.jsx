import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Octicons } from '@expo/vector-icons';

import db from '../../../firebase/config';

const HomeScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);

  const [userLikes, setUserLikes] = useState('no');
  const [likeCount, setLikeCount] = useState(0);

  const { name, email, avatar } = useSelector(state => state.auth);

  useEffect(() => {
    getAllPosts();
  }, []);

  const getAllPosts = async () => {
    await db
      .firestore()
      .collection('posts')
      .onSnapshot(data =>
        setPosts(
          data.docs
            .map(doc => ({ ...doc.data(), id: doc.id }))
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        )
      );
  };

  const likeUnlike = async postId => {
    if (userLikes === 'no') {
      setUserLikes('yes');
      setLikeCount(+1);
      createLike(postId);
    } else {
      setUserLikes('no');
      setLikeCount(0 ? 0 : -1);
      createLike(postId);
    }
  };

  const createLike = async postId => {
    const data = await db.firestore().collection('posts').doc(postId).get();
    const { likes } = data.data();
    await db
      .firestore()
      .collection('posts')
      .doc(postId)
      .update({ likes: (likes ? likes : 0) + likeCount });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.avatarWrapper}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('Profile')}
      >
        <View style={{ overflow: 'hidden', borderRadius: 16 }}>
          <ImageBackground
            style={styles.avatar}
            source={require('../../../assets/images/user/defaultAvatar.jpg')}
          >
            {avatar && <Image style={styles.avatar} source={{ uri: avatar }} />}
          </ImageBackground>
        </View>
        <View style={styles.userInfoWrapper}>
          <Text style={styles.userName}>{name}</Text>
          <Text style={styles.userEmail}>{email}</Text>
        </View>
      </TouchableOpacity>

      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.postsContainer}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                navigation.navigate('Comments', {
                  postId: item.id,
                  photo: item.photo,
                  allComments: item.comments,
                })
              }
            >
              <Image style={styles.postImage} source={{ uri: item.photo }} />
            </TouchableOpacity>
            <View style={styles.postImageInfoWrapper}>
              <Text style={styles.postImageTitle}>{item.description}</Text>
            </View>

            <View style={styles.postInfoContainer}>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  style={{ ...styles.postInfoBtn, marginRight: 25 }}
                  activeOpacity={0.7}
                  onPress={() =>
                    navigation.navigate('Comments', {
                      postId: item.id,
                      photo: item.photo,
                      allComments: item.comments,
                    })
                  }
                >
                  <Octicons
                    name="comment-discussion"
                    size={24}
                    color={item.comments?.length ? '#FF6C00' : '#BDBDBD'}
                  />
                  <Text style={styles.postInfoText}>{item.comments?.length || 0}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.postInfoBtn}
                  activeOpacity={0.7}
                  // onPress={() => createLike(item.id)}
                  onPress={() => likeUnlike(item.id)}
                >
                  <Octicons name="heart" size={24} color={item.likes ? '#FF6C00' : '#BDBDBD'} />
                  <Text style={styles.postInfoText}>{item.likes || 0}</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.postInfoBtn}
                activeOpacity={0.7}
                onPress={() =>
                  navigation.navigate('Map', {
                    location: item.location,
                  })
                }
              >
                <Octicons name="location" size={24} color="#BDBDBD" />
                <Text style={styles.postInfoText}>{item.place}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  avatarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 32,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    borderRadius: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    resizeMode: 'cover',
  },
  userInfoWrapper: {
    marginLeft: 10,
  },
  userName: {
    fontFamily: 'Roboto-Bold',
    fontSize: 15,
    color: '#212121',
  },
  userEmail: {
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
    color: '#212121',
  },
  postsContainer: {
    marginHorizontal: 16,
  },
  postImage: {
    height: 240,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  postImageInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  postImageTitle: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    color: '#212121',
    marginBottom: 8,
  },
  postInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  postInfoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postInfoText: {
    marginLeft: 10,
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    color: '#656565',
  },
});
