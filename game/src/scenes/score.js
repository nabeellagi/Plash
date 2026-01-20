import gsap from "gsap"
import { k } from "../core/kaplay"
import { Btn1 as Btn } from "../ui/btn"
import { getAllScores } from "../core/utils/ScoreDB"

export function registerScore() {
    k.scene("score", async () => {

        const Z = 50

        // ===== Background =====
        const hour = new Date().getHours()
        let bgSprite = null;
        if (hour > 17) {
            bgSprite = "night";
        } else {
            bgSprite = "grass";
        }

        k.add([
            k.sprite(bgSprite),
            k.pos(k.center()),
            k.anchor("center"),
        ])

        // ===== Container Box =====
        const box = k.add([
            k.rect(900, 600, { radius: 22 }),
            k.pos(k.width() / 2, k.height() / 2),
            k.anchor("center"),
            k.color("#2e3157"),
            k.scale(0.85),
            k.opacity(0),
            k.z(Z),
        ])

        gsap.timeline()
            .to(box.scale, {
                x: 1,
                y: 1,
                duration: 0.4,
                ease: "back.out(1.8)",
            })
            .to(box, {
                opacity: 1,
                duration: 0.4,
            }, "<")

        // ===== Title =====
        box.add([
            k.text("LEADERBOARD", {
                font: "Glad",
                size: 44,
                letterSpacing: 1.4,
            }),
            k.pos(0, -box.height / 2 + 55),
            k.anchor("center"),
        ])

        // ===== Table Header =====
        const headerY = -box.height / 2 + 130

        const headers = [
            { label: "#", x: -350 },
            { label: "Wave", x: -200 },
            { label: "Score", x: 0 },
            { label: "Date", x: 240 },
        ]

        headers.forEach(h => {
            box.add([
                k.text(h.label, {
                    font: "Glad",
                    size: 26,
                }),
                k.pos(h.x, headerY),
                k.anchor("center"),
                k.color(k.rgb(230, 230, 255)),
            ])
        })

        // ===== Fetch Scores =====
        const scores = await getAllScores()

        // ===== Table Rows =====
        const startY = headerY + 60
        const rowGap = 42

        if (scores.length === 0) {
            box.add([
                k.text("No records yet", {
                    font: "Doodlebean",
                    size: 28,
                }),
                k.pos(0, 40),
                k.anchor("center"),
                k.opacity(0),
            ])
        }

        scores.slice(0, 10).forEach((entry, i) => {
            const y = startY + i * rowGap
            const dateStr = new Date(entry.date).toLocaleDateString()

            const row = box.add([
                k.opacity(0),
            ])

            row.add([
                k.text(`${i + 1}`, { size: 24, font: "Doodlebean" }),
                k.pos(-350, y),
                k.anchor("center"),
            ])

            row.add([
                k.text(`${entry.wave}`, { size: 24, font: "Doodlebean" }),
                k.pos(-200, y),
                k.anchor("center"),
            ])

            row.add([
                k.text(`${entry.score}`, { size: 24, font: "Doodlebean" }),
                k.pos(0, y),
                k.anchor("center"),
            ])

            row.add([
                k.text(dateStr, { size: 22, font: "Doodlebean" }),
                k.pos(240, y),
                k.anchor("center"),
            ])

            gsap.to(row, {
                opacity: 1,
                delay: 0.1 + i * 0.05,
            })
        })

        // ===== Footer Hint =====
        k.add([
            k.text("Press Z to return to menu", {
                font: "Doodlebean",
                size: 22,
            }),
            k.pos(k.width() / 2, k.height() - 40),
            k.anchor("center"),
            k.color(hour > 17 ? k.rgb(230, 230, 255) : k.rgb(0, 0, 0)),
        ])

        // ===== Back Button =====
        Btn({
            text: "Back",
            pos: k.vec2(120, k.height() - 90),
            onClick: () => k.go("menu"),
        })

        // ===== Key Shortcut =====
        k.onKeyPress("z", () => {
            k.go("menu")
        })
    })
}
