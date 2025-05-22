// // LegendaryDragonScene.tsx
// "use client";

// import React, { useRef, useEffect, Suspense, JSX } from "react";
// import { Canvas, useFrame, useThree } from "@react-three/fiber";
// import {
//   OrbitControls,
//   useGLTF,
//   useAnimations,
//   Stage,
//   Environment,
// } from "@react-three/drei";
// import gsap from "gsap";
// import { Group, PointLight } from "three";

// useGLTF.preload("/models/dragon_rigged.glb");

// function DragonModel(): JSX.Element {
//   const group = useRef<Group>(null);
//   const lightRef = useRef<PointLight>(null);

//   const { scene, animations } = useGLTF("/models/dragon_rigged.glb");
//   const { actions } = useAnimations(animations, group);

//   useEffect(() => {
//     if (actions && animations.length > 0) {
//       const firstAction = actions[animations[0].name];
//       firstAction?.reset().play();
//     }

//     if (group.current) {
//       gsap.fromTo(
//         group.current.position,
//         { y: -10, z: -20 },
//         { y: 0, z: 0, duration: 3 }
//       );
//       gsap.fromTo(
//         group.current.rotation,
//         { y: Math.PI },
//         { y: 0, duration: 3 }
//       );
//     }
//   }, [actions, animations]);

//   useFrame((state) => {
//     const t = state.clock.getElapsedTime();
//     if (group.current) {
//       group.current.position.y = Math.sin(t * 2) * 0.2;
//       group.current.rotation.y += 0.001;
//     }
//     if (lightRef.current) {
//       lightRef.current.intensity = 1 + Math.sin(t * 3) * 0.5;
//     }
//   });

//   return (
//     <group ref={group} scale={1.5} position={[0, 0, 0]}>
//       <primitive object={scene} />
//       <pointLight
//         ref={lightRef}
//         color={"#00ffff"}
//         intensity={1.5}
//         distance={20}
//         position={[0, 2, 5]}
//       />
//     </group>
//   );
// }

// function CameraDrift(): JSX.Element {
//   const { camera } = useThree();
//   useFrame(({ clock }) => {
//     const t = clock.getElapsedTime();
//     camera.position.x = Math.sin(t / 5) * 10;
//     camera.position.z = Math.cos(t / 5) * 10;
//     camera.lookAt(0, 0, 0);
//   });
//   return <></>;
// }

// export default function LegendaryDragonScene(): JSX.Element {
//   return (
//     <Canvas
//       shadows
//       camera={{ position: [0, 2, 10], fov: 50 }}
//       style={{ height: "100vh", width: "100vw", background: "#0b0c1e" }}
//     >
//       <ambientLight intensity={0.3} />
//       <directionalLight intensity={1} position={[5, 10, 5]} castShadow />
//       <Suspense
//         fallback={
//           <mesh>
//             <sphereGeometry args={[0.5, 32, 32]} />
//             <meshStandardMaterial color="hotpink" />
//           </mesh>
//         }
//       >
//         <Environment preset="sunset" />
//         <Stage environment="sunset" intensity={0.7} shadows adjustCamera>
//           <DragonModel />
//         </Stage>
//         <CameraDrift />
//       </Suspense>

//       <OrbitControls enableZoom={false} enablePan={false} />
//     </Canvas>
//   );
// }
