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
        title: "Tools Used",
        content: `
Made with :
Kaplay JS (also GSAP)
Resprite and Ibis Paint
Audacity (and me voice) for the monster's noise`
    },
    {
        title: "Credits",
        content: `
1. Rusted Studio on itch.io
2. FROL Game Music on itch.io
3. Cup Nooble on itch.io
`
    },
];


export function registerCredit() {
    k.scene("credit", () => {
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
                size: 28,
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
            k.color(hour > 17 ? k.rgb(230, 230, 255) : k.rgb(0,0,0)),
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
    });
}