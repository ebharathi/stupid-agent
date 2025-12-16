'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { inSphere } from 'maath/random'

function ParticleField() {
  const ref = useRef<THREE.Points>(null)
  const count = 5000
  
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    const sphere = inSphere(new Float32Array(count * 3), { radius: 5 })
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = sphere[i * 3]
      positions[i * 3 + 1] = sphere[i * 3 + 1]
      positions[i * 3 + 2] = sphere[i * 3 + 2]
      
      // Create vibrant colors
      colors[i * 3] = Math.random() * 0.5 + 0.5 // Red
      colors[i * 3 + 1] = Math.random() * 0.3 + 0.2 // Green
      colors[i * 3 + 2] = Math.random() * 0.8 + 0.2 // Blue
    }
    
    return [positions, colors]
  }, [count])

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.05
      ref.current.rotation.y = state.clock.elapsedTime * 0.03
      ref.current.rotation.z = state.clock.elapsedTime * 0.02
    }
  })

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        vertexColors
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}

export default function ParticleBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <ParticleField />
      </Canvas>
    </div>
  )
}