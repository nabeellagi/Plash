import gsap from "gsap"
import { k } from "."

let isTransitioning = false
let pendingReveal = null

function startPos(dir) {
    switch (dir) {
        case "left":  return k.vec2(-k.width(), 0)
        case "right": return k.vec2(k.width(), 0)
        case "up":    return k.vec2(0, -k.height())
        case "down":  return k.vec2(0, k.height())
        default:      return k.vec2(-k.width(), 0)
    }
}

function centerPos() {
    return k.vec2(0, 0)
}

function reverse(dir) {
    return {
        left: "right",
        right: "left",
        up: "down",
        down: "up"
    }[dir] ?? "right"
}

export function transitionClose(sceneName, opts = {}) {
    if (isTransitioning) return
    isTransitioning = true

    const {
        duration = 0.6,
        color = k.rgb(0, 0, 0),
        direction = "left",
        easing = "power2.out"
    } = opts

    const overlay = k.add([
        k.rect(k.width(), k.height()),
        k.color(color),
        k.pos(startPos(direction)),
        k.z(9999),
        k.fixed(),
    ])

    // store reveal intent for next scene
    pendingReveal = { direction, duration, color, easing }

    gsap.to(overlay.pos, {
        x: centerPos().x,
        y: centerPos().y,
        duration,
        ease: easing,
        onComplete: () => {
            k.go(sceneName)
        }
    })
}

export function revealIfNeeded() {
    if (!pendingReveal) return

    const { direction, duration, color, easing } = pendingReveal
    pendingReveal = null

    // overlay STARTS CLOSED
    const overlay = k.add([
        k.rect(k.width(), k.height()),
        k.color(color),
        k.pos(centerPos()),
        k.z(9999),
        k.fixed(),
    ])

    const exit = startPos(reverse(direction))

    gsap.to(overlay.pos, {
        x: exit.x,
        y: exit.y,
        duration,
        ease: easing,
        onComplete: () => {
            overlay.destroy()
            isTransitioning = false
        }
    })
}
