import { k } from ".";

const IMAGES = {
    logo : 'logo.png',
    grass : 'bg/grass.png',
    bush : 'bg/bush.png',
    dry : 'bg/dry.png',
    night: 'bg/night.png'
};

const SPRITES = {
    btn1 : 'sprites/btn1.png'
};

const FONTS = {
    Doodlebean : 'fonts/Doodlebean.ttf',
    Glad : 'fonts/GladlyAccept.ttf'
};

export function preloadAll(){
    // LOAD IMAGE
    for(const [key, value] of Object.entries(IMAGES)){
        k.loadSprite(key, value);
    };
    // LOAD SPRITE
    for(const [key, value] of Object.entries(SPRITES)){
        k.loadSprite(key, value);
    }

    // LOAD FONT
    for(const [key, value] of Object.entries(FONTS)){
        k.loadFont(key, value);
    }
    
    // LOAD SFX
    
    // LOAD MUSIC
}