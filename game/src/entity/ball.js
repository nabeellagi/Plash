import gsap from "gsap";
import { k } from "../core/kaplay";

export function ballEntity({
    pos = k.center(),
    radius = 16,
}) {
    const root = k.add([
        k.anchor("center"),
        k.pos(pos),
    ]);
    
}