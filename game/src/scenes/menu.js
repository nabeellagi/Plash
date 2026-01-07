import { k } from "../core/kaplay";
import { gsap } from "gsap";
import { Btn1 } from "../ui/btn";

export function registerMenu(){
    k.scene("menu", () => {
        // ===== SET BACKGROUND =====
        k.setBackground(k.rgb(255,255,255))

        let bgSprite = null;
        const hour = new Date().getHours();
        
        if(hour >= 7 && hour < 18){
            bgSprite = "grass";
        }else{
            bgSprite = "night";
        }
        const grassBg = k.add([
            k.sprite(bgSprite),
            k.pos(k.center()),
            k.anchor("center"),
        ]);
        const bushBg = k.add([
            k.sprite("bush"),
            k.pos(k.width()/2, k.height()/2 + 50),
            k.anchor("center"),
            k.scale(1),
        ]);
        gsap.to(bushBg.scale, {
            x:1.02,
            y:0.95,
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
            k.pos(k.width()/2 - 200, k.height()/2 - 10),
            k.anchor("center")
        ]);

        // ==== UI ====
        const startBtn = Btn1({
            text : "Start",
            pos : k.vec2(k.width()/2 + 200, k.height()/2 - 100)
        });
        const tutorialBtn = Btn1({
            text : "Tutorial",
            pos : k.vec2(k.width()/2 + 200, k.height()/2)
        });
        const creditsBtn = Btn1({
            text : "Credit",
            pos : k.vec2(k.width()/2 + 200, k.height()/2 + 100)
        });
    });
}

/**

 */