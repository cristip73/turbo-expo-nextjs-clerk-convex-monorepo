import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useUser } from '@clerk/clerk-expo';

// Importăm ecranele
import LoginScreen from '../screens/LoginScreen';
import NotesDashboardScreen from '../screens/NotesDashboardScreen';
import CreateNoteScreen from '../screens/CreateNoteScreen';
import InsideNoteScreen from '../screens/InsideNoteScreen';

// Creăm Stack Navigator fără type parameters
const Stack = createNativeStackNavigator();

const Navigation = () => {
  const { isSignedIn, isLoaded } = useUser();

  // Dacă Clerk nu s-a încărcat încă, afișăm un loading screen
  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <Text style={{ fontSize: 20 }}>Se încarcă...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        // @ts-ignore - ignorăm eroarea linter pentru proprietatea id
        initialRouteName={isSignedIn ? "NotesDashboardScreen" : "LoginScreen"}
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'white' }
        }}
      >
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="NotesDashboardScreen" component={NotesDashboardScreen} />
        <Stack.Screen name="CreateNoteScreen" component={CreateNoteScreen} />
        <Stack.Screen name="InsideNoteScreen" component={InsideNoteScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
