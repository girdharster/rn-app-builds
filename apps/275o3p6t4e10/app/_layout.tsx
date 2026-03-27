import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{
      headerStyle: {
        backgroundColor: '#87CEEB',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}>
      <Stack.Screen name="index" options={{ title: 'Flappy Bird' }} />
      <Stack.Screen name="game" options={{ title: 'Playing...', headerShown: false }} />
    </Stack>
  );
}