import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BIRD_SIZE = 30;
const PIPE_WIDTH = 60;
const PIPE_GAP = 200;
const GRAVITY = 0.6;
const JUMP_FORCE = -12;
const PIPE_SPEED = 3;
const GROUND_HEIGHT = 80;
const GAME_HEIGHT = SCREEN_HEIGHT - GROUND_HEIGHT;

interface Pipe {
  x: number;
  topHeight: number;
  bottomY: number;
  passed: boolean;
}

export default function GameScreen() {
  const router = useRouter();
  const [birdY, setBirdY] = useState(GAME_HEIGHT / 2);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const pipeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const createPipe = useCallback(() => {
    const topHeight = Math.random() * (GAME_HEIGHT - PIPE_GAP - 100) + 50;
    const bottomY = topHeight + PIPE_GAP;
    
    return {
      x: SCREEN_WIDTH,
      topHeight,
      bottomY,
      passed: false,
    };
  }, []);

  const jump = useCallback(() => {
    if (gameOver) return;
    
    if (!gameStarted) {
      setGameStarted(true);
      setBirdVelocity(JUMP_FORCE);
    } else {
      setBirdVelocity(JUMP_FORCE);
    }
  }, [gameStarted, gameOver]);

  const checkCollision = useCallback((birdY: number, pipes: Pipe[]) => {
    // Check ground collision
    if (birdY > GAME_HEIGHT - BIRD_SIZE || birdY < 0) {
      return true;
    }

    // Check pipe collision
    const birdX = 50;
    for (const pipe of pipes) {
      if (
        birdX + BIRD_SIZE > pipe.x &&
        birdX < pipe.x + PIPE_WIDTH &&
        (birdY < pipe.topHeight || birdY + BIRD_SIZE > pipe.bottomY)
      ) {
        return true;
      }
    }

    return false;
  }, []);

  const gameLoop = useCallback(() => {
    if (!gameStarted || gameOver) return;

    setBirdY(prevY => {
      const newY = prevY;
      return newY;
    });

    setBirdVelocity(prevVelocity => {
      const newVelocity = prevVelocity + GRAVITY;
      setBirdY(prevY => {
        const newY = prevY + newVelocity;
        return newY;
      });
      return newVelocity;
    });

    setPipes(prevPipes => {
      const updatedPipes = prevPipes
        .map(pipe => ({ ...pipe, x: pipe.x - PIPE_SPEED }))
        .filter(pipe => pipe.x > -PIPE_WIDTH);

      // Check for scoring
      updatedPipes.forEach(pipe => {
        if (!pipe.passed && pipe.x + PIPE_WIDTH < 50) {
          pipe.passed = true;
          setScore(prevScore => prevScore + 1);
        }
      });

      return updatedPipes;
    });
  }, [gameStarted, gameOver]);

  // Main game loop
  useEffect(() => {
    if (gameStarted && !gameOver) {
      gameLoopRef.current = setInterval(gameLoop, 16);
    } else {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameLoop, gameStarted, gameOver]);

  // Pipe generation
  useEffect(() => {
    if (gameStarted && !gameOver) {
      pipeTimerRef.current = setInterval(() => {
        setPipes(prevPipes => [...prevPipes, createPipe()]);
      }, 2000);
    }

    return () => {
      if (pipeTimerRef.current) {
        clearInterval(pipeTimerRef.current);
      }
    };
  }, [gameStarted, gameOver, createPipe]);

  // Collision detection
  useEffect(() => {
    if (checkCollision(birdY, pipes)) {
      setGameOver(true);
      Alert.alert(
        'Game Over!',
        `Score: ${score}`,
        [
          { text: 'Home', onPress: () => router.back() },
          { text: 'Restart', onPress: resetGame }
        ]
      );
    }
  }, [birdY, pipes, score, checkCollision, router]);

  const resetGame = () => {
    setBirdY(GAME_HEIGHT / 2);
    setBirdVelocity(0);
    setPipes([]);
    setScore(0);
    setGameStarted(false);
    setGameOver(false);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={jump} activeOpacity={1}>
      <StatusBar style="light" />
      
      {/* Sky */}
      <View style={styles.gameArea}>
        {/* Score */}
        <Text style={styles.score}>{score}</Text>
        
        {/* Start instruction */}
        {!gameStarted && (
          <Text style={styles.startText}>TAP TO START</Text>
        )}
        
        {/* Bird */}
        <View
          style={[
            styles.bird,
            {
              top: birdY,
              transform: [{ rotate: `${Math.min(birdVelocity * 3, 30)}deg` }]
            }
          ]}
        />
        
        {/* Pipes */}
        {pipes.map((pipe, index) => (
          <View key={index}>
            {/* Top pipe */}
            <View
              style={[
                styles.pipe,
                {
                  left: pipe.x,
                  top: 0,
                  height: pipe.topHeight,
                }
              ]}
            />
            {/* Bottom pipe */}
            <View
              style={[
                styles.pipe,
                {
                  left: pipe.x,
                  top: pipe.bottomY,
                  height: GAME_HEIGHT - pipe.bottomY,
                }
              ]}
            />
          </View>
        ))}
      </View>
      
      {/* Ground */}
      <View style={styles.ground} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gameArea: {
    flex: 1,
    backgroundColor: '#87CEEB',
    position: 'relative',
  },
  score: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    left: SCREEN_WIDTH / 2 - 20,
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
    zIndex: 10,
  },
  startText: {
    position: 'absolute',
    top: GAME_HEIGHT / 2 - 100,
    alignSelf: 'center',
    left: SCREEN_WIDTH / 2 - 80,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
    zIndex: 10,
  },
  bird: {
    position: 'absolute',
    left: 50,
    width: BIRD_SIZE,
    height: BIRD_SIZE,
    backgroundColor: '#FFD700',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#FFA500',
    zIndex: 5,
  },
  pipe: {
    position: 'absolute',
    width: PIPE_WIDTH,
    backgroundColor: '#32CD32',
    borderWidth: 2,
    borderColor: '#228B22',
  },
  ground: {
    height: GROUND_HEIGHT,
    backgroundColor: '#DEB887',
    borderTopWidth: 3,
    borderTopColor: '#CD853F',
  },
});