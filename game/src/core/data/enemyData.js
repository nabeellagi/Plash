import { k } from "../kaplay";
import { smoothChase, guardChase, zigzagChase } from "../utils/ai";

export const ENEMY_DATA = {
    onion: {
        sprite: "onion",
        hp: 1,
        damage: 5,
        scale: k.rand(1, 0.8),

        ai(player) {
            return smoothChase(player, 100);
        }
    },

    pumpkin: {
        sprite: "pumpkin",
        hp: 3,
        damage: 10,

        ai(player) {
            return guardChase(player, {
                speed: 120,
                guardRadius: 220,
                orbitRadius: 80
            });
        }
    },

    corn: {
        sprite: "corn",
        hp: 2,
        damage: 9,
        scale: 0.05,

        ai(player) {
            return zigzagChase(player, {
                speed: 300,
                zigzagStrength: 15,
                zigzagFrequency: 3
            });
        }
    }
};
