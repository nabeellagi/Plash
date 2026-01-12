import gsap from "gsap";
import { k } from "../../kaplay";

export function hpBar({
    width,
    height,
    maxHP,
    currentHP,
    z = 0,
    pos = k.center(),
}){
    const root = k.add([
        k.anchor("center"),
        k.pos(pos),
        k.z(z),
    ]);

    // SET HP UI
    
}