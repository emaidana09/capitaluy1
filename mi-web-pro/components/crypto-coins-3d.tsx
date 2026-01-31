"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { useRef, useMemo } from "react"
import { Float, MeshDistortMaterial } from "@react-three/drei"
import * as THREE from "three"

function createSymbolTexture(symbol: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas")
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext("2d")!
  ctx.clearRect(0, 0, 256, 256)
  ctx.fillStyle = "rgba(0, 0, 0, 0)"
  ctx.fillRect(0, 0, 256, 256)
  ctx.fillStyle = "white"
  ctx.font = "bold 180px system-ui, Arial, sans-serif"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText(symbol, 128, 128)
  const texture = new THREE.CanvasTexture(canvas)
  texture.flipY = false
  texture.needsUpdate = true
  return texture
}

function Coin({
  position,
  color,
  symbol,
  scale = 1,
  rotationSpeed = 0.01,
}: {
  position: [number, number, number]
  color: string
  symbol: string
  scale?: number
  rotationSpeed?: number
}) {
  const groupRef = useRef<THREE.Group>(null)
  const texture = useMemo(() => createSymbolTexture(symbol), [symbol])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += rotationSpeed
      groupRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={groupRef} position={position} scale={scale}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1, 1, 0.15, 32]} />
          <meshStandardMaterial
            color={color}
            metalness={0.8}
            roughness={0.2}
            emissive={color}
            emissiveIntensity={0.2}
          />
        </mesh>
        <mesh position={[0, 0, 0.1]} scale={0.6} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.5, 0.1, 16, 32]} />
          <meshStandardMaterial
            color={color}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        <mesh position={[0, 0, 0.09]}>
          <planeGeometry args={[0.6, 0.6]} />
          <meshBasicMaterial
            map={texture}
            transparent
            alphaTest={0.5}
            toneMapped={false}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </Float>
  )
}

function FloatingSphere({
  position,
  color,
  scale = 0.3,
}: {
  position: [number, number, number]
  color: string
  scale?: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.2
    }
  })

  return (
    <Float speed={3} rotationIntensity={1} floatIntensity={1}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshDistortMaterial
          color={color}
          distort={0.4}
          speed={2}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    </Float>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#22c55e" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#15803d" />
      <spotLight
        position={[0, 10, 0]}
        angle={0.3}
        penumbra={1}
        intensity={1}
        color="#22c55e"
      />

      {/* USDT - Gold */}
      <Coin position={[2.5, 0, 0]} color="#f59e0b" symbol="$" scale={0.8} rotationSpeed={0.015} />

      {/* USDT - Blue */}
      <Coin position={[-2.5, 0.5, -1]} color="#627eea" symbol="$" scale={0.6} rotationSpeed={0.012} />

      {/* USDT - Silver */}
      <Coin position={[0, -0.5, 1]} color="#bfbfbf" symbol="$" scale={0.5} rotationSpeed={0.018} />

      {/* Decorative floating spheres */}
      <FloatingSphere position={[3.5, 1.5, -2]} color="#22c55e" scale={0.2} />
      <FloatingSphere position={[-3.5, -1, 1]} color="#15803d" scale={0.25} />
      <FloatingSphere position={[1, 2, -1]} color="#22c55e" scale={0.15} />
      <FloatingSphere position={[-1.5, 1.5, 0.5]} color="#4ade80" scale={0.18} />
    </>
  )
}

export default function CryptoCoins3D() {
  return (
    <div className="w-full h-[400px] relative">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <Scene />
      </Canvas>
    </div>
  )
}
