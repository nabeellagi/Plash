import gsap from "gsap";
import { k } from "../core/kaplay";
import { Btn1 as Btn } from "../ui/btn";

function moveSlide(direction, length, currentIndex) {
    if (direction === "right") {
        return (currentIndex + 1) % length;
    }

    if (direction === "left") {
        return (currentIndex - 1 + length) % length;
    }

    return currentIndex;
}

const tutoriel = [
    {
        title: "Objective",
        content: `
Survive for as long as you can.

Your goal is to reach the highest wave possible and earn the greatest score you can by dodging enemies and defeating them using your bat weapons.

Each wave becomes more dangerous. Enemies grow stronger, faster, and more numerous — only skill and positioning will keep you alive.
`,
        contentSound: 'tut1'
    },
    {
        title: "Who Are You?",
        content: `
You play as Ael, a small green monster armed with a bat.

Your performance is closely monitored by Dr. Cabby Greenbeil, the mysterious observer behind the scenes.
Every enemy you defeat earns you score, and every wave you survive proves your combat efficiency.
`,
        contentSound: 'tut2'
    },
    {
        title: "How to Move & Attack",
        content: `
Movement:
- Use WASD or Arrow Keys to move around the arena.

Attacking:
- Aim toward an enemy and press Z or Enter to attack repeatedly.

Bat Control:
- Press X or Slash ( / ) to flip your bat direction from left to right.
`,
        contentSound: 'tut3'
    },
    {
        title: "The Ball Attacks",
        content: `
For extra damage, use the Watermelon Ball — highly recommended.

A Watermelon Ball spawns directly on top of you.
- Aim and smash it with your bat.
- Each successful hit makes the ball faster and bouncier.

Advanced Attack:
- Press SPACE to shoot smaller balls in all directions.
- These balls deal lighter damage but are excellent for clearing space when surrounded.
`,
        contentSound: 'tut4'
    },
    {
        title: "Survival Tips",
        content: `
- Keep moving. Standing still is the fastest way to get overwhelmed.
- Use the bouncing ball to deal massive damage to groups of enemies.
- Flip your bat direction often to control enemy flow.
`,
        contentSound: 'tut5'
    },
    {
        title: "Camera Controls",
        content: `
Zoom Controls:
- Press '-' to zoom out and see more enemies.
- Press '=' or '+' to zoom in for closer combat.
- Press '0' to instantly reset the camera zoom to default.

Ball Tracking:
- Hold 'B' to make the camera focus on the Watermelon Ball.
- Release 'B' to return the camera focus back to Ael.
`,
        contentSound: 'tut6'
    },
    {
        title: "Night Mode",
        content: `
Night Mode is a special visual challenge.

How to Unlock:
- Play the game after 17:00 (5 PM) local time to activate Night Mode automatically.

Night Mode Effect:
- The battlefield becomes darker.
- Visibility is reduced, increasing tension and difficulty.
Canceling Night Mode:
- During the countdown phase, press 'Q' to disable Night Mode before the battle starts.
`,
        contentSound: 'tut7'
    }

]



export function registerTutorial() {
    k.scene("tutorial", () => {
        let index = 0;

        // ===== SET BACKGROUND =====
        let bgSprite = null;
        const hour = new Date().getHours();

        if (hour > 17) {
            bgSprite = "night";
        } else {
            bgSprite = "grass";
        }
        const grassBg = k.add([
            k.sprite(bgSprite),
            k.pos(k.center()),
            k.anchor("center"),
        ]);
        // ==== BOX ====
        const box = k.add([
            k.rect(900, 600, {
                radius: 22
            }),
            k.pos(k.width() / 2, k.height() / 2),
            k.anchor("center"),
            k.color("#4a5be6"),
            k.scale(0.8),
            k.opacity(0)
        ]);
        gsap.timeline()
            .to(box.scale, {
                x: 1,
                y: 1,
                duration: 0.35,
                ease: "back.out"
            })
            .to(box, {
                opacity: 1,
                duration: 0.5
            }, "<")

        const title = box.add([
            k.text(tutoriel[index].title, {
                font: "Glad",
                size: 40,
                letterSpacing: 1.2
            }),
            k.pos(0, -box.height / 2 + 50),
            k.anchor("center")
        ]);
        const content = box.add([
            k.text(tutoriel[index].content, {
                font: "Doodlebean",
                size: 25,
                width: box.width - 80,
                lineSpacing: 10,
                letterSpacing: 1.5
            }),
            k.pos(-box.width / 2 + 40, -box.height / 2 + 120),
            k.anchor("topleft")
        ]);
        k.add([
            k.text("Press right and left key to read the next part", {
                font: "Doodlebean",
                size: 22
            }),
            k.pos(k.width() / 2, 30),
            k.anchor("top"),
            k.color(hour > 17 ? k.rgb(230, 230, 255) : k.rgb(0, 0, 0)),
        ]);
        k.add([
            k.text("CLICK AT THAT GREEN GUY FOR VOICE LINE (FOR EACH PAGES)", {
                font: "Doodlebean",
                size: 22
            }),
            k.pos(k.width() / 2, k.height() - 30),
            k.anchor("top"),
            k.color(hour > 17 ? k.rgb(230, 230, 255) : k.rgb(0, 0, 0)),
        ]);
        const returnBtn = Btn({
            text: "Back",
            pos: k.vec2(120, k.height() - 90),
            onClick: () => {
                k.go("menu")
            }
        });

        // Move with keys
        k.onKeyPress("right", () => {
            index = moveSlide("right", tutoriel.length, index);

            title.text = tutoriel[index].title;
            content.text = tutoriel[index].content ?? "";
        });

        k.onKeyPress("left", () => {
            index = moveSlide("left", tutoriel.length, index);

            title.text = tutoriel[index].title;
            content.text = tutoriel[index].content ?? "";
        });

        // ==== GREENBEIL AND SOUND ====
        let currentVoice = null;
        let isVoicePlaying = false;
        function stopVoice() {
            if (currentVoice) {
                currentVoice.stop();
                currentVoice = null;
                isVoicePlaying = false;
            }
        }
        function playVoice() {
            if (isVoicePlaying) return;

            const soundKey = tutoriel[index].contentSound;
            if (!soundKey) return;

            stopVoice();

            currentVoice = k.play(soundKey, {
                volume: 1.3
            });
            isVoicePlaying = true;

            currentVoice.onEnd(() => {
                isVoicePlaying = false;
                currentVoice = null;
            });
        }

        const greenBeil = k.add([
            k.sprite("nio"),
            k.scale(0.2),
            k.anchor("center"),
            k.pos(k.width() / 2 + 500, k.height() - 30),
            k.area(),
            "greenbeil"
        ]);

        greenBeil.onClick(() => {
            playVoice();
        });
        greenBeil.onHover(() => {
            k.setCursor("pointer");
        });
        greenBeil.onHoverEnd(() => {
            k.setCursor("default");
        });

    });
}