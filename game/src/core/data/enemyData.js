import { k } from "../kaplay";
import { smoothChase, guardChase, zigzagChase, spiralChase } from "../utils/ai";

export const ENEMY_DATA = {
    onion: {
        sprite: "onion",
        hp: 1,
        damage: 5,
        scale: k.rand(1, 0.8),
        occurChance : 0.9,

        ai(player) {
            return smoothChase(player, 100);
        }
    },

    pumpkin: {
        sprite: "pumpkin",
        hp: 3,
        damage: 10,
        scale: 0.045,
        occurChance: 0.9,

        ai(player) {
            return guardChase(player, {
                speed: 200,
                guardRadius: 300,
                orbitRadius: 120
            });
        }
    },

    corn: {
        sprite: "corn",
        hp: 2,
        damage: 9,
        scale: 0.05,
        occurChance: 0.6,

        ai(player) {
            return zigzagChase(player, {
                speed: 300,
                zigzagStrength: 15,
                zigzagFrequency: 3
            });
        }
    },

    radish: {
        sprite: "radish",
        hp: 2,
        damage: 12,
        scale: 0.06, 
        occurChance: 0.6,

        ai(player){
            return spiralChase(player, {
                speed: 400
            })
        }
    }
};
