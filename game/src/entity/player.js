import gsap from "gsap";
import { k } from "../core/kaplay";

export function playerEntity({
    pos = k.center(),
    speed = 240,
    hp = 64
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
        speed: 0.15,
        reset: 0.2
    };

    const BASE_SCALE = 0.045;
    let currentTilt = 0;

    // ==== SET ROOT =====
    const root = k.add([
        k.anchor("center"),
        k.pos(pos),
        {
            hp: hp,
            damage : (amount) => {
                root.hp -= amount;
            },

            canMove: () => canMove,
            setCanMove : (value) => { canMove = value; },
        }
    ]);
    // ==== SPRITE ====
    const sprite = root.add([
        k.sprite("ael"),
        k.scale(BASE_SCALE),
        k.anchor("center"),
    ]);
    const hitBox = root.add([
        k.circle(34),
        k.anchor("center"),
        k.opacity(0),
        k.pos(0, 12),
        k.area({ shape: new k.Rect(k.vec2(0,0), 58, 52) })
    ])

    // ==== HURT ==== 

    // ON UPDATE
    root.onUpdate(() => {
        // MOVE
        if (!canMove) return;
        let dir = k.vec2(0, 0);
        if (k.isKeyDown("w") || k.isKeyDown("up")) dir.y -= speed;
        if (k.isKeyDown("s") || k.isKeyDown("down")) dir.y += speed;
        if (k.isKeyDown("a") || k.isKeyDown("left")) dir.x -= speed;
        if (k.isKeyDown("d") || k.isKeyDown("right")) dir.x += speed;
        if (dir.len() > 0) {
            root.move(dir.unit().scale(speed));
        };

        // SLOW DOWN
        if (k.isKeyDown("shift")){
            root.move(dir.unit().scale(speed * -0.5));
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

        // === STRETCH (SUBTLE) ===
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
        }

    });
    return root;
}