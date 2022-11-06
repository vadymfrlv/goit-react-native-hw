import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import RegistrationScreen from './src/screens/auth/RegistrationScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import HomeScreen from './src/screens/main/Home';
import PostsScreen from './src/screens/main/PostsScreen';
import CreatePostsScreen from './src/screens/main/CreatePostsScreen';
import ProfileScreen from './src/screens/main/ProfileScreen';

const AuthStack = createStackNavigator();
const MainTab = createBottomTabNavigator();

const useRoute = isAuth => {
  if (!isAuth) {
    return (
      <AuthStack.Navigator>
        <AuthStack.Screen
          options={{
            headerShown: false,
            ...TransitionPresets.ModalPresentationIOS,
          }}
          name="Login"
          component={LoginScreen}
        />
        <AuthStack.Screen
          options={{
            headerShown: false,
            ...TransitionPresets.ModalPresentationIOS,
          }}
          name="Registration"
          component={RegistrationScreen}
        />
      </AuthStack.Navigator>
    );
  }

  return (
    <MainTab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveBackgroundColor: '#FF6C00',
        tabBarStyle: {
          alignItems: 'center',
        },
        tabBarItemStyle: {
          marginHorizontal: 30,
          marginTop: 2,
          marginBottom: 2,
          borderRadius: 20,
        },
      }}
    >
      <MainTab.Screen
        name="Posts"
        component={PostsScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons name="grid-outline" size={24} color={focused ? '#FFFFFF' : '#212121'} />
          ),
        }}
      />
      <MainTab.Screen
        name="Create"
        component={CreatePostsScreen}
        options={({ navigation }) => ({
          title: 'Create a post',
          headerLeft: () => (
            <TouchableOpacity
              style={{ marginLeft: 10 }}
              onPress={() => navigation.navigate('Home')}
            >
              <Ionicons name="arrow-back" size={36} color="#BDBDBD" />
            </TouchableOpacity>
          ),
          tabBarIcon: ({ focused }) => (
            <Ionicons name="add-outline" size={32} color={focused ? '#FFFFFF' : '#212121'} />
          ),
        })}
      />
      <MainTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons name="person-outline" size={24} color={focused ? '#FFFFFF' : '#212121'} />
          ),
        }}
      />
    </MainTab.Navigator>
  );
};

export default useRoute;
