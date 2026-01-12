import { k } from "../../core/kaplay";
import { revealIfNeeded } from "../../core/kaplay/sceneTransition";
import { bgGenerator } from "../../core/utils/ui/bgGenerator";
import { ballEntity } from "../../entity/ball";
import { observerEntity } from "../../entity/observer";
import { playerEntity } from "../../entity/player";

export function registerBattle() {
    k.scene("battle", () => {

        // Debug
        // k.debug.inspect = true;

        // LAYERING
        const Z_LAYER = {
            bg: 1,
            overlay: 3,
            player: 5,
            obs: 2,
        };

        // ==== TRANSITION ====
        revealIfNeeded();
        // BRICK
        bgGenerator({
            tileWidth: 64,
            tileHeight: 64,
            z: Z_LAYER.bg,
            sprite: "cleanbrick",
        });
        // Dark Overlay
        k.add([
            k.rect(k.width(), k.height()),
            k.pos(0, 0),
            k.color(k.rgb(0, 0, 0)),
            k.opacity(0.25),
            k.z(Z_LAYER.overlay)
        ])

        // ==== SET ENTITY ===
        const obs = observerEntity({
            z: Z_LAYER.obs
        });
        const ball = ballEntity({
            z: Z_LAYER.player + 1
        });
        const player = playerEntity({
            z: Z_LAYER.player,
            ball: ball
        });

        // ==== SET CAM ====
        const camTarget = k.add([
            k.pos(player.pos)
        ]);
        const CAM_FOLLOW_LERP = 0.08;
        const CAM_ZOOM_LERP = 0.06;
        let targetZoom = 1.15
        let currentZoom = 1.15
        // ==== CAM UPDATE ====
        k.onUpdate(() => {
            camTarget.pos = camTarget.pos.lerp(player.pos, CAM_FOLLOW_LERP)
            k.camPos(camTarget.pos)

            currentZoom = k.lerp(currentZoom, targetZoom, CAM_ZOOM_LERP)
            k.camScale(currentZoom)
        })


        // ===== EYE UPDATE =====
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