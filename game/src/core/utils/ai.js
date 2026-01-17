import { k } from "../kaplay";

function smoothChase(player, speed = 120, turnRate = 0.08) {
    let currentDir = k.vec2(0, 0)

    return (enemy) => {
        const desired = player.pos.sub(enemy.pos).unit()
        currentDir = currentDir.lerp(desired, turnRate)
        enemy.move(currentDir.scale(speed))
    }
}


function guardChase(
    player, {
        speed = 100,
        guardRadius = 160,
        orbitRadius = 260,
        orbitSpeed = 1.5
    } = {}
) {
    let home = null
    let angle = k.rand(0, Math.PI * 2)

    return (enemy) => {
        if (!home) home = enemy.pos.clone()

        const toPlayer = player.pos.sub(enemy.pos)
        const dist = toPlayer.len()

        if (dist < guardRadius) {
            enemy.move(toPlayer.unit().scale(speed))
            return
        }

        angle += orbitSpeed * k.dt()

        const orbitPos = home.clone().add(
            k.vec2(
                Math.cos(angle),
                Math.sin(angle)
            ).scale(orbitRadius)
        )

        const toOrbit = orbitPos.sub(enemy.pos)
        if (toOrbit.len() > 1) {
            enemy.move(toOrbit.unit().scale(speed * 0.6))
        }
    }
}

function zigzagChase(player,
    {
        speed = 140,
        zigzagStrength = 0.6,
        zigzagFrequency = 6
    } = {}
) {
    let t = k.rand(0, 100)

    return (enemy) => {
        const toPlayer = player.pos.sub(enemy.pos)
        if (toPlayer.len() === 0) return

        const forward = toPlayer.unit()
        const perpendicular = k.vec2(-forward.y, forward.x)

        t += k.dt() * zigzagFrequency

        const zigzag =
            perpendicular.scale(Math.sin(t) * zigzagStrength)

        const finalDir = forward.add(zigzag).unit()
        enemy.move(finalDir.scale(speed))
    }
}

function spiralChase(
    player,
    {
        speed = 220,             // movement speed (tweak to make it fast)
        revolutions = 60,         // how many revolutions while closing
        angularSpeed = 4,       // radians per second (bigger => faster spin)
        finalRadius = 600,        // stopping radius (how close after revolutions)
        wobbleStrength = 0.7,   // small wobble added to angular speed
        flipChance = 0.01        // small chance to flip spin direction each frame
    } = {}
) {
    let started = false
    let startRadius = 0
    let radius = 0
    let angle = 0
    let spin = Math.random() > 0.5 ? 1 : -1

    let radialPerRadian = 0
    const totalRadiansNeeded = 2 * Math.PI * revolutions

    return (enemy) => {
        // relative vector from player to enemy (current)
        const rel = enemy.pos.sub(player.pos)
        let r = rel.len()
        if (r === 0) {
            // avoid singularity
            r = 1
        }

        // initialize on first frame
        if (!started) {
            started = true
            startRadius = r
            radius = startRadius
            angle = Math.atan2(rel.y, rel.x)
            radialPerRadian = (Math.max(startRadius, finalRadius) - finalRadius) / Math.max(totalRadiansNeeded, 0.0001)
        }

        // compute angular delta this frame 
        const dt = k.dt()

        const wobble = Math.sin(performance.now ? performance.now() * 0.001 : Date.now() * 0.001 * 0.7) * wobbleStrength
        const angleDelta = (angularSpeed + wobble) * dt * spin


        if (Math.random() < flipChance * dt) spin *= -1

        angle += angleDelta


        const shrink = radialPerRadian * Math.abs(angleDelta)
        radius = Math.max(finalRadius, radius - shrink)


        const targetOffset = k
            .vec2(Math.cos(angle), Math.sin(angle))
            .scale(radius)
        const targetPos = player.pos.add(targetOffset)


        const toTarget = targetPos.sub(enemy.pos)
        const toTargetLen = toTarget.len()
        if (toTargetLen > 1e-4) {
            const moveDir = toTarget.unit()
            enemy.move(moveDir.scale(speed))
        } else {

            const forward = player.pos.sub(enemy.pos).unit()
            const tangent = k.vec2(-forward.y, forward.x).scale(spin)
            const nudge = forward.add(tangent.scale(0.8)).unit()
            enemy.move(nudge.scale(speed * 0.6))
        }
    }
}

export { smoothChase, guardChase, zigzagChase, spiralChase }