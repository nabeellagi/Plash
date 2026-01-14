import gsap from "gsap";
import { k } from "../core/kaplay";

// Square melon ball

export function ballEntity({ pos = k.center(), z, boundPadding }) {
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
        if (root.pos.x < SIZE + boundPadding.left) {
            root.pos.x = SIZE + boundPadding.left
            direction = reflect(direction, k.vec2(1, 0))
            direction = jitterDirection(direction, 8);
            spin += direction.y * 25
        }

        // RIGHT
        if (root.pos.x > k.width() + boundPadding.right) {
            root.pos.x = k.width() + boundPadding.right
            direction = reflect(direction, k.vec2(-1, 0))
            direction = jitterDirection(direction, 8);
            spin += direction.y * 25
        }

        // TOP
        if (root.pos.y < SIZE + boundPadding.top) {
            root.pos.y = SIZE + boundPadding.top
            direction = reflect(direction, k.vec2(0, 1));
            direction = jitterDirection(direction, 8);
            spin += direction.x * 25
        }

        // BOTTOM
        if (root.pos.y > k.height() - (SIZE + boundPadding.bottom)) {
            root.pos.y = k.height() - (SIZE + boundPadding.bottom)
            direction = reflect(direction, k.vec2(0, -1));
            direction = jitterDirection(direction, 8);
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
function jitterDirection(dir, degrees = 6) {
    const rad = k.deg2rad(k.rand(-degrees, degrees))
    const cos = Math.cos(rad)
    const sin = Math.sin(rad)

    return k.vec2(
        dir.x * cos - dir.y * sin,
        dir.x * sin + dir.y * cos
    ).unit()
}
