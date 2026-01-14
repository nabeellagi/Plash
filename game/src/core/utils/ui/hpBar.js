import gsap from "gsap";
import { k } from "../../kaplay";

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
        k.fixed()
    ]);

    // SET HP UI
    const height = 32;
    const currentWidth = (currentHP / maxHP) * width;

    const bgBar = root.add([
        k.rect(width, height, { radius: 5 }),
        k.color(k.rgb(208, 39, 82)),
        k.pos(0, 0)
    ]);
    const currentBar = root.add([
        k.rect(currentWidth, height, { radius: 5 }),
        k.color("7132CA")
    ]);
    const hpText = root.add([
        k.text(`${currentHP}/${maxHP}`, {
            font: "Glad",
            size: 25,
        }),
        k.anchor("center"),
        k.pos(width / 2, height / 2),
        k.z(10),
        k.scale(1)
    ]);
    const hpTextTl = gsap.timeline();
}