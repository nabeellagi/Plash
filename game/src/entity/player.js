import gsap from "gsap";
import { k } from "../core/kaplay";

// let altKeyListenerAdded = false;
// if (!altKeyListenerAdded) {
//     window.addEventListener("keydown", (e) => {
//         if (e.key === "Alt") {
//             e.preventDefault();
//         }
//     });
//     altKeyListenerAdded = true;
// }

export function playerEntity({
    pos = k.center(),
    speed = 240,
    hp = 64,
    z,
    canMove,
    hitPower = 1500,
    boundPadding,
    // onBallCollide = () => { }
} = {}) {
    // ==== SETUP VAR ====
    const TILT = {
        max_tilt: 12,
        tilt_speed: 0.1,
        reset_speed: 0.2
    };
    const STRETCH = {
        x: 1.06,
        y: 0.9,
        x_diag: 0.4,
        y_diag: 1.02,
        speed: 0.15,
        reset: 0.2
    };
    const BASE_SCALE = 0.045;
    let currentTilt = 0;

    let isInvincible = false;
    const HIT_COOLDOWN = 0.6;

    // ==== SET ROOT =====
    const root = k.add([
        k.anchor("center"),
        k.pos(pos),
        k.z(z || 0),
        "player",
        {
            hp: hp,
            maxHp: hp,
            damage: (amount) => {
                root.hp -= amount;
                console.log("ouch")
            },
            getHp: () => root.hp,
            getMaxHp: () => root.maxHp,

            // playerEntity
            setHp(value) {
                root.hp = k.clamp(value, 0, root.maxHp)
                root.trigger("hpChanged", root.hp, root.maxHp)
            },

            setMaxHp(value, refill = true) {
                root.maxHp = value
                if (refill) root.hp = value
                root.trigger("hpChanged", root.hp, root.maxHp)
            },

            refillHp() {
                root.hp = root.maxHp
                root.trigger("hpChanged", root.hp, root.maxHp)
            },
            resetInvincibility() {
                isInvincible = false
            },

            getNumHit: () => { return numHit },

            setCanMove: (value) => { canMove = value; },
        },
    ]);

    // ==== SPRITE ====
    const sprite = root.add([
        k.sprite("ael"),
        k.scale(BASE_SCALE),
        k.anchor("center"),
        k.z(1),
        k.opacity(1),
        k.color()
    ]);

    const hitBox = root.add([
        k.circle(34),
        k.anchor("center"),
        k.opacity(0),
        k.pos(0, 12),
        k.area({ shape: new k.Rect(k.vec2(0, 0), 58, 52) }),
        k.body({ isStatic: true }),
        k.scale(1),
        "player",

        {
            damage: (amount) => {
                if (isInvincible) return;

                root.hp = k.clamp(root.hp - amount, 0, hp);
                isInvincible = true;
                sprite.color = k.rgb(255, 100, 100);
                console.log("damage")
                // Blink
                gsap.fromTo(sprite, {
                    opacity: 0.6
                }, {
                    opacity: 0.1,
                    duration: 0.1,
                    repeat: 7,
                    yoyo: true,
                    ease: "power1.inOut",
                    onComplete: () => {
                        k.wait(HIT_COOLDOWN, () => {
                            isInvincible = false;
                            sprite.opacity = 1;
                            sprite.color = k.rgb(255, 255, 255);
                        });
                    }
                });
                root.trigger("hpChanged", root.hp, root.maxHp);

                k.shake(6);

                // ==== DEATH CASE ====
                if (root.hp <= 0) {
                    root.trigger("dead");
                }
            }
        }
    ]);

    // ==== BAT WEAPON ====
    let batFlipped = false;
    const BAT_POS = {
        normal: k.vec2(-25, -10),
        flipped: k.vec2(25, -10),
    };

    const batRoot = root.add([
        k.anchor("center"),
        k.pos(-25, -10),
        k.z(sprite.z - 1),
        k.rotate(-20),
        k.scale(1)
    ]);

    const batSprite = batRoot.add([
        k.sprite("bat"),
        k.scale(BASE_SCALE * 1.7),
        k.anchor("center"),
        k.z(sprite.z - 1),
        k.rotate(1),
        k.pos(-20, -10)
    ]);

    const batHitBox = batRoot.add([
        k.rect(70, 25),
        k.opacity(0),
        k.pos(-60, -30),
        k.area(),
        k.rotate(-45),
        k.scale(1),
        k.body({ isStatic: true }),
        "batHitBox" // Add tag for collision detection
    ]);

    // ===== SWING BAT =====
    let isSwinging = false;

    const batSwing = () => {
        if (isSwinging) return;
        isSwinging = true;
        sprite.use(k.sprite("aelswing"));
        sprite.scale.y = BASE_SCALE * 1.5;
        let initialAngle = batRoot.angle;

        // SWING ANIMATION
        gsap.to(batRoot, {
            angle: batFlipped ? 45 + 90 : -45 - 90,
            duration: 0.2,
            ease: "sine.inOut",
            onComplete: () => {
                gsap.to(batRoot, {
                    angle: initialAngle,
                    duration: 0.2,
                    onComplete: () => {
                        isSwinging = false;
                        sprite.use(k.sprite("ael"));
                        sprite.scale.y = BASE_SCALE;
                    }
                });
            }
        });
    };

    // Input for swing
    k.onKeyPress("z", batSwing);
    k.onKeyPress("enter", batSwing);

    // ==== BAT HIT DETECTION ====
    let currentPower = hitPower;
    let addPower = 10;
    let numHit = 0;

    batHitBox.onCollide("ball", (b) => {
        if (!isSwinging) return

        const dir = batFlipped
            ? k.vec2(1, -0.35)
            : k.vec2(-1, -0.35)
        k.shake(3);

        b.hit(dir, currentPower)
        numHit++;

        // Add power
        if (numHit % 10 === 0) {
            currentPower += addPower;
        }
    });

    // Which key pressed last will be the direction
    let lastVertical = 0;
    let lastHorizontal = 0;

    k.onKeyPress(["w", "up"], () => lastVertical = -1);
    k.onKeyPress(["s", "down"], () => lastVertical = 1);
    k.onKeyPress(["a", "left"], () => lastHorizontal = -1);
    k.onKeyPress(["d", "right"], () => lastHorizontal = 1);

    root.onUpdate(() => {
        // MOVE CHARACTER
        if (!canMove) return;

        let dir = k.vec2(0, 0);
        const upPressed = k.isKeyDown("w") || k.isKeyDown("up");
        const downPressed = k.isKeyDown("s") || k.isKeyDown("down");
        const leftPressed = k.isKeyDown("a") || k.isKeyDown("left");
        const rightPressed = k.isKeyDown("d") || k.isKeyDown("right");

        // Vertical axis
        if (upPressed || downPressed) {
            dir.y = lastVertical;
        }
        // Horizontal axis
        if (leftPressed || rightPressed) {
            dir.x = lastHorizontal;
        }

        // Apply movement
        if (dir.len() > 0) {
            const unitDir = dir.unit();
            let moveSpeed = speed;

            // SLOW DOWN
            if (k.isKeyDown("shift")) {
                moveSpeed *= 0.3;
            }
            // RUN
            else if (k.isKeyDown("space")) {
                moveSpeed *= 1.45;
            }
            root.move(unitDir.scale(moveSpeed));

            root.pos.x = k.clamp(root.pos.x, boundPadding.left, k.width() + boundPadding.right);
            root.pos.y = k.clamp(root.pos.y, boundPadding.top, k.height() + boundPadding.bottom);
        }

        // TILT
        if (dir.x < 0) {
            // LEFT
            currentTilt = k.lerp(currentTilt, -TILT.max_tilt, TILT.tilt_speed);
        } else if (dir.x > 0) {
            // RIGHT
            currentTilt = k.lerp(currentTilt, TILT.max_tilt, TILT.tilt_speed);
        } else {
            // RESET
            currentTilt = k.lerp(currentTilt, 0, TILT.reset_speed);
        }
        sprite.angle = currentTilt;

        if (dir.x !== 0 && dir.y !== 0) {
            // DIAGONAL MOVEMENT
            sprite.scale.x = k.lerp(
                sprite.scale.x,
                BASE_SCALE * STRETCH.x_diag,
                STRETCH.speed
            );
            sprite.scale.y = k.lerp(
                sprite.scale.y,
                BASE_SCALE * STRETCH.y_diag,
                STRETCH.speed
            );
            // RESIZE HIT BOX
            hitBox.scale.x = k.lerp(
                hitBox.scale.x,
                STRETCH.x_diag,
                STRETCH.speed
            );
            hitBox.scale.y = k.lerp(
                hitBox.scale.y,
                STRETCH.y_diag,
                STRETCH.speed
            );
        } else if (dir.x !== 0 || dir.y !== 0) {
            sprite.scale.x = k.lerp(
                sprite.scale.x,
                BASE_SCALE * STRETCH.x,
                STRETCH.speed
            );
            sprite.scale.y = k.lerp(
                sprite.scale.y,
                BASE_SCALE * STRETCH.y,
                STRETCH.speed
            );
            hitBox.scale.x = k.lerp(
                hitBox.scale.x,
                STRETCH.x,
                STRETCH.speed
            );
            hitBox.scale.y = k.lerp(
                hitBox.scale.y,
                STRETCH.y,
                STRETCH.speed
            );
        } else {
            sprite.scale.x = k.lerp(
                sprite.scale.x,
                BASE_SCALE,
                STRETCH.reset
            );
            sprite.scale.y = k.lerp(
                sprite.scale.y,
                BASE_SCALE,
                STRETCH.reset
            );
            hitBox.scale.x = k.lerp(
                hitBox.scale.x,
                1,
                STRETCH.reset
            );
            hitBox.scale.y = k.lerp(
                hitBox.scale.y,
                1,
                STRETCH.reset
            );
        }
    });

    // BAT AIM
    k.onKeyPress("/", () => {
        batFlipped = !batFlipped;
        batRoot.pos = batFlipped ? BAT_POS.flipped : BAT_POS.normal;
        batRoot.scale.x = batFlipped ? -1 : 1;
        batHitBox.angle = batFlipped ? 45 : -45;
    });
    k.onKeyPress("x", () => {
        batFlipped = !batFlipped;
        batRoot.pos = batFlipped ? BAT_POS.flipped : BAT_POS.normal;
        batRoot.scale.x = batFlipped ? -1 : 1;
        batHitBox.angle = batFlipped ? 45 : -45;
    });

    return root;
}