import { k } from ".";

const IMAGES = {
    logo : 'logo.png',
    grass : 'bg/grass.png',
    bush : 'bg/bush.png',
    dry : 'bg/dry.png',
    night: 'bg/night.png',
    map1: 'bg/map1.png'
};

const SPRITES = {
    btn1 : 'sprites/btn1.png',
    ael : 'sprites/ael.png',
    aelhurt : 'sprites/aelhurt.png',
    aellow : 'sprites/aellow.png',
    aelswing : 'sprites/aelswing.png',
    nioobs : 'sprites/nioobs.png',
    bat : 'sprites/bat.png',
    cleanbrick : 'sprites/cleanbrick.png',
    glass: 'sprites/glass.png',
    melonball: 'sprites/melonball.png',
    chamber: 'sprites/chamber.png',
    onion: 'sprites/onion.png',
    corn: 'sprites/corn.png'
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