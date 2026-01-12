import gsap from "gsap";
import { k } from "../core/kaplay";

// Square melon ball

export function ballEntity({ pos = k.center(), z }) {
    let direction = k.vec2(0, 0)
    let speed = 0
    let spin = 0

    const DECELERATION = 500
    const MIN_SPEED = 5
    const SIZE = 32

    const root = k.add([
        k.anchor("center"),
        k.pos(pos),
        k.z(z || 0),
        k.scale(1.2),
        k.rotate(0),
        k.area({ shape: new k.Rect(k.vec2(0, 0), 42, 42) }),
        "ball",

        {
            hit(dir, power) {
                direction = dir.unit()
                speed = power
                spin = k.clamp(dir.x * 40, -80, 80)
            }
        }
    ])

    root.add([
        k.sprite("melonball"),
        k.anchor("center"),
        k.scale(0.7)
    ])

    root.onUpdate(() => {
        const dt = k.dt()
        if (speed <= MIN_SPEED) {
            speed = 0
            return
        }

        // move
        root.move(direction.scale(speed))

        // ==== WORLD BOUNCE ====

        // LEFT
        if (root.pos.x < SIZE) {
            root.pos.x = SIZE
            direction = reflect(direction, k.vec2(1, 0))
            spin += direction.y * 25
        }

        // RIGHT
        if (root.pos.x > k.width() - SIZE) {
            root.pos.x = k.width() - SIZE
            direction = reflect(direction, k.vec2(-1, 0))
            spin += direction.y * 25
        }

        // TOP
        if (root.pos.y < SIZE) {
            root.pos.y = SIZE
            direction = reflect(direction, k.vec2(0, 1))
            spin += direction.x * 25
        }

        // BOTTOM
        if (root.pos.y > k.height() - SIZE - 20) {
            root.pos.y = k.height() - SIZE - 20
            direction = reflect(direction, k.vec2(0, -1))
            spin += direction.x * 25
        }

        speed -= DECELERATION * dt
        spin *= 0.98

        // visuals
        root.angle += spin * dt * 60
        spin = k.lerp(spin, 0, 0.05)
    })

    return root
}
function reflect(dir, normal) {
    return dir.sub(normal.scale(2 * dir.dot(normal))).unit()
}