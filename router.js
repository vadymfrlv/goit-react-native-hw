import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HeaderBackButton } from '@react-navigation/elements';
import { Octicons } from '@expo/vector-icons';

import RegistrationScreen from './src/screens/auth/RegistrationScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
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
        headerShown: true,
        headerLeftContainerStyle: {
          paddingLeft: 16,
        },
        headerRightContainerStyle: {
          paddingRight: 16,
        },
        tabBarStyle: {
          height: 80,
          paddingTop: 9,
          borderTopWidth: 1,
        },
        headerStyle: {
          borderBottomWidth: 1,
          borderColor: '#8F8F8F',
        },
        headerTitleStyle: {
          color: '#212121',
          fontFamily: 'Roboto-Medium',
          fontSize: 17,
        },
        tabBarItemStyle: {
          marginHorizontal: 35,
          borderRadius: 20,
          alignItems: 'center',
          justifyContent: 'center',
        },
      }}
    >
      <MainTab.Screen
        name="Posts"
        component={PostsScreen}
        options={{
          tabBarIcon: ({ focused, size }) => (
            <Octicons name="apps" size={size} color={focused ? '#fff' : '#8F8F8F'} />
          ),
        }}
      />
      <MainTab.Screen
        name="Create"
        component={CreatePostsScreen}
        options={({ navigation }) => ({
          title: 'Create a post',
          headerLeft: () => (
            <HeaderBackButton
              onPress={() => navigation.navigate('Posts', { screen: 'Posts' })}
              backImage={() => <Octicons name="arrow-left" size={27} color="#8F8F8F" />}
            />
          ),
          tabBarIcon: ({ focused, size }) => (
            <Octicons name="plus" size={size} color={focused ? '#fff' : '#8F8F8F'} />
          ),
          tabBarStyle: {
            display: 'none',
          },
        })}
      />
      <MainTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, size }) => (
            <Octicons name="person" size={size} color={focused ? '#fff' : '#8F8F8F'} />
          ),
        }}
      />
    </MainTab.Navigator>
  );
};

export default useRoute;
