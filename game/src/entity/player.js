import gsap from "gsap";
import { k } from "../core/kaplay";

export function playerEntity({
    pos = k.center(),
    speed = 240,
    hp = 64,
    z
} = {}) {
    // k.debug.inspect = true;
    // ==== SETUP VAR ====
    let canMove = true;
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

    // ==== SET ROOT =====
    const root = k.add([
        k.anchor("center"),
        k.pos(pos),
        k.z(z || 0),
        {
            hp: hp,
            damage: (amount) => {
                root.hp -= amount;
            },

            canMove: () => canMove,
            setCanMove: (value) => { canMove = value; },
        },
    ]);
    // ==== SPRITE ====
    const sprite = root.add([
        k.sprite("ael"),
        k.scale(BASE_SCALE),
        k.anchor("center"),
        k.z(1)
    ]);
    const hitBox = root.add([
        k.circle(34),
        k.anchor("center"),
        k.opacity(0),
        k.pos(0, 12),
        k.area({ shape: new k.Rect(k.vec2(0, 0), 58, 52) })
    ])

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
        k.rotate(0),
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
        // k.anchor("center"),
        k.opacity(0),
        k.pos(-60, -30),
        k.area(),
        k.rotate(-45),
        k.scale(1)
    ]);

    // ==== HURT ==== 

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
    }
    // Input for swing
    k.onKeyPress("z", batSwing);
    k.onKeyPress("enter", batSwing);
    // ON UPDATE

    // Which key pressed the last will be the direction
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
        if (
            k.isKeyDown("w") || k.isKeyDown("up") ||
            k.isKeyDown("s") || k.isKeyDown("down")
        ) {
            dir.y = lastVertical
        }

        // Horizontal axis
        if (
            k.isKeyDown("a") || k.isKeyDown("left") ||
            k.isKeyDown("d") || k.isKeyDown("right")
        ) {
            dir.x = lastHorizontal
        }

        if (dir.len() > 0) {
            root.move(dir.unit().scale(speed));
        };

        // SLOW DOWN
        if (k.isKeyDown("shift")) {
            root.move(dir.unit().scale(speed * -0.7));
        }
        // RUN
        else if (k.isKeyDown("space")) {
            root.move(dir.unit().scale(speed * 0.45));
        }
        // TILT
        if (dir.x < 0) {
            // LEFT
            currentTilt = k.lerp(currentTilt, -TILT.max_tilt, TILT.tilt_speed);
        } else if (dir.x > 0) {
            // RIGHT
            currentTilt = k.lerp(currentTilt, TILT.max_tilt, TILT.tilt_speed);
        }
        else {
            // RESET
            currentTilt = k.lerp(currentTilt, 0, TILT.reset_speed);
        }
        sprite.angle = currentTilt;

        // === STRETCH ===
        if (dir.x !== 0 && dir.y !== 0) {
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
        }
        if (dir.x !== 0 || dir.y !== 0) {
            // Moving horizontally
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
        }
        else {
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
        }
    });
    // BAT AIM
    k.onKeyPress("control", () => {
        batFlipped = !batFlipped;
        batRoot.pos = batFlipped ? BAT_POS.flipped : BAT_POS.normal;
        batRoot.scale.x = batFlipped ? -1 : 1;
        batHitBox.angle = batFlipped ? 45 : -45;
    });


    // CTRL S BUG LOLL
    window.addEventListener("keydown", (e) => {
        if (e.key.toLocaleLowerCase() === "s" && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
        }
    });

    return root;
}