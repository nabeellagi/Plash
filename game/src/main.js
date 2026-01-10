import { k } from "./core/kaplay";
import { registerCredit } from "./scenes/credit";
import { registerBattle } from "./scenes/game/battle";
import { registerMenu } from "./scenes/menu";
import { registerTutorial } from "./scenes/tutorial";

registerMenu();
registerCredit();
registerTutorial();

registerBattle();

// k.go("menu");
k.go("battle");