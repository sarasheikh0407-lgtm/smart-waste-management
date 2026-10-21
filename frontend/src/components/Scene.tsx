import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshTransmissionMaterial, ContactShadows } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import type { Mesh } from 'three';
import { useReducedMotion } from 'framer-motion';

function Orb(){
 const mesh=useRef<Mesh>(null); const reduced=useReducedMotion();
 useFrame((state,delta)=>{if(mesh.current&&!reduced){mesh.current.rotation.y+=delta*.12;mesh.current.rotation.x=Math.sin(state.clock.elapsedTime*.3)*.08;}});
 return <Float speed={reduced?0:1.1} rotationIntensity={.12} floatIntensity={reduced?0:.28}>
  <mesh ref={mesh} position={[0,0,0]}>
   <icosahedronGeometry args={[1.42,5]}/>
   <MeshTransmissionMaterial backside samples={4} resolution={256} thickness={.5} roughness={.18} transmission={.82} ior={1.24} chromaticAberration={.035} anisotropy={.25} color="#b9d99b"/>
  </mesh>
  <mesh rotation={[.7,.3,.5]}><torusGeometry args={[1.85,.018,12,160]}/><meshStandardMaterial color="#557e42" metalness={.65} roughness={.25}/></mesh>
  <mesh rotation={[-.6,.5,-.3]}><torusGeometry args={[2.08,.009,8,160]}/><meshStandardMaterial color="#b2c99d"/></mesh>
  <mesh position={[1.45,.9,.2]}><sphereGeometry args={[.09,24,24]}/><meshStandardMaterial color="#f08b58" emissive="#f08b58" emissiveIntensity={.25}/></mesh>
 </Float>
}
export default function Scene(){
 const reduced=useReducedMotion();
 return <div className="scene-wrap" aria-label="Abstract 3D green glass planet representing a connected, cleaner city" role="img">
  <Canvas dpr={[1,1.5]} camera={{position:[0,0,6.5],fov:38}} gl={{alpha:true,antialias:true,powerPreference:'low-power'}} frameloop={reduced?'demand':'always'}>
   <ambientLight intensity={1.3}/><directionalLight position={[3,4,4]} intensity={2.4} color="#fff4df"/><pointLight position={[-3,-2,2]} intensity={1.8} color="#8fbd69"/>
   <Suspense fallback={null}><Orb/><ContactShadows position={[0,-2.05,0]} opacity={.15} scale={7} blur={3}/></Suspense>
  </Canvas><div className="scene-caption"><span className="pulse-dot"/> CITY SYSTEM / 01</div>
 </div>
}
