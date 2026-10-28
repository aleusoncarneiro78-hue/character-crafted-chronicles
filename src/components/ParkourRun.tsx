import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Billboard, Environment, Lightformer, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { characters, missions } from '@/lib/explorer';

type Platform = { x: number; y: number; z: number; w: number; d: number; goal?: boolean };
const SPEED = 6, JUMP = 7.2, GRAVITY = 20, RADIUS = 0.35;

function buildCourse(level: number): Platform[] {
  const list: Platform[] = [{ x: 0, y: 0, z: 0, w: 4, d: 4 }];
  let x = 0, y = 0, z = 0;
  const count = 7 + level;
  for (let i = 0; i < count; i++) {
    const seed = Math.sin((i + 1) * 12.9898 + level * 78.233) * 43758.5453;
    const r = seed - Math.floor(seed);
    x += (r - 0.5) * 3.2;
    y += r > 0.6 ? 0.8 : r < 0.2 ? -0.4 : 0.3;
    z -= 3 + r * 1.2 + level * 0.15;
    const size = Math.max(1.4, 2.4 - level * 0.15);
    list.push({ x, y, z, w: size, d: size });
  }
  list.push({ x, y: y + 0.4, z: z - 4, w: 4, d: 4, goal: true });
  return list;
}

type Keys = { left?: boolean; right?: boolean; forward?: boolean; back?: boolean; jump?: boolean; [k: string]: boolean | undefined };

function Runner({ course, character, keys, onGoal, onFall }: { course: Platform[]; character: number; keys: React.MutableRefObject<Keys>; onGoal: () => void; onFall: () => void }) {
  const ref = useRef<THREE.Group>(null);
  const vel = useRef(new THREE.Vector3());
  const grounded = useRef(false);
  const done = useRef(false);
  const texture = useTexture(characters[character]?.image ?? characters[0]!.image);
  texture.colorSpace = THREE.SRGBColorSpace;
  const img = texture.image as { width?: number; height?: number } | undefined;
  const aspect = img?.width && img?.height ? img.width / img.height : 0.45;
  useFrame((state, raw) => {
    const g = ref.current; if (!g || done.current) return;
    const dt = Math.min(raw, 0.05);
    const k = keys.current;
    const ix = (k.right ? 1 : 0) - (k.left ? 1 : 0);
    const iz = (k.back ? 1 : 0) - (k.forward ? 1 : 0);
    vel.current.x = ix * SPEED; vel.current.z = iz * SPEED;
    if (k.jump && grounded.current) { vel.current.y = JUMP; grounded.current = false; }
    vel.current.y -= GRAVITY * dt;
    const prevY = g.position.y;
    g.position.addScaledVector(vel.current, dt);
    grounded.current = false;
    for (const p of course) {
      const top = p.y + 0.25;
      const inside = Math.abs(g.position.x - p.x) < p.w / 2 + RADIUS * 0.5 && Math.abs(g.position.z - p.z) < p.d / 2 + RADIUS * 0.5;
      if (inside && prevY >= top - 0.05 && g.position.y <= top && vel.current.y <= 0) {
        g.position.y = top; vel.current.y = 0; grounded.current = true;
        if (p.goal) { done.current = true; onGoal(); }
      }
    }
    if (g.position.y < -8) { g.position.set(0, 0.25, 0); vel.current.set(0, 0, 0); onFall(); }
    const cam = state.camera;
    const target = new THREE.Vector3(g.position.x, g.position.y + 3.5, g.position.z + 7);
    cam.position.lerp(target, 1 - Math.exp(-6 * dt));
    cam.lookAt(g.position.x, g.position.y + 0.8, g.position.z - 3);
  });
  return <group ref={ref} position={[0, 0.25, 0]}>
    <Billboard position={[0, 0.9, 0]} lockX lockZ><mesh><planeGeometry args={[1.8 * aspect, 1.8]} /><meshBasicMaterial map={texture} transparent alphaTest={0.1} side={THREE.DoubleSide} /></mesh></Billboard>
    <mesh rotation-x={-Math.PI / 2} position={[0, 0.01, 0]}><circleGeometry args={[0.4, 24]} /><meshBasicMaterial color="#000000" transparent opacity={0.25} /></mesh>
  </group>;
}

