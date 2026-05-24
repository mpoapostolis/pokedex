import { useRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { Vector3, type Sprite as SpriteImpl } from 'three'
import { useQueries } from '@tanstack/react-query'
import type { CustomEcctrlRigidBody } from 'ecctrl'
import { getPokemon, queryKeys } from '../../api'
import { useTeamStore } from '../../store/teamStore'

/** Step between consecutive followers along the trail. */
const TRAIL_STEP = 1.0
/** How quickly each sprite snaps to its target slot (per second). */
const FOLLOW_LERP = 6
/** Player-relative ground offset — bottom of the sprite plane sits at
 *  roughly the character's feet (capsule centre ≈ 0.85 above feet, sprite
 *  half-height = SPRITE_SCALE / 2). */
const SPRITE_SCALE = 0.9
const GROUND_OFFSET = -(0.85 - SPRITE_SCALE / 2)
/** Pseudo-animation: gentle vertical bob to fake "alive". Slot index
 *  offsets the phase so the row bobs out of sync — feels less robotic. */
const BOB_AMPLITUDE = 0.08
const BOB_SPEED = 4.5

/** The team — fetched in one batched useQueries — rendered as billboard
 *  sprites that trail single-file behind the player. Reads the player's
 *  pose directly from the Ecctrl body ref (passed in from the canvas).
 *  No global store; the ref is the one source of truth. */
export function TeamFollowers({
  playerRef,
}: {
  playerRef: RefObject<CustomEcctrlRigidBody | null>
}) {
  const team = useTeamStore((s) => s.team)
  const queries = useQueries({
    queries: team.map((name) => ({
      queryKey: queryKeys.pokemon(name),
      queryFn: () => getPokemon(name),
    })),
  })

  const members = queries
    .map((q, i) => ({ name: team[i], sprite: q.data?.sprites.front_default }))
    .filter((m): m is { name: string; sprite: string } => Boolean(m.sprite))

  if (members.length === 0) return null

  return (
    <>
      {members.map((m, i) => (
        <Follower key={m.name} spriteUrl={m.sprite} slot={i} playerRef={playerRef} />
      ))}
    </>
  )
}

function Follower({
  spriteUrl,
  slot,
  playerRef,
}: {
  spriteUrl: string
  slot: number
  playerRef: RefObject<CustomEcctrlRigidBody | null>
}) {
  const texture = useTexture(spriteUrl)
  const ref = useRef<SpriteImpl>(null)
  const target = useRef(new Vector3())

  useFrame((state, delta) => {
    const node = ref.current
    const body = playerRef.current?.group
    if (!node || !body) return

    const t = body.translation()
    const r = body.rotation()
    // Quaternion → Y-axis yaw — the direction the player faces.
    const heading = Math.atan2(2 * (r.w * r.y + r.x * r.z), 1 - 2 * (r.y * r.y + r.x * r.x))

    // Single-file: each follower sits `(slot + 1) * TRAIL_STEP` behind the
    // player along the facing vector.
    const distance = (slot + 1) * TRAIL_STEP
    const sin = Math.sin(heading)
    const cos = Math.cos(heading)
    const bob = Math.sin(state.clock.elapsedTime * BOB_SPEED + slot * 0.6) * BOB_AMPLITUDE

    target.current.set(
      t.x - sin * distance,
      t.y + GROUND_OFFSET + bob,
      t.z - cos * distance,
    )
    node.position.lerp(target.current, Math.min(1, FOLLOW_LERP * delta))
  })

  return (
    <sprite ref={ref} scale={[SPRITE_SCALE, SPRITE_SCALE, SPRITE_SCALE]}>
      <spriteMaterial map={texture} transparent />
    </sprite>
  )
}
