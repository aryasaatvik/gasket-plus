"use client"
import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

export function GasketMesh() {
  const meshRef = useRef<THREE.Mesh>(null!)
  const groupRef = useRef<THREE.Group>(null!)

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5
    }
  })

  const createGasketGeometry = () => {
    const shape = new THREE.Shape()

    // Outer contour
    shape.moveTo(48.4803, 52.4246)
    shape.lineTo(55.2424, 36.6306)
    shape.bezierCurveTo(55.4525, 36.1253, 55.6626, 35.6013, 55.8346, 35.0774)
    shape.bezierCurveTo(57.5537, 30.2119, 57.6683, 25.0845, 56.2357, 20.2377)
    shape.lineTo(51.9378, 3.90101)
    shape.bezierCurveTo(51.8614, 3.50803, 51.7276, 3.13377, 51.5366, 2.7595)
    shape.bezierCurveTo(51.1355, 1.97354, 50.5433, 1.29986, 49.7984, 0.813317)
    shape.bezierCurveTo(48.6713, 0.0834987, 47.2769, -0.159774, 45.9589, 0.102212)
    shape.lineTo(29.493, 2.51623)
    shape.bezierCurveTo(26.5704, 2.79693, 23.7052, 3.56417, 20.9927, 4.85539)
    shape.bezierCurveTo(18.3375, 6.12789, 15.9689, 7.79338, 13.9823, 9.7957)
    shape.lineTo(1.85259, 21.0985)
    shape.bezierCurveTo(1.54696, 21.3418, 1.26044, 21.6225, 1.03121, 21.9219)
    shape.bezierCurveTo(0.477258, 22.6143, 0.133424, 23.4564, 0.0379146, 24.3172)
    shape.bezierCurveTo(-0.134002, 25.6646, 0.286239, 26.9932, 1.14582, 28.0225)
    shape.lineTo(12.0912, 42.0949)
    shape.bezierCurveTo(13.7722, 44.2095, 15.797, 46.0621, 18.0892, 47.5591)
    shape.bezierCurveTo(20.0949, 48.8504, 22.2534, 49.8422, 24.4883, 50.5158)
    shape.lineTo(41.8711, 55.6994)
    shape.bezierCurveTo(42.3868, 55.8866, 42.9217, 55.9988, 43.4947, 55.9988)
    shape.bezierCurveTo(44.3925, 56.0175, 45.2903, 55.8117, 46.0735, 55.3813)
    shape.bezierCurveTo(47.2578, 54.7638, 48.1174, 53.6784, 48.4803, 52.4246)

    // Inner hole
    const holePath = new THREE.Path()
    holePath.moveTo(14.2688, 35.4891)
    holePath.bezierCurveTo(9.49335, 25.8704, 13.5812, 14.3056, 23.3995, 9.62728)
    holePath.bezierCurveTo(29.9133, 6.52087, 37.3439, 7.25069, 42.979, 10.8998)
    holePath.bezierCurveTo(45.8252, 12.7524, 48.2129, 15.3348, 49.8175, 18.5535)
    holePath.bezierCurveTo(54.5929, 28.1722, 50.5051, 39.737, 40.6867, 44.4153)
    holePath.bezierCurveTo(34.173, 47.5217, 26.7424, 46.7919, 21.1073, 43.1428)
    holePath.bezierCurveTo(18.2611, 41.2902, 15.8734, 38.7077, 14.2688, 35.4891)

    shape.holes.push(holePath)

    const extrudeSettings = {
      steps: 2,
      depth: 3,
      bevelEnabled: true,
      bevelThickness: 0.4,
      bevelSize: 0.2,
      bevelOffset: 0,
      bevelSegments: 3
    }

    return new THREE.ExtrudeGeometry(shape, extrudeSettings)
  }

  useEffect(() => {
    if (meshRef.current) {
      const geometry = createGasketGeometry()
      geometry.computeBoundingBox()
      const center = new THREE.Vector3()
      geometry.boundingBox!.getCenter(center)
      geometry.translate(-center.x, -center.y, -center.z)
      geometry.scale(1.8, 1.8, 1.8)
      meshRef.current.geometry = geometry
    }
  }, [])
  return (
    <group ref={groupRef}>
      <mesh ref={meshRef}>
        <meshStandardMaterial
          color="#303F9F"
          metalness={0.9}
          roughness={0.1}
          envMapIntensity={1}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

function Text3D() {
  const meshRef = useRef<THREE.Mesh>(null!)
  const font = useLoader(FontLoader, 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json')

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.geometry.center()
      // Prevent the text from being affected by camera movements
      meshRef.current.onBeforeRender = (renderer, scene, camera) => {
        meshRef.current.quaternion.copy(camera.quaternion)
      }
    }
  }, [])

  const textGeometry = new TextGeometry('Gasket', {
    font: font,
    size: 14,
    height: 2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.3,
    bevelSize: 0.3,
    bevelOffset: 0,
    bevelSegments: 5
  })

  return (
    <>
    <pointLight position={[0, 80, 20]} intensity={1} color="#FFFFFF" />
    <mesh ref={meshRef} geometry={textGeometry} position={[0, 70, 0]}>
      <meshPhongMaterial color="#303F9F" specular="#FFFFFF" shininess={70} />
    </mesh>
    </>
  )
}

export function GasketScene() {
  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[0, 0, 175]} fov={50} />
      <ambientLight intensity={0.5} />
      <pointLight position={[50, 50, 50]} intensity={1} />
      <spotLight position={[-50, -50, -50]} angle={0.3} penumbra={1} intensity={1} castShadow />
      <GasketMesh />
      <OrbitControls enableZoom={false} enableRotate={true} enablePan={false} rotateSpeed={0.5} minPolarAngle={Math.PI / 2} maxPolarAngle={Math.PI / 2} />
      <Environment preset="studio" />
    </Canvas>
  )
}