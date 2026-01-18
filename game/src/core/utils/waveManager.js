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
    const getMaxEnemies = () => {
        const baseGrowth =
            BASE_MAX_ENEMY + (wave - 1) * MAX_ADD_PER_WAVE

        const penalty =
            Math.floor((wave - 1) / 6) * 5

        let max = Math.max(1, baseGrowth - penalty)

        if (isBossWave()) {
            // max = Math.max(1, Math.floor(max / 2))
            return Math.max(1, Math.floor(max / 2));
        }

        return max
    }


    const getEnemyHpBonus = () =>
        Math.floor((wave - 1) / 10) * 0.5

    const getEnemyAttackBonus = () =>
        Math.floor((wave - 1) / 5)

    const isBossWave = () => wave % 5 === 0

    // const getSpeedMultiplier = () =>
    //     BASE_SPEED_MULT +
    //     Math.floor((wave - 1) / SPEED_INCREASE_EVERY) * SPEED_MULT_STEP

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
        const SAFE_RADIUS = 120
        let pos

        let attempts = 0
        const MAX_ATTEMPTS = 25

        do {
            pos = k.vec2(
                k.rand(spawnBounds.left, spawnBounds.right),
                k.rand(spawnBounds.top, spawnBounds.bottom)
            )
            attempts++
        } while (
            pos.dist(player.pos) < SAFE_RADIUS &&
            attempts < MAX_ATTEMPTS
        )

        return pos
    }

    // =========================
    // CORE LOGIC
    // =========================
    function spawnEnemy() {
        const data = pickEnemyType()
        // const speedMult = getSpeedMultiplier()
        const hpBonus = getEnemyHpBonus();
        const attackBonus = getEnemyAttackBonus();

        aliveEnemies++

        const enemy = enemyEntity({
            sprite: data.sprite,
            hp: data.hp + hpBonus,
            damage: data.damage,
            scale: data.scale,
            ai: data.ai(player),
            z,
            particleSprite: data.sprite + "Particle",
            pos: randomSpawnPos(),
            // scaleEntity: 3,
        });

        k.play(data.sprite + "_appear", {
            volume: 0.75
        });

        enemy.onDestroy(() => {
            aliveEnemies--
            score += wave * data.hp
            scoreText.text = `Score ${score}`

            if (aliveEnemies === 0 && !spawning) {
                k.wait(1, startNextWave)
            }
        })
    };

    function spawnBoss() {
        const data = pickEnemyType()

        aliveEnemies++

        const boss = enemyEntity({
            sprite: data.sprite,
            hp: data.hp + 5,
            damage: data.damage,
            scale: data.scale,
            scaleEntity: 3,
            ai: data.ai(player),
            z,
            particleSprite: data.sprite + "Particle",
            pos: randomSpawnPos(),
            color: k.rgb(255, 215, 80),
        })

        k.play(data.sprite + "_appear", {
            volume: 0.75
        });

        boss.onDestroy(() => {
            aliveEnemies--
            score += wave * 10
            scoreText.text = `Score ${score}`

            if (aliveEnemies === 0 && !spawning) {
                k.wait(1.5, startNextWave)
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
        if (wave % 3 === 0) {
            player.refillHp();
        } else {
            player.setHp(player.hp + 5)
        }

        if (wave % 5 === 0) {
            const newMax = player.getMaxHp() + 9
            player.setMaxHp(newMax, true) // true = refill
        }

        waveText.text = `Wave ${wave}`

        if (isBossWave()) {
            spawnBoss()
        }

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
