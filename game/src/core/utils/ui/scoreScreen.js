// core/utils/ScoreScreen.js
import gsap from "gsap"
import { k } from "../../kaplay"
import { saveScore, getBestScore } from "../ScoreDB"


export async function showBattleScoreScreen({ wave, score }) {
    const Z = 999;

    // ==== SAVE SCORE ====
    await saveScore({ wave, score })
    const best = await getBestScore()

    // === Dim background ===
    const root = k.add([
        // k.pos(k.center()),
        k.anchor("center"),
        k.z(Z),
        k.fixed(),
    ])

    const bg = root.add([
        k.rect(k.width(), k.height()),
        k.color(0, 0, 0),
        k.opacity(0),
        k.fixed(),
    ])

    gsap.to(bg, {
        opacity: 0.7,
        duration: 0.6,
        ease: "power2.out",
    })

    // === Panel ===
    const panel = root.add([
        k.rect(520, 320, { radius: 18 }),
        k.color(40, 40, 60),
        k.opacity(0),
        k.scale(0.8),
        k.anchor("center"),
        k.pos(k.width() / 2, k.height() / 2),
        k.fixed(),
        k.z(Z + 1),
    ])

    gsap.to(panel, {
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
    })

    gsap.to(panel.scale, {
        x: 1,
        y: 1,
        duration: 0.6,
        ease: "back.out(1.6)",
    })

    // === Title ===
    const title = root.add([
        k.text("BATTLE RESULT", { size: 36, font: "Glad" }),
        k.anchor("center"),
        k.pos(panel.pos.x, panel.pos.y - 110),
        k.fixed(),
        k.z(Z + 2),
        k.opacity(0),
    ])

    gsap.to(title, { opacity: 1, delay: 0.2 })

    // === Wave ===
    const waveText = root.add([
        k.text("Wave: 0", { size: 28, font: "Glad" }),
        k.anchor("center"),
        k.pos(panel.pos.x, panel.pos.y - 20),
        k.fixed(),
        k.z(Z + 2),
        k.opacity(0),
    ])

    // === Score ===
    const scoreText = root.add([
        k.text("Score: 0", { size: 28, font: "Glad" }),
        k.anchor("center"),
        k.pos(panel.pos.x, panel.pos.y + 30),
        k.fixed(),
        k.z(Z + 2),
        k.opacity(0),
    ])

    gsap.to([waveText, scoreText], {
        opacity: 1,
        delay: 0.4,
        stagger: 0.15,
    })

    // === Animated numbers ===
    tweenNumber({
        from: 0,
        to: wave,
        duration: 0.8,
        onUpdate: v => waveText.text = `Wave: ${v}`,
    })

    tweenNumber({
        from: 0,
        to: score,
        duration: 1,
        onUpdate: v => scoreText.text = `Score: ${v}`,
    })

    const bestText = root.add([
        k.text("Best: --", { size: 22, font: "Glad" }),
        k.anchor("center"),
        k.pos(panel.pos.x, panel.pos.y + 75),
        k.fixed(),
        k.z(Z + 2),
        k.opacity(0),
    ])
    gsap.to(bestText, {
        opacity: 1,
        delay: 0.7,
    })
    if (best) {
        bestText.text = `Best: ${best.score} (Wave ${best.wave})`
    }


    const hint = root.add([
        k.text("Press Z to return to menu", { size: 18, font: "Glad" }),
        k.anchor("center"),
        k.pos(panel.pos.x, panel.pos.y + 120),
        k.opacity(0.7),
        k.fixed(),
        k.z(Z + 2),
    ])
    const unbind = k.onKeyPress("z", () => {
        k.go("menu")
    })


    // === Helper ===
    function tweenNumber({ from, to, duration, onUpdate }) {
        const obj = { value: from }
        gsap.to(obj, {
            value: to,
            duration,
            ease: "power2.out",
            onUpdate: () => onUpdate(Math.floor(obj.value)),
        })
    }

    return root
}
