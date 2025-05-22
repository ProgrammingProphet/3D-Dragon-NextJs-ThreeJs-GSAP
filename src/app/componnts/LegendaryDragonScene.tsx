// AnimatedDragonScene.tsx
"use client";

import React, { useRef, useEffect, Suspense, JSX } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html, Preload, Sparkles } from '@react-three/drei';
import gsap from 'gsap';
import { PointLight, Group, AudioListener, AudioLoader, PositionalAudio } from 'three';
import { useLoader } from '@react-three/fiber';

const fireSound = '/sounds/dragon-roar.mp3';

useGLTF.preload('/models/dragon_rigged.glb');

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

function AuraParticles() {
  return (
    <Sparkles
      count={80}
      speed={0.3}
      size={3}
      color="#00ffff"
      // color="blue"

      opacity={0.5}
      scale={[4, 4, 4]}
      position={[0, 0, -0.5]}
    />
  );
}

function SoundEffects({ groupRef }: { groupRef: React.RefObject<Group> }) {
  const listener = new AudioListener();
  const sound = useRef<PositionalAudio>(null);
  const buffer = useLoader(AudioLoader, fireSound);

  useEffect(() => {
    if (sound.current && buffer && groupRef.current) {
      sound.current.setBuffer(buffer);
      sound.current.setRefDistance(10);
      sound.current.setLoop(true);
      sound.current.setVolume(0.5);
      sound.current.play();
      groupRef.current.add(listener);
    }
  }, [buffer]);

  return <positionalAudio ref={sound} args={[listener]} />;
}

function AnimatedDragon(): JSX.Element {
  const ref = useRef<Group>();
  const lightRef = useRef<PointLight>(null);

  const { scene } = useGLTF('/models/dragon_rigged.glb');

  useEffect(() => {
    if (ref.current) {
      gsap.fromTo(ref.current.position, { y: -5, z: -10 }, { y: 0, z: 0, duration: 3, ease: 'power3.out' });
      gsap.fromTo(ref.current.rotation, { y: Math.PI }, { y: 0, duration: 3, ease: 'power2.out' });
    }
  }, []);

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
        <SoundEffects groupRef={ref} />
      </group>
      <pointLight ref={lightRef} color="#00ffff" intensity={1.2} position={[0, 2, 5]} />
      <AuraParticles />
    </>
  );
}

function AnimatedText(): JSX.Element {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current) {
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: -50 },
        { opacity: 1, y: 0, duration: 2, delay: 1, ease: 'power3.out' }
      );
    }
  }, []);

  return (
    <Html center className='center'>
      <div
        ref={textRef}
        style={{
          color: '#ffffff',
          fontSize: '2rem',
          fontWeight: 'bold',
          textAlign: 'center',
          // fontFamily: 'Fantasy',
          background: 'rgba(0,0,0,0.4)',
          padding: '1rem 2rem',
          borderRadius: '12px',
        }}
      >
        Legendary Dragon
      </div>
    </Html>
  );
}

export default function AnimatedModelScene(): JSX.Element {
  return (
    
    <Canvas
      camera={{ position: [0, 2, 10], fov: 50 }}
      style={{ background: '#060612', width: '100vw', height: '100vh' }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1} color="#ffffff" />
      <Suspense fallback={<Html center><div style={{ color: 'white' }}>Loading Dragon...</div></Html>}>
        <AnimatedDragon />
        {/* <AnimatedText /> */}
        <Preload all />
      </Suspense>
      <OrbitControls enableZoom enablePan={false} autoRotate autoRotateSpeed={0.8} />
    </Canvas>
  );
}
