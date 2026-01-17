import gsap from "gsap";
import { k } from "../core/kaplay";

export function hpBarUI({
    width = 100,
    maxHP,
    currentHP,
    z = 0,
    pos = k.center(),
}) {
    const root = k.add([
        k.anchor("center"),
        k.pos(k.width() / 2 - width / 2, k.height() - 100),
        k.z(z),
        k.fixed(), {
            setHp: (newHp) => { setHp(newHp) }
        }
    ]);

    // SET HP UI
    const height = 32;
    const currentWidth = (currentHP / maxHP) * width;

    const bgBar = root.add([
        k.rect(width, height, { radius: 5 }),
        k.color(k.rgb(208, 39, 82)),
        k.anchor("left"),
        k.pos(0, 0)
    ]);
    const currentBar = root.add([
        k.rect(currentWidth, height, { radius: 5 }),
        k.color("#7132CA"),
        k.anchor("left"),
        k.pos(0, 0)
    ]);
    const hpText = root.add([
        k.text(`${currentHP}/${maxHP}`, {
            font: "Glad",
            size: 25,
        }),
        k.anchor("center"),
        k.pos(width / 2, 0),
        k.z(10),
        k.scale(1)
    ]);

    // TEXT IDLE
    const hpTextTl = gsap.timeline();
    hpTextTl.to(hpText.scale, {
        x: 1.2,
        y: 1.15,
        duration: 1,
        
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
    });

    // HELPERS
    const setHp = (newHp) => {
        currentHP = k.clamp(newHp, 0, maxHP);
        const newWidth = (currentHP / maxHP) * width;
        gsap.to(currentBar, {
            width: newWidth,
            duration: 0.5,
            ease: "power2.out"
        });
        hpText.text = `${currentHP}/${maxHP}`;
    };

    return root;
}