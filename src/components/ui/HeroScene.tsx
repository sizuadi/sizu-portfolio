import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

/** Track normalized mouse position (-1 to 1) */
function useMousePosition() {
  const mouse = useRef({ x: 0, y: 0 });

  if (typeof window !== "undefined") {
    // Set up listener once via module-level flag
    if (!(window as any).__heroMouseInit) {
      (window as any).__heroMouseInit = true;
      window.addEventListener("mousemove", (e) => {
        mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
      });
    }
  }

  return mouse;
}

/* ── Wireframe Icosahedron — main shape ── */
function WireIcosahedron() {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouse = useMousePosition();

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    // Slow auto-rotation
    meshRef.current.rotation.x += delta * 0.08;
    meshRef.current.rotation.y += delta * 0.12;
    // Follow cursor with smooth lerp
    meshRef.current.rotation.x += (mouse.current.y * 0.5 - meshRef.current.rotation.x) * delta * 0.4;
    meshRef.current.rotation.z += (mouse.current.x * 0.3 - meshRef.current.rotation.z) * delta * 0.4;
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.0, 1]} />
      <meshBasicMaterial wireframe color="#888" transparent opacity={0.35} />
    </mesh>
  );
}


/* ── Dot field — scattered small dots ── */
function DotField() {
  const pointsRef = useRef<THREE.Points>(null);
  const mouse = useMousePosition();

  const positions = useMemo(() => {
    const count = 120;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 6;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 6;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.02;
    pointsRef.current.rotation.x += (mouse.current.y * 0.1 - pointsRef.current.rotation.x) * delta * 0.5;
    pointsRef.current.rotation.z += (mouse.current.x * 0.1 - pointsRef.current.rotation.z) * delta * 0.5;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#999" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

/* ── Main exported component ── */
export function HeroScene() {
  return (
    <div className="absolute inset-0 z-0 opacity-60 dark:opacity-80">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
          <WireIcosahedron />
        </Float>
        <DotField />
      </Canvas>
    </div>
  );
}
