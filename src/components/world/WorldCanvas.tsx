import { Suspense, useRef, type RefObject } from 'react'
import { Mesh, Vector3 } from 'three'
import { Canvas, useFrame, type ThreeEvent } from '@react-three/fiber'
import { Environment, useAnimations, useGLTF, useProgress } from '@react-three/drei'
import { Physics, RigidBody } from '@react-three/rapier'
import Ecctrl, { useGame, type CustomEcctrlRigidBody } from 'ecctrl'
import { TeamFollowers } from './TeamFollowers'
import { useSoundStore } from '../../store/soundStore'
import { startMusic } from '../../lib/audio'

const CITY = '/viridian_city.glb'
const HERO = '/ash.glb'
useGLTF.preload(CITY)
useGLTF.preload(HERO)

/** Spawn just above where the capsule settles (capsule half-height +
 *  float distance ≈ 0.65). A tiny drop is enough for the physics solver
 *  to settle cleanly, and the loader overlay hides it anyway. */
const SPAWN: [number, number, number] = [0, 1.2, 0]


/** The 3D walking-around-Viridian-City window — drop-in component that
 *  any page can render. The whole R3F + rapier + ecctrl + asset stack
 *  lives behind this file's import; consumers pay nothing until they
 *  mount the component.
 *
 *  - Physics: @react-three/rapier (wasm). City is a static trimesh.
 *  - Character: pmndrs/ecctrl in PointToMove — tap or click the city
 *    floor and the capsule walks there (works on desktop and mobile).
 *  - Hero mesh: GLB (Mixamo export) with its first baked animation looped.
 *  - The team Pokémon trail single-file behind the player as billboards
 *    (Zustand team store for membership, the Ecctrl ref for live pose).
 *  - Music kicks in on the first pointer-down anywhere on the canvas
 *    (browsers block autoplay until the user gestures). */
export function WorldCanvas() {
  /** Browsers reject `audio.play()` without a user gesture. Arm music on
   *  the first pointer-down anywhere — idempotent thereafter. */
  const armed = useRef(false)
  const armMusic = () => {
    if (armed.current) return
    armed.current = true
    if (useSoundStore.getState().enabled) startMusic()
  }

  /** One ref shared between the character controller and the team
   *  sprites that follow it — no extra store, no per-frame syncing layer. */
  const playerRef = useRef<CustomEcctrlRigidBody>(null)

  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-[#79c2ff] shadow-xl shadow-black/40"
      onPointerDown={armMusic}
    >

      <Canvas
        shadows
        camera={{ position: [-3, 5, 10], fov: 55, near: 0.1, far: 500 }}
        dpr={[1, 2]}
      >
        {/* ONE Suspense boundary for the whole scene — both glbs and the
            HDR environment suspend together via PreloadAssets, so Physics
            + Ecctrl + City never mount until everything is ready. The
            character can't spawn into an empty void and fall before the
            city paints (that was the original race). */}
        <Suspense fallback={null}>
          <ambientLight intensity={0.55} />
          <directionalLight
            position={[30, 40, 10]}
            intensity={1.2}
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          <Environment preset="park" background />
          <PreloadAssets />

          <Physics timeStep="vary">
            <City />
            <Ecctrl
              ref={playerRef}
              mode="PointToMove"
              maxVelLimit={5}
              jumpVel={0}
              position={SPAWN}
            >
              <Hero playerRef={playerRef} />
            </Ecctrl>
            {/* Followers in their own Suspense — adding or removing a
                team member mounts/unmounts only this subtree, and a new
                sprite texture fetch can't re-suspend the whole canvas. */}
            <Suspense fallback={null}>
              <TeamFollowers playerRef={playerRef} />
            </Suspense>
          </Physics>
        </Suspense>
      </Canvas>

      <CanvasLoader />
      <ControlsHint />
    </div>
  )
}

/** Suspends until both glbs are in the drei cache. Sitting as a sibling
 *  of `<Physics>` inside the single outer Suspense means Physics + Ecctrl
 *  + the City/Hero components don't even mount until both assets are
 *  resolved — they all render in the same React commit. */
function PreloadAssets() {
  useGLTF(CITY)
  useGLTF(HERO)
  return null
}

/** Loading overlay sitting on top of the canvas (outside it, in normal
 *  DOM) — driven by drei's `useProgress` which reads the three.js default
 *  LoadingManager. Covers the WebGL boot, the glb downloads, the HDR
 *  environment, and any follower-sprite textures in flight. Hides itself
 *  the moment everything is loaded. */
