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
import { EvilIcons } from '@expo/vector-icons';
import db from '../../../firebase/config';

const HomeScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);

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

  const createLike = async postId => {
    const data = await db.firestore().collection('posts').doc(postId).get();
    const { likes } = data.data();
    await db
      .firestore()
      .collection('posts')
      .doc(postId)
      .update({ likes: (likes ? likes : 0) + 1 });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.avatarWrapper}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('User')}
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
          <View style={styles.postContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate('Comments', {
                  postId: item.id,
                  photo: item.photo,
                  title: item.title,
                  allComments: item.comments,
                })
              }
            >
              <Image style={styles.postImage} source={{ uri: item.photo }} />
            </TouchableOpacity>
            <View style={styles.postImageInfoWrapper}>
              <Text style={styles.postImageTitle}>{item.title}</Text>
              <Text style={styles.postImageAuthor}>Автор: {item.name}</Text>
            </View>
            <View style={styles.postInfoContainer}>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  style={{ ...styles.postInfoButton, marginRight: 24 }}
                  activeOpacity={0.8}
                  onPress={() =>
                    navigation.navigate('Comments', {
                      postId: item.id,
                      photo: item.photo,
                      title: item.title,
                      allComments: item.comments,
                    })
                  }
                >
                  <EvilIcons
                    name="comment"
                    size={32}
                    color={item.comments?.length ? '#FF6C00' : '#BDBDBD'}
                  />
                  <Text style={styles.postInfoText}>{item.comments?.length || 0}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.postInfoButton}
                  activeOpacity={0.8}
                  onPress={() => createLike(item.id)}
                >
                  <EvilIcons name="like" size={36} color={item.likes ? '#FF6C00' : '#BDBDBD'} />
                  <Text style={styles.postInfoText}>{item.likes || 0}</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.postInfoButton}
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate('Map', {
                    location: item.location,
                  })
                }
              >
                <EvilIcons name="location" size={32} color="#BDBDBD" />
                <Text style={styles.postInfoText}>
                  {`${item.address?.city}, ${item.address?.country}`}
                </Text>
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
    marginVertical: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
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
    fontSize: 13,
    color: '#212121',
  },
  userEmail: {
    fontFamily: 'Roboto-Regular',
    fontSize: 11,
    color: '#212121',
  },
  postContainer: {
    marginHorizontal: 16,
    marginVertical: 16,
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
  },
  postImageAuthor: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    color: '#BDBDBD',
  },
  postInfoContainer: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  postInfoButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postInfoText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    color: '#212121',
  },
});
