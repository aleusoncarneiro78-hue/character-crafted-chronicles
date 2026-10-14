import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Billboard, Environment, Html, Lightformer, OrbitControls, useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { characters, missions } from '@/lib/explorer';
import { Button } from '@/components/ui/button';
import buildingA from '@/assets/building-a.glb.asset.json';
import buildingB from '@/assets/building-b.glb.asset.json';
import buildingC from '@/assets/building-c.glb.asset.json';
import buildingD from '@/assets/building-d.glb.asset.json';
import buildingH from '@/assets/building-h.glb.asset.json';
import tree from '@/assets/tree_oak.glb.asset.json';

const buildings = [buildingA.url, buildingB.url, buildingC.url, buildingD.url, buildingH.url];
const palette = { sky: '#e5eee9', lawn: '#97bb91', tile: '#e8e5da', grout: '#d6d4ca', edge: '#769b71', ink: '#294b3c', gold: '#efbd4b', white: '#ffffff' };
function Model({ url, height, position }: { url: string; height: number; position: [number, number, number] }) {
  const { scene } = useGLTF(url);
  const object = useMemo(() => {
    const copy = scene.clone(true);
    const box = new THREE.Box3().setFromObject(copy);
    copy.scale.setScalar(height / (box.getSize(new THREE.Vector3()).y || 1));
    const bounds = new THREE.Box3().setFromObject(copy);
    const center = bounds.getCenter(new THREE.Vector3());
    copy.position.set(-center.x, -bounds.min.y, -center.z);
    copy.traverse(o => { if (o instanceof THREE.Mesh) { o.castShadow = true; o.receiveShadow = true; } });
    return copy;
  }, [scene, height]);
  return <group position={position}><primitive object={object} /></group>;
}
function Ground() {
  const texture = useMemo(() => {
    const c = document.createElement('canvas'); c.width = c.height = 128;
    const ctx = c.getContext('2d');
    if (ctx) { ctx.fillStyle = palette.tile; ctx.fillRect(0, 0, 128, 128); ctx.strokeStyle = palette.grout; ctx.lineWidth = 2; ctx.strokeRect(0, 0, 128, 128); for (let i = 0; i < 100; i++) { ctx.fillStyle = palette.grout; ctx.fillRect((i * 37) % 128, (i * 71) % 128, 1, 1); } }
    const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(18, 18); t.colorSpace = THREE.SRGBColorSpace; return t;
  }, []);
  useEffect(() => () => texture.dispose(), [texture]);
  return <>
    <mesh position={[0, -0.5, 0]} receiveShadow><boxGeometry args={[24, 0.8, 23]} /><meshStandardMaterial color={palette.edge} roughness={1} /></mesh>
    <mesh position={[0, -0.075, 0]} rotation-x={-Math.PI / 2} receiveShadow><planeGeometry args={[24, 23]} /><meshStandardMaterial map={texture} roughness={0.9} /></mesh>
    {([[-7, -5], [0, -7], [7, -5], [-7, 4], [7, 4]] as [number, number][]).map(([x, z], i) => <mesh key={i} position={[x, -0.03, z]} rotation-x={-Math.PI / 2} receiveShadow><planeGeometry args={[6.2, 5.8]} /><meshStandardMaterial color={palette.lawn} roughness={1} /></mesh>)}
    <mesh rotation-x={-Math.PI / 2} position={[0, 0.015, 2]}><ringGeometry args={[2.05, 2.15, 64]} /><meshStandardMaterial color={palette.gold} /></mesh>
    <Html position={[0, 0.03, 2]} zIndexRange={[5, 0]} transform rotation={[-Math.PI / 2, 0, 0]} scale={0.75}><div className="campus-emblem">J&F</div></Html>
  </>;
}
function Student({ character, destination, paused, onArrival }: { character: number; destination: number | null; paused: boolean; onArrival: (id: number) => void }) {
  const ref = useRef<THREE.Group>(null);
  const texture = useTexture(characters[character]?.image ?? characters[0]?.image ?? '');
  const arrived = useRef<number | null>(null);
  useEffect(() => { arrived.current = null; }, [destination]);
  useFrame(({ clock }, delta) => {
    if (!ref.current || paused || destination === null || arrived.current === destination) return;
    const m = missions[destination]; if (!m) return; const target = new THREE.Vector3(m.position[0], 0, m.position[2] + 2.6);
    const distance = ref.current.position.distanceTo(target);
    if (distance < 0.12) { arrived.current = destination; ref.current.position.y = 0; onArrival(destination); return; }
    const step = Math.min(distance, Math.min(delta, 0.05) * 7);
    const direction = target.sub(ref.current.position).normalize(); ref.current.position.addScaledVector(direction, step); ref.current.position.y = Math.abs(Math.sin(clock.elapsedTime * 9)) * 0.08;
  });
  return <group ref={ref} position={[0, 0, 5]}>
    <Billboard position={[0, 1.3, 0]}><mesh><planeGeometry args={[1.0, 2.6]} /><meshBasicMaterial map={texture} transparent alphaTest={0.1} side={THREE.DoubleSide} /></mesh></Billboard>
    <mesh rotation-x={-Math.PI / 2} position-y={0.03}><ringGeometry args={[0.42, 0.52, 32]} /><meshBasicMaterial color={palette.gold} /></mesh>
    <Html center position={[0, 3, 0]} zIndexRange={[10, 0]}><span className="player-tag">Você <span>◆</span></span></Html>
  </group>;
}
function FrameCamera() {
  const { camera, size } = useThree();
  useEffect(() => { if (camera instanceof THREE.OrthographicCamera) { camera.zoom = Math.min(size.width / 34, size.height / 27); camera.updateProjectionMatrix(); } }, [camera, size]);
  return null;
}
export function CampusScene({ character, active, completed, started, paused, destination, onVisit, onArrival }: { character: number; active: number; completed: number[]; started: boolean; paused: boolean; destination: number | null; onVisit: (id: number) => void; onArrival: (id: number) => void }) {
  return <div className="campus-scene">
    <Canvas shadows orthographic camera={{ position: [24, 28, 32], zoom: 22, near: 0.1, far: 150 }} dpr={[1, 1.5]}>
      <color attach="background" args={[palette.sky]} />
      <ambientLight intensity={0.85} />
      <directionalLight position={[-12, 24, 8]} intensity={2.4} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} shadow-camera-left={-20} shadow-camera-right={20} shadow-camera-top={20} shadow-camera-bottom={-20} shadow-bias={-0.001} />
      <Environment resolution={64}><Lightformer intensity={1.5} position={[0, 10, 0]} scale={[20, 20, 1]} rotation-x={-Math.PI / 2} /></Environment>
      <FrameCamera /><Ground />
      <Suspense fallback={<Html center><div className="scene-loading">Abrindo o Instituto…</div></Html>}>
        {missions.map((m, i) => <group key={m.name}>
          <Model url={buildings[i] ?? buildingA.url} height={i === 2 ? 4.1 : 4.5} position={m.position} />
          <Html center position={[m.position[0], 5.4, m.position[2]]} zIndexRange={[10, 0]}><Button variant="ghost" className={`location-label ${i === active ? 'active' : ''} ${completed.includes(i) ? 'complete' : ''}`} onClick={() => onVisit(i)} disabled={!started || paused || i > active}><span>{completed.includes(i) ? '✓' : String(i + 1).padStart(2, '0')}</span>{m.name}{i > active && <small>⌑</small>}</Button></Html>
        </group>)}
        {([[-10, -9], [10, -9], [-11, 0], [11, 0], [-10, 9], [10, 9], [-3, -10], [4, -10]] as [number, number][]).map(([x, z], i) => <Model key={i} url={tree.url} height={2.9 + i % 2 * 0.6} position={[x, 0, z]} />)}
        <Student character={character} destination={destination} paused={paused} onArrival={onArrival} />
      </Suspense>
      <OrbitControls target={[0, 0, 0]} enablePan={false} enableZoom={false} minPolarAngle={0.65} maxPolarAngle={1.1} minAzimuthAngle={0.25} maxAzimuthAngle={0.95} enableRotate={!paused} />
    </Canvas>
    <div className="scene-caption"><span className="live-dot" /> INSTITUTO J&F <span>•</span> CAMPUS 3D</div>
    <div className="compass" aria-label="Norte">N<span>↑</span></div>
  </div>;
}