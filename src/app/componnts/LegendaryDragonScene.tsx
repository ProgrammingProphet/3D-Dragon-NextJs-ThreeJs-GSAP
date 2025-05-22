'use client';

import React, { useRef, useEffect, Suspense, JSX } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html, Preload, Sparkles } from '@react-three/drei';
import gsap from 'gsap';
import {
  PointLight,
  Group,
  Object3DEventMap,
  AudioListener,
  AudioLoader,
  PositionalAudio,
} from 'three';

useGLTF.preload('/models/dragon_rigged.glb');

// 🔥 Fire under the mouth
function FireParticles() {
  return (
    <Sparkles
      count={100}
      speed={0.1}
      size={5}
      color="orange"
      opacity={0.5}
      scale={[0, 0, 1]}
      position={[0, -0.2, 3.2]}
    />
  );
}

// 🔥 Fire on body
function FireParticlesBody() {
  return (
    <Sparkles
      count={100}
      speed={0.5}
      size={10}
      color="blue"
      opacity={0.5}
      scale={[5, 1, 4]}
      position={[0, 0, -2]}
    />
  );
}

// 🔵 Aura
function AuraParticles() {
  return (
    <Sparkles
      count={80}
      speed={0.3}
      size={3}
      color="#00ffff"
      opacity={0.5}
      scale={[4, 4, 4]}
      position={[0, 0, -0.5]}
    />
  );
}

// 🔊 Dragon Sound Effect Hook
function useDragonSound(groupRef: React.RefObject<Group<Object3DEventMap>| null>) {
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
      if (sound.isPlaying) sound.stop();
      groupRef.current?.remove(sound);
      camera.remove(listener);
      sound.disconnect(); // ✅ modern cleanup
    };
  }, [groupRef, camera]);
}

// 🐉 Animated Dragon with Fire, Aura & Sound
function AnimatedDragon(): JSX.Element {
  const ref = useRef<Group<Object3DEventMap>>(null);
  const lightRef = useRef<PointLight | null>(null);
  const { scene } = useGLTF('/models/dragon_rigged.glb');

  // 🔊 Setup sound
  useDragonSound(ref);

  // 🎞️ Animate in
  useEffect(() => {
    if (ref.current) {
      gsap.fromTo(ref.current.position, { y: -5, z: -10 }, { y: 0, z: 0, duration: 3, ease: 'power3.out' });
      gsap.fromTo(ref.current.rotation, { y: Math.PI }, { y: 0, duration: 3, ease: 'power2.out' });
    }
  }, []);

  // 🌀 Loop animation + light
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.y += 0.002;
      ref.current.position.y = Math.sin(t) * 0.2;
    }
    if (lightRef.current) {
      lightRef.current.intensity = 1 + Math.sin(t * 2) * 0.3;
    }
  });

  return (
    <>
      <group ref={ref}>
        <primitive object={scene} scale={2} />
        <FireParticles />
        <FireParticlesBody />
      </group>

      <pointLight ref={lightRef} color="#00ffff" intensity={1.2} position={[0, 2, 5]} />
      <AuraParticles />
    </>
  );
}

// 🎬 Scene with Canvas, Camera, Lights, Orbit & Suspense
export default function LegendaryDragonScene(): JSX.Element {
  return (
    <Canvas
      camera={{ position: [0, 2, 10], fov: 50 }}
      style={{ background: '#060612', width: '100vw', height: '100vh' }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1} color="#ffffff" />
      <Suspense
        fallback={
          <Html center>
            <div style={{ color: 'white' }}>Loading Dragon...</div>
          </Html>
        }
      >
        <AnimatedDragon />
        <Preload all />
      </Suspense>
      <OrbitControls enableZoom enablePan={false} autoRotate autoRotateSpeed={0.8} />
    </Canvas>
  );
}
