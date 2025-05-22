// components/SoundEffects.tsx
import { useEffect, RefObject } from 'react';
import { Group, AudioListener, AudioLoader, PositionalAudio, Object3DEventMap } from 'three';
import { useThree } from '@react-three/fiber';

interface SoundEffectsProps {
  groupRef: RefObject<Group<Object3DEventMap> | null>;
}

export default function SoundEffects({ groupRef }: SoundEffectsProps): null {
  const { camera } = useThree();

  useEffect(() => {
    if (!groupRef.current) return;

    const listener = new AudioListener();
    camera.add(listener);

    const sound = new PositionalAudio(listener);
    const loader = new AudioLoader();

    loader.load('/sounds/dragon-roar.mp3', (buffer) => {
      sound.setBuffer(buffer);
      sound.setRefDistance(10);
      sound.setLoop(true);
      sound.setVolume(0.5);
      sound.play();
    });

    groupRef.current.add(sound);

    return () => {
      groupRef.current?.remove(sound);
      sound.stop();
      camera.remove(listener);
    };
  }, [groupRef, camera]);

  return null;
}
