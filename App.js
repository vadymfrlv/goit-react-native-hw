import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import RegistrationScreen from './src/screens/auth/RegistrationScreen';

export default function App() {
  return (
    <>
      <RegistrationScreen />
      <StatusBar style="auto" />
    </>
  );
}
