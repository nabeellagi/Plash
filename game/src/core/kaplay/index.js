import kaplay from "kaplay";
import { preloadAll } from "./preload";

export const k = kaplay({
    global: false,
    debug: true,
    crisp: true,
    pixelDensity: 1.15,
    width: 1250,
    height: 700,
    maxFPS: 60,
});
preloadAll();