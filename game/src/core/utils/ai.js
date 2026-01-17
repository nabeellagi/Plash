import { k } from "../kaplay";

export function smoothChase(player, speed = 120, turnRate = 0.08) {
    let currentDir = k.vec2(0, 0)

    return (enemy) => {
        const desired = player.pos.sub(enemy.pos).unit()
        currentDir = currentDir.lerp(desired, turnRate)
        enemy.move(currentDir.scale(speed))
    }
}
