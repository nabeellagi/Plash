import { k } from "../../core/kaplay";
import { revealIfNeeded } from "../../core/kaplay/sceneTransition";
import { playerEntity } from "../../entity/player";

export function registerBattle(){
    k.scene("battle", () => {
        revealIfNeeded();

        // ==== SET PLAYER ====
        const player = playerEntity();
        
        // ==== CAM UPDATE ====
        player.onUpdate(() => {
            
        })
        // ===== UPDATE =====
        k.onUpdate(() => {
            
        })
    })
};