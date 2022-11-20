import { useDispatch } from 'react-redux';
import { TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { Octicons, Entypo, Ionicons } from '@expo/vector-icons';

import HomeScreen from '../nested/HomeScreen';
import CommentsScreen from '../nested/CommentsScreen';
import MapScreen from '../nested/MapScreen';

import { authLogoutUser } from '../../../redux/auth/authOperations';

const NestedStack = createStackNavigator();

const PostsScreen = () => {
  const dispatch = useDispatch();

  const logout = () => dispatch(authLogoutUser());

  return (
    <NestedStack.Navigator>
      <NestedStack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Posts',
          headerRight: () => (
            <TouchableOpacity style={{ marginRight: 10 }} onPress={logout}>
              <Octicons name="sign-out" size={24} color="#BDBDBD" />
            </TouchableOpacity>
          ),
        }}
      />
      <NestedStack.Screen
        name="Comments"
        component={CommentsScreen}
        options={({ navigation }) => ({
          title: 'Comments',
          headerLeft: () => (
            <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => navigation.goBack()}>
              {/* <Ionicons name="arrow-back" size={36} color="#BDBDBD" /> */}
              <Octicons name="arrow-left" size={27} color="#8F8F8F" />
            </TouchableOpacity>
          ),
        })}
      />
      <NestedStack.Screen
        name="Map"
        component={MapScreen}
        options={({ navigation }) => ({
          title: 'Map',
          headerLeft: () => (
            <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => navigation.goBack()}>
              {/* <Ionicons name="arrow-back" size={36} color="#BDBDBD" /> */}
              <Octicons name="arrow-left" size={27} color="#8F8F8F" />
            </TouchableOpacity>
          ),
        })}
      />
    </NestedStack.Navigator>
  );
};

export default PostsScreen;
