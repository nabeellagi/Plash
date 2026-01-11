import { k } from "../../core/kaplay";
import { revealIfNeeded } from "../../core/kaplay/sceneTransition";
import { playerEntity } from "../../entity/player";

export function registerBattle(){
    k.scene("battle", () => {

        // Debug
        // k.debug.inspect = true;
        
        // ==== TRANSITION ====
        revealIfNeeded();

        // LAYERING
        const Z_LAYER = {
            player : 5,
        };

        // ==== SET ENTITY ====
        const player = playerEntity({
            z: Z_LAYER.player
        });
        
        // ==== CAM UPDATE ====
        // player.onUpdate(() => {
        //     const cam = k.camPos();
        //     const playerPos = player.pos;
        //     k.camPos(k.vec2(
        //         k.lerp(cam.x, playerPos.x, 0.1),
        //         k.lerp(cam.y, playerPos.y, 0.1)
        //     ));
        // })

        // ===== UPDATE =====
        k.onUpdate(() => {
            
        })
    })
};