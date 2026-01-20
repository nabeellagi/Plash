import { k } from "../core/kaplay";
import { gsap } from "gsap";
import { Btn1 } from "../ui/btn";
import { transitionClose } from "../core/kaplay/sceneTransition";

let menubgm = null;
export function registerMenu() {
    k.scene("menu", () => {
        // k.debug.inspect = true;
        // ===== SET BACKGROUND =====
        let bgSprite = null;
        const hour = new Date().getHours();

        if (hour > 17) {
            bgSprite = "night";
        } else {
            bgSprite = "grass";
        }
        const grassBg = k.add([
            k.sprite(bgSprite),
            k.pos(k.center()),
            k.anchor("center"),
        ]);
        const bushBg = k.add([
            k.sprite("bush"),
            k.pos(k.width() / 2, k.height() / 2 + 50),
            k.anchor("center"),
            k.scale(1),
        ]);
        gsap.to(bushBg.scale, {
            x: 1.02,
            y: 0.95,
            yoyo: true,
            repeat: -1,
            duration: 3,
            ease: "power2.inOut"
        })
        const dryBg = k.add([
            k.sprite("dry"),
            k.pos(k.center()),
            k.anchor("center")
        ]);
        const logo = k.add([
            k.sprite("logo"),
            k.scale(0.4),
            k.pos(k.width() / 2 - 200, k.height() / 2 - 10),
            k.anchor("center")
        ]);

        // ==== BGM ====
        if (!menubgm) {
            menubgm = k.play("morning", {
                volume: 0.3,
                loop: true
            });
        }
        const stopBgm = () => {
            if (menubgm) {
                gsap.to(menubgm, {
                    duration: 1.5,
                    volume: 0,
                    onComplete: () => menubgm.stop(),
                    ease: "power2.out",
                });
                menubgm = null;
            }
        };
        // ==== UI ====
        const startBtn = Btn1({
            text: "Start",
            pos: k.vec2(k.width() / 2 + 150, k.height() / 2 - 100),
            onClick: () => {
                transitionClose("battle", {
                    direction: "left",
                    duration: 0.7
                })
                stopBgm();
            }
        });

        const scoreBtn = Btn1({
            text: "Score",
            pos: k.vec2(k.width() / 2 + 350, k.height() / 2),
            onClick: () => k.go('score')
        });
        const tutorialBtn = Btn1({
            text: "Tutorial",
            pos: k.vec2(k.width() / 2 + 150, k.height() / 2),
            onClick: () => k.go('tutorial')
        });
        const creditsBtn = Btn1({
            text: "Credit",
            pos: k.vec2(k.width() / 2 + 150, k.height() / 2 + 100),
            onClick: () => k.go("credit")
        });
    });
}

/**

 */