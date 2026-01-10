import kaplay from "kaplay";
import { preloadAll } from "./preload";

export const k = kaplay({
    global: false,
    debug: true,
    crisp: true,
    pixelDensity: 1.4,
    width: 1250,
    height: 700
});
preloadAll();