import { k } from "../../kaplay";

export function bgGenerator({
    tileWidth = 64,
    tileHeight = 64,
    scale = 1,
    sprite,
    z = -10,
} = {}) {

    const w = tileWidth * scale;
    const h = tileHeight * scale;

    const cols = Math.ceil(k.width() / w);
    const rows = Math.ceil(k.height() / h);

    const root = k.add([
        k.pos(0, 0),
        k.anchor("topleft"),
        k.z(z),
        k.fixed(),
        {
            draw() {
                for (let y = 0; y < rows; y++) {
                    for (let x = 0; x < cols; x++) {
                        k.drawSprite({
                            sprite,
                            pos: k.vec2(x * w, y * h),
                            scale,
                            anchor: "topleft",
                        });
                    }
                }
            },
        },
    ]);

    return { root };
}