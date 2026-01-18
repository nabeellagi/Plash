import gsap from "gsap";
import { k } from "../core/kaplay";
import { particle } from "../core/utils/particle";

export function enemyEntity({
    pos = k.center(),
    sprite,
    speed,
    damage,
    hp,
    scale = 1,
    scaleEntity = 1,
    z = 0,
    ai,
    particleSprite,
    color = k.rgb(255, 255, 255)
}) {

    // SET UP
    const TILT = {
        max: 30,
        speed: 0.12,
        reset: 0.18,
    }

    let currentTilt = 0
    let lastPos = pos.clone()

    let isDead = false
    let isInvincible = false

    let isKnockedDown = false
    let knockDir = k.vec2(0, 0)
    let knockSpeed = 0


    const root = k.add([
        k.pos(pos),
        k.anchor("center"),
        k.z(z),
        k.body(),
        k.scale(scaleEntity),
        k.area({ shape: new k.Rect(k.vec2(0, 0), 48, 48) }),
        "enemy",
        {
            hp,
            takeDamage(amount = 1) {
                if (isInvincible || isDead) return

                particle({
                    x: root.pos.x,
                    y: root.pos.y,
                    sprite: particleSprite
                });

                if (this.hp > 0) {
                    k.play(sprite + "_hurt", {
                        volume: 0.8
                    });
                }

                this.hp -= amount
                blink()

                if (this.hp <= 0) {
                    die()
                }
            },
            knockDown(dir, force = 420, duration = 0.4) {
                if (isDead || isKnockedDown) return

                isKnockedDown = true
                knockDir = dir.unit()
                knockSpeed = force

                spriteObj.angle = -45 * Math.sign(dir.x)
                spriteObj.scale.y *= 0.9

                k.wait(duration, () => {
                    isKnockedDown = false
                    spriteObj.angle = 0
                    spriteObj.scale.y = scale
                })
            },
        },
    ])

    const spriteObj = root.add([
        k.sprite(sprite),
        k.scale(1),
        k.anchor("center"),
        k.scale(scale),
        k.color(color),
    ])

    // ===== BLINK EFFECT =====
    function blink() {
        if (isInvincible) return
        isInvincible = true

        gsap.killTweensOf(spriteObj)

        spriteObj.color = k.rgb(255, 100, 100)

        gsap.fromTo(
            spriteObj,
            { opacity: 0.6 },
            {
                opacity: 0.15,
                duration: 0.1,
                repeat: 7,
                yoyo: true,
                ease: "power1.inOut",
                onComplete: () => {
                    spriteObj.opacity = 1
                    spriteObj.color = k.rgb(255, 255, 255)
                    isInvincible = false
                }
            }
        )
    }
    // ===== DEATH =====
    function die() {
        isDead = true

        gsap.to(root.scale, {
            x: 0,
            y: 0,
            duration: 0.25,
            ease: "back.in(2)",
            onComplete: () => root.destroy(),
        })

        k.play(sprite + "_died", {
            volume: 0.8
        });
    }

    // ===== PLAYER COLLISION =====
    root.onCollide("player", (p) => {
        if (isDead || isInvincible) return
        p.damage(damage)
        k.shake(7);
        blink();

        k.wait(0.25, () => {
            die()
        })
    });

    // ===== BALL COLLISION =====
    root.onCollide("ball", (b) => {
        if (!b.isActive()) return
        k.shake(3);
        root.takeDamage()
    })

    // ===== UPDATE =====
    root.onUpdate(() => {
        if (isDead) return

        // ===== KNOCKDOWN PHYSICS =====
        if (isKnockedDown) {
            root.move(knockDir.scale(knockSpeed))
            knockSpeed = k.lerp(knockSpeed, 0, 0.15)
            return
        }

        // ===== NORMAL MOVEMENT =====
        const movement = root.pos.sub(lastPos)
        lastPos = root.pos.clone()

        const dirX = movement.x

        if (Math.abs(dirX) > 0.1) {
            currentTilt = k.lerp(
                currentTilt,
                k.clamp(dirX, -1, 1) * TILT.max,
                TILT.speed
            )
        } else {
            currentTilt = k.lerp(currentTilt, 0, TILT.reset)
        }

        spriteObj.angle = currentTilt

        if (ai) ai(root)
    })

    return root
}