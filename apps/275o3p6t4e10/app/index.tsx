import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function HomeScreen() {
  const router = useRouter();

  const startGame = () => {
    router.push('/game');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Sky background */}
      <View style={styles.sky}>
        {/* Game Title */}
        <Text style={styles.title}>FLAPPY</Text>
        <Text style={styles.title}>BIRD</Text>
        
        {/* Bird display */}
        <View style={styles.birdContainer}>
          <View style={styles.bird} />
        </View>
        
        {/* Start button */}
        <TouchableOpacity style={styles.startButton} onPress={startGame}>
          <Text style={styles.startButtonText}>TAP TO START</Text>
        </TouchableOpacity>
        
        {/* Instructions */}
        <Text style={styles.instructions}>
          Tap to make the bird fly{"\n"}
          Avoid the pipes!
        </Text>
      </View>
      
      {/* Ground */}
      <View style={styles.ground} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sky: {
    flex: 1,
    backgroundColor: '#87CEEB',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFD700',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
    marginVertical: 5,
  },
  birdContainer: {
    marginVertical: 40,
  },
  bird: {
    width: 40,
    height: 30,
    backgroundColor: '#FFD700',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#FFA500',
  },
  startButton: {
    backgroundColor: '#32CD32',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#228B22',
    marginVertical: 20,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  instructions: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  ground: {
    height: 80,
    backgroundColor: '#DEB887',
    borderTopWidth: 3,
    borderTopColor: '#CD853F',
  },
});