function CanvasLoader() {
  const { progress, active } = useProgress()
  if (progress >= 100 && !active) return null
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-ink/95 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-300">
          Loading Viridian City
        </p>
        <div className="h-1 w-48 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full bg-emerald-400 transition-[width] duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="font-mono text-[10px] tabular-nums text-zinc-500">
          {Math.round(progress)}%
        </p>
      </div>
    </div>
  )
}

/** The static city — trimesh collider lets the character walk on every
 *  surface the artist modelled. Click/tap anywhere on the geometry feeds
 *  the world-space hit point to ecctrl's PointToMove target (works the
 *  same on desktop click and mobile touch). */
function City() {
  const { scene } = useGLTF(CITY)
  const setMoveToPoint = useGame((s) => s.setMoveToPoint)
  const circleRef = useRef<Mesh>(null!)
  return (
    <>
      <mesh ref={circleRef} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[0.2, 0.3]} />
        <meshBasicMaterial color={0x0000ff} transparent opacity={1} />
      </mesh>
      <RigidBody position={[2, -23, 2]} type="fixed" colliders="trimesh">
        <primitive
          object={scene}
          onPointerMove={({ point }: { point: Vector3 }) => {
            circleRef.current.position.z = point.z
            circleRef.current.position.x = point.x
            circleRef.current.position.y = point.y + 0.01
          }}

          onClick={(e: ThreeEvent<MouseEvent>) => {
            e.stopPropagation()
            // Cast across the type boundary: ecctrl bundles its own copy of
            // @types/three so its Vector3 type doesn't structurally match
            // ours, even though the runtime value is identical.
            setMoveToPoint(e.point as never)
          }}
        />
      </RigidBody>
    </>
  )
}



/** Hardcoded character transform — the Box3 auto-fit was giving wrong
 *  results for skinned Mixamo meshes (their bind-pose bbox underestimates
 *  the actual extent, so the model ended up floating above the capsule).
 *  These are tuned for the bundled ash.glb; swap the asset → tune here. */
const HERO_SCALE = 1
const HERO_Y_OFFSET = -0.85

/** Speed (m/s) above which the walk clip starts running. Below it the
 *  character freezes at the current frame — perfect "idle is just paused
 *  walking" behaviour for a model that ships with only the walk clip. */
const MOVE_THRESHOLD = 0.2

/** The character mesh: loaded from GLB (Mixamo export) with its baked
 *  walk clip. Scale + Y offset hardcoded (see HERO_SCALE / HERO_Y_OFFSET).
 *
 *  Animation: always playing; `timeScale` is gated on the player's
 *  horizontal velocity — walking when moving, frozen at the current
 *  frame when idle (no T-pose snap). Mixamo bakes against the model's
 *  own armature, so `useAnimations` is given `scene` directly so the
 *  mixer drives the same bones the clip was authored on. */
function Hero({
  playerRef,
}: {
  playerRef: RefObject<CustomEcctrlRigidBody | null>
}) {
  const { scene, animations } = useGLTF(HERO)
  const { actions, names } = useAnimations(animations, scene)

  // Mixamo bakes the chosen animation as the only clip — pick it.
  const firstName = names[0]
  const first = firstName ? actions[firstName] : null
  first?.play()

  useFrame(() => {
    if (!first) return
    // Belt-and-braces: keep the action playing in case Suspense ever
    // rebinds the mixer mid-stream.
    if (!first.isRunning()) first.play()

    // Gate timeScale on horizontal velocity. Y is ignored so a jump
    // arc doesn't accidentally play the loop.
    const body = playerRef.current?.group
    if (!body) return
    const v = body.linvel()
    const horizontalSpeed = Math.hypot(v.x, v.z)
    first.timeScale = horizontalSpeed > MOVE_THRESHOLD ? 1 : 0
  })

  return (
    <primitive
      object={scene}
      scale={HERO_SCALE}
      position={[0, HERO_Y_OFFSET, 0]}
    />
  )
}

function ControlsHint() {
  return (
    <div className="pointer-events-none absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-lg border border-white/15 bg-black/45 px-3 py-1.5 text-xs text-white/90 shadow-md shadow-black/30 backdrop-blur-md">
      <span className="font-mono font-bold">Tap / click</span> the ground to walk there · drag to orbit
    </div>
  )
}
