import { k } from "../../core/kaplay";
import { revealIfNeeded } from "../../core/kaplay/sceneTransition";
import { bgGenerator } from "../../core/utils/ui/bgGenerator";
import { observerEntity } from "../../entity/observer";
import { playerEntity } from "../../entity/player";

export function registerBattle() {
    k.scene("battle", () => {

        // Debug
        k.debug.inspect = true;

        // ==== TRANSITION ====
        revealIfNeeded();
        bgGenerator({
            tileWidth: 64,
            tileHeight: 64,
            z: -10,
            sprite : "cleanbrick",
        })
        
        // LAYERING
        const Z_LAYER = {
            player: 5,
            obs: 3,
        };

        // ==== SET ENTITY ====
        const player = playerEntity({
            z: Z_LAYER.player
        });
        const obs = observerEntity({
            z: Z_LAYER.obs
        });

        // ==== CAM UPDATE ====
        player.onUpdate(() => {
            const cam = k.camPos();
            const playerPos = player.pos;
            k.camPos(k.vec2(
                k.lerp(cam.x, playerPos.x, 0.1),
                k.lerp(cam.y, playerPos.y, 0.1)
            ));
        })

        // ===== UPDATE =====
        const MAX_OFFSET = 7.5;     // how far eyes can move
        const FOLLOW_SPEED = 0.2; // smoothing factor
        k.onUpdate(() => {
            const playerWorldPos = player.pos;
            const obsWorldPos = obs.root.worldPos();
            const dir = playerWorldPos.sub(obsWorldPos);
            const lookDir = dir.unit();

            obs.eyes.forEach((eye) => {
                // Target offset toward player
                const targetOffset = lookDir.scale(MAX_OFFSET);

                // Desired position = base + offset
                const targetPos = eye.basePos.add(targetOffset);

                // Smooth movement (no snapping)
                eye.pos.x = k.lerp(eye.pos.x, targetPos.x, FOLLOW_SPEED);
                eye.pos.y = k.lerp(eye.pos.y, targetPos.y, FOLLOW_SPEED);
            });
        })
    })
};