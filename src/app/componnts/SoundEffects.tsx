// components/SoundEffects.tsx

import { useEffect, RefObject } from 'react';
import { Group, AudioListener, AudioLoader, PositionalAudio } from 'three';
import { useThree } from '@react-three/fiber';

interface SoundEffectsProps {
  groupRef: RefObject<Group>;
}

export default function SoundEffects({ groupRef }: SoundEffectsProps): null {
  const { camera } = useThree();

  useEffect(() => {
    if (!groupRef.current || !camera) return;

    // Create AudioListener and attach to camera
    const listener = new AudioListener();
    camera.add(listener);

    // Create PositionalAudio
    const sound = new PositionalAudio(listener);
    const audioLoader = new AudioLoader();

    // Load and play sound
    audioLoader.load('/sounds/dragon-roar.mp3', (buffer) => {
      sound.setBuffer(buffer);
      sound.setRefDistance(10);
      sound.setLoop(false);
      sound.setVolume(0.7);
      groupRef.current?.add(sound);
      sound.play();
    });

    // 🧹 Cleanup function
    return () => {
      if (sound.isPlaying) sound.stop();
      sound.disconnect(); // ✅ Disconnect from audio context
      groupRef.current?.remove(sound);
      camera.remove(listener);
    };
  }, [groupRef, camera]);

  return null;
}
