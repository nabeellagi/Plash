import { k } from "../../core/kaplay";
import { revealIfNeeded } from "../../core/kaplay/sceneTransition";

export function registerBattle(){
    k.scene("battle", () => {
        revealIfNeeded();
    })
};