function Course({ course }: { course: Platform[] }) {
  return <>{course.map((p, i) => <mesh key={i} position={[p.x, p.y, p.z]} castShadow receiveShadow>
    <boxGeometry args={[p.w, 0.5, p.d]} />
    <meshStandardMaterial color={p.goal ? '#efbd4b' : i % 2 ? '#e8e5da' : '#97bb91'} roughness={0.7} />
  </mesh>)}
    {course.at(-1) && <mesh position={[course.at(-1)!.x, course.at(-1)!.y + 1.6, course.at(-1)!.z - 1.6]}><torusGeometry args={[1.2, 0.12, 12, 40]} /><meshStandardMaterial color="#efbd4b" emissive="#efbd4b" emissiveIntensity={0.4} /></mesh>}
  </>;
}

const keyMap: Record<string, string> = { ArrowLeft: 'left', a: 'left', A: 'left', ArrowRight: 'right', d: 'right', D: 'right', ArrowUp: 'forward', w: 'forward', W: 'forward', ArrowDown: 'back', s: 'back', S: 'back', ' ': 'jump' };

export function ParkourRun({ target, character, onComplete }: { target: number; character: number; onComplete: () => void }) {
  const course = useMemo(() => buildCourse(target), [target]);
  const keys = useRef<Keys>({});
  const [falls, setFalls] = useState(0);
  const [won, setWon] = useState(false);
  useEffect(() => {
    const set = (v: boolean) => (e: KeyboardEvent) => { const k = keyMap[e.key]; if (k) { keys.current[k] = v; if (k === 'forward' && (e.key === 'w' || e.key === 'W')) keys.current.jump = v; e.preventDefault(); } };
    const down = set(true), up = set(false);
    window.addEventListener('keydown', down); window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, []);
  useEffect(() => { if (!won) return undefined; const t = setTimeout(onComplete, 1200); return () => clearTimeout(t); }, [won, onComplete]);
  const hold = (k: string) => ({ onPointerDown: () => { keys.current[k] = true; }, onPointerUp: () => { keys.current[k] = false; }, onPointerLeave: () => { keys.current[k] = false; } });
  return <div className="parkour-overlay" role="dialog" aria-label="Parkour até a próxima missão">
    <Canvas shadows camera={{ position: [0, 4, 8], fov: 60 }} dpr={[1, 1.75]}>
      <color attach="background" args={['#cfe3dc']} />
      <fog attach="fog" args={['#cfe3dc', 15, 60]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[6, 12, 4]} intensity={1.4} castShadow />
      <Environment><Lightformer intensity={2} position={[0, 5, 0]} scale={[10, 10, 1]} /></Environment>
      <Course course={course} />
      <Suspense fallback={null}><Runner course={course} character={character} keys={keys} onGoal={() => setWon(true)} onFall={() => setFalls(f => f + 1)} /></Suspense>
    </Canvas>
    <div className="parkour-hud">
      <span className="parkour-tag">PARKOUR · RUMO À {missions[target]?.name.toUpperCase()}</span>
      <p>Chegue ao anel dourado! <b>Setas/WASD</b> para mover, <b>Espaço</b> ou <b>W</b> para pular.</p>
      <span className="parkour-falls">Quedas: {falls}</span>
      {falls >= 3 && !won && <Button variant="outline" size="sm" onClick={onComplete}>Pular parkour</Button>}
    </div>
    {won && <div className="parkour-win">Você chegou! 🎉</div>}
    <div className="parkour-pad">
      <div><Button variant="secondary" {...hold('left')} aria-label="Esquerda">◀</Button><Button variant="secondary" {...hold('forward')} aria-label="Frente">▲</Button><Button variant="secondary" {...hold('back')} aria-label="Trás">▼</Button><Button variant="secondary" {...hold('right')} aria-label="Direita">▶</Button></div>
      <Button {...hold('jump')} aria-label="Pular">PULAR</Button>
    </div>
  </div>;
}
