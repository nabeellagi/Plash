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
){
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

export { smoothChase, guardChase, zigzagChase }