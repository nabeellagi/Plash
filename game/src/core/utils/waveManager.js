import { k } from "../kaplay"
import { enemyEntity } from "../../entity/enemy"
import { ENEMY_DATA } from "../data/enemyData"

export function createWaveManager({
    player,
    hpBar,
    spawnBounds,
    z,
}) {
    let wave = 0
    let score = 0
    let aliveEnemies = 0
    let spawning = false

    const BASE_MAX_ENEMY = 3
    const MAX_ADD_PER_WAVE = 2
    const SPAWN_BATCH = 2

    const BASE_SPEED_MULT = 1
    const SPEED_INCREASE_EVERY = 5
    const SPEED_MULT_STEP = 0.15

    // =========================
    // UI
    // =========================
    const waveText = k.add([
        k.text("Wave 1", { size: 36, font: "Glad" }),
        k.pos(40, 40),
        k.fixed(),
        k.z(100),
    ])

    const scoreText = k.add([
        k.text("Score 0", { size: 28, font: "Glad" }),
        k.pos(40, 80),
        k.fixed(),
        k.z(100),
    ])

    // =========================
    // HELPERS
    // =========================
    const getMaxEnemies = () =>
        BASE_MAX_ENEMY + (wave - 1) * MAX_ADD_PER_WAVE

    const getSpeedMultiplier = () =>
        BASE_SPEED_MULT +
        Math.floor((wave - 1) / SPEED_INCREASE_EVERY) * SPEED_MULT_STEP

    function pickEnemyType() {
        const pool = Object.values(ENEMY_DATA)
        let roll = Math.random()
        let acc = 0

        for (const e of pool) {
            acc += e.occurChance
            if (roll <= acc) return e
        }
        return pool[0]
    }

    function randomSpawnPos() {
        return k.vec2(
            k.rand(spawnBounds.left, spawnBounds.right),
            k.rand(spawnBounds.top, spawnBounds.bottom)
        )
    }

    // =========================
    // CORE LOGIC
    // =========================
    function spawnEnemy() {
        const data = pickEnemyType()
        const speedMult = getSpeedMultiplier()

        aliveEnemies++

        const enemy = enemyEntity({
            sprite: data.sprite,
            hp: data.hp,
            damage: data.damage,
            scale: data.scale,
            ai: data.ai(player),
            z,
            pos: randomSpawnPos(),
        })

        enemy.onDestroy(() => {
            aliveEnemies--
            score += wave * data.hp
            scoreText.text = `Score ${score}`

            if (aliveEnemies === 0 && !spawning) {
                k.wait(1, startNextWave)
            }
        })
    }

    function spawnBatch(count) {
        spawning = true
        let spawned = 0

        const loop = () => {
            if (spawned >= count) {
                spawning = false
                return
            }
            spawnEnemy()
            spawned++
            k.wait(0.4, loop)
        }

        loop()
    }

    function startNextWave() {
        wave++

        // ===== PLAYER REFILL =====
        player.refillHp()

        if (wave % 5 === 0) {
            const newMax = player.getMaxHp() + 4
            player.setMaxHp(newMax, true) // true = refill
        }

        waveText.text = `Wave ${wave}`

        const maxEnemies = getMaxEnemies()
        let remaining = maxEnemies

        const spawnLoop = () => {
            if (remaining <= 0) return

            const batch = Math.min(SPAWN_BATCH, remaining)
            spawnBatch(batch)
            remaining -= batch

            k.wait(1.2, spawnLoop)
        }

        spawnLoop()
    }

    return {
        start() {
            startNextWave()
        },
        getWave: () => wave,
        getScore: () => score,
    }
}
