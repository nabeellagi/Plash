import gsap from "gsap";
import { k } from "../core/kaplay";

export function observerEntity({
    pos = k.center(),
    z,
}) {
    const root = k.add([
        k.anchor("center"),
        k.pos(pos),
        k.z(z || 0),
        {
            draw() {
                k.drawSprite({
                    sprite: "nioobs",
                    pos: k.vec2(0, 0),
                    anchor: "center",
                    scale: 0.25,
                });
            },
        },
    ]);

    const eye1 = root.add([
        k.pos(-60, -60),
        k.scale(1.3, 1.5),
        k.circle(12),
        k.color(k.rgb(0, 0, 0)),
        {
            basePos: k.vec2(-60, -60)
        }
    ]);
    const eye2 = root.add([
        k.pos(40, -50),
        k.scale(1.3, 1.5),
        k.circle(12),
        k.color(k.rgb(0, 0, 0)),
        {
            basePos: k.vec2(40, -50)
        }
    ]);
    const eyes = [eye1, eye2];

    return {
        root,
        eyes
    }
}