import gsap from "gsap";
import { k } from "../../core/kaplay";
import { revealIfNeeded } from "../../core/kaplay/sceneTransition";
import { bgGenerator } from "../../core/utils/ui/bgGenerator";
import { hpBarUI } from "../../ui/hpBar";
import { ballEntity } from "../../entity/ball";
import { observerEntity } from "../../entity/observer";
import { playerEntity } from "../../entity/player";
import { enemyEntity } from "../../entity/enemy";
import { ENEMY_DATA } from "../../core/data/enemyData";
import { createWaveManager } from "../../core/utils/waveManager";

export function registerBattle() {
    k.scene("battle", () => {

        // Debug
        k.debug.inspect = true;

        // ===== SET UP CONSTS AND VARS =====
        let enemyList = []; // store enemy entity
        let gameState = "countdown";
        // LAYERING
        const Z_LAYER = {
            bg: 1,
            overlay: 3,
            player: 5,
            obs: 2,
            hpBar: 6
        };

        // PLAYER BOUND
        const BOUND_PADDING = {
            left: -80,
            right: 140,
            top: -50,
            bottom: 40
        };

        let canMove = false;

        // ==== TRANSITION ====
        revealIfNeeded();

        // ==== BACKGROUND ====
        // BRICK
        bgGenerator({
            tileWidth: 64,
            tileHeight: 64,
            z: Z_LAYER.bg,
            sprite: "cleanbrick",
        });

        // MAP
        k.add([
            k.sprite("map1"),
            k.z(Z_LAYER.overlay),
            k.scale(1.2),
            k.anchor("center"),
            k.pos(k.width() / 2, k.height() / 2),
        ]);

        // ==== SET ENTITY ===
        const obs = observerEntity({
            z: Z_LAYER.obs
        });
        const ball = ballEntity({
            z: Z_LAYER.player + 1,
            boundPadding: BOUND_PADDING
        });

        const player = playerEntity({
            z: Z_LAYER.player,
            ball: ball,
            boundPadding: BOUND_PADDING,
            canMove: canMove,
            hitPower: 2000
        });
        player.setCanMove(false);

        // ==== COUNTDOWN ====
        const countdownText = k.add([
            k.text("3", {
                font: "Glad",
                size: 96,
            }),
            k.anchor("center"),
            k.color("9929EA"),
            k.pos(k.width() / 2, k.height() / 2),
            k.z(100),
            k.fixed(),
            k.opacity(0),
            k.scale(0.5),
        ]);
        const runCountdown = () => {
            const tl = gsap.timeline({
                onComplete: () => {
                    countdownText.destroy();
                    gameState = "playing";
                    player.setCanMove(true);

                    waveManager.start();
                }
            });

            const showNumber = (text) => {
                tl.set(countdownText, { opacity: 1 })
                    .set(countdownText.scale, { x: 0.5, y: 0.5 })
                    .call(() => countdownText.text = text)
                    .to(countdownText.scale, {
                        x: 1.2,
                        y: 1.2,
                        duration: 0.4,
                        ease: "back.out(3)"
                    })
                    .to(countdownText, {
                        opacity: 0,
                        duration: 0.3,
                        ease: "power2.in"
                    }, "+=0.2")
            };

            showNumber("3");
            showNumber("2");
            showNumber("1");

            // START
            tl.set(countdownText, { opacity: 1 })
                .set(countdownText.scale, { x: 0.7, y: 0.7 })
                .call(() => countdownText.text = "START")
                .to(countdownText.scale, {
                    x: 1.4,
                    y: 1.4,
                    duration: 0.5,
                    ease: "expo.out"
                })
                .to(countdownText, {
                    opacity: 0,
                    duration: 0.4
                });
        }
        runCountdown();

        // test damaage
        // k.onKeyPress("h", () => {
        //     player.damage(10);
        // });

        // ==== SET CAM ====
        const camTarget = k.add([
            k.pos(player.pos)
        ]);
        let camFocus = player;
        const CAM_FOLLOW_LERP = 0.08;
        const CAM_ZOOM_LERP = 0.06;
        const INIT_TARGET_ZOOM = 1.3;
        let targetZoom = INIT_TARGET_ZOOM;
        let currentZoom = 5
        // ==== CAM UPDATE ====
        k.onUpdate(() => {
            camTarget.pos = camTarget.pos.lerp(camFocus.pos, CAM_FOLLOW_LERP)
            k.camPos(camTarget.pos)
            currentZoom = k.lerp(currentZoom, targetZoom, CAM_ZOOM_LERP)
            k.camScale(currentZoom)
        });
        // ==== ZOOM OUT ====
        k.onKeyDown("-", () => {
            targetZoom = k.clamp(targetZoom - 0.1, 0.8, 3);
        });
        // ===== ZOOM IN =====
        k.onKeyDown("=", () => {
            targetZoom = k.clamp(targetZoom + 0.1, 0.5, 5);
        });
        k.onKeyDown("+", () => {
            targetZoom = k.clamp(targetZoom + 0.1, 0.5, 5);
        });
        // ===== RESET ZOOM =====
        k.onKeyDown("0", () => {
            targetZoom = INIT_TARGET_ZOOM;
        });

        // === FOCUS ON BALL ====
        k.onKeyDown("b", () => {
            camFocus = ball;
        });
        k.onKeyRelease("b", () => {
            camFocus = player;
        })

        // SET HP BAR
        const maxHP = player.getHp();
        let currentHP = player.getHp();

        const hpBar = hpBarUI({
            maxHP,
            currentHP,
            z: Z_LAYER.hpBar,
            width: 210
        });

        // SET HP
        player.on("hpChanged", (hp, maxHp) => {
            hpBar.setMaxHp(maxHp)
            hpBar.setHp(hp)
        });

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
        });


        const waveManager = createWaveManager({
            player,
            hpBar,
            z: Z_LAYER.player,
            spawnBounds: {
                left: -50,
                right: k.width() + 50,
                top: -50,
                bottom: k.height() + 50
            }
        })

    })
};