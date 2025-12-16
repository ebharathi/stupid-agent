'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function HologramEffect() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const hologramRef = useRef<THREE.Mesh | null>(null)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Setup
    const scene = new THREE.Scene()
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.z = 5
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true 
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)
    rendererRef.current = renderer

    containerRef.current.appendChild(renderer.domElement)

    // Create hologram geometry
    const geometry = new THREE.IcosahedronGeometry(1.5, 3)
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0.0 },
        color1: { value: new THREE.Color(0x7c3aed) }, // Purple
        color2: { value: new THREE.Color(0x10b981) }, // Green
        color3: { value: new THREE.Color(0xf59e0b) }, // Orange
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        uniform float time;
        
        void main() {
          vUv = uv;
          vPosition = position;
          
          // Add pulsing effect
          float pulse = sin(time * 2.0 + position.y * 2.0) * 0.1;
          vec3 pos = position * (1.0 + pulse);
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color1;
        uniform vec3 color2;
        uniform vec3 color3;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          // Create hologram scan lines
          float scan = sin(vPosition.y * 20.0 + time * 5.0) * 0.5 + 0.5;
          scan = pow(scan, 3.0);
          
          // Create color gradient
          vec3 color = mix(color1, color2, vUv.x);
          color = mix(color, color3, vUv.y);
          
          // Add transparency and glow
          float alpha = 0.3 + scan * 0.3;
          color *= (0.8 + scan * 0.4);
          
          // Add edge glow
          float edge = 1.0 - smoothstep(0.8, 1.0, length(vUv - 0.5));
          color += edge * 0.5;
          
          gl_FragColor = vec4(color, alpha * 0.6);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      wireframe: false,
    })

    const hologram = new THREE.Mesh(geometry, material)
    hologramRef.current = hologram
    scene.add(hologram)

    // Add wireframe
    const wireframeGeometry = new THREE.WireframeGeometry(geometry)
    const wireframeMaterial = new THREE.LineBasicMaterial({ 
      color: 0xffffff,
      transparent: true,
      opacity: 0.3
    })
    const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial)
    hologram.add(wireframe)

    // Add floating particles
    const particleCount = 200
    const particles = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * 10
      positions[i3 + 1] = (Math.random() - 0.5) * 10
      positions[i3 + 2] = (Math.random() - 0.5) * 10

      colors[i3] = Math.random() * 0.5 + 0.5 // R
      colors[i3 + 1] = Math.random() * 0.5 + 0.5 // G
      colors[i3 + 2] = Math.random() * 0.5 + 0.5 // B
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
    })

    const particleSystem = new THREE.Points(particles, particleMaterial)
    scene.add(particleSystem)

    // Animation
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)

      if (hologramRef.current) {
        hologramRef.current.rotation.x += 0.005
        hologramRef.current.rotation.y += 0.007
        hologramRef.current.rotation.z += 0.003

        const material = hologramRef.current.material as THREE.ShaderMaterial
        material.uniforms.time.value += 0.016
      }

      if (particleSystem) {
        particleSystem.rotation.y += 0.001
      }

      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return
      
      cameraRef.current.aspect = window.innerWidth / window.innerHeight
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      
      if (containerRef.current && rendererRef.current?.domElement) {
        containerRef.current.removeChild(rendererRef.current.domElement)
      }
      
      window.removeEventListener('resize', handleResize)
      
      // Dispose Three.js objects
      geometry.dispose()
      material.dispose()
      wireframeGeometry.dispose()
      wireframeMaterial.dispose()
      particles.dispose()
      particleMaterial.dispose()
    }
  }, [])

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 pointer-events-none -z-10"
      style={{ opacity: 0.7 }}
    />
  )
}