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
    corn: 'sprites/corn.png',
    pumpkin: 'sprites/pumpkin.png',
    radish : 'sprites/radish.png',
    onionParticle: 'sprites/onionParticle.png',
    cornParticle: 'sprites/cornParticle.png',
    pumpkinParticle: 'sprites/pumpkinParticle.png',
    radishParticle: 'sprites/radishParticle.png',
};

const FONTS = {
    Doodlebean : 'fonts/Doodlebean.ttf',
    Glad : 'fonts/GladlyAccept.ttf'
};

const SFX = {
    corn_appear: 'sfx/corn_appear.wav',
    corn_died: 'sfx/corn_died.wav',
    corn_hurt: 'sfx/corn_hurt.wav',

    onion_appear: 'sfx/onion_appear.wav',
    onion_died: 'sfx/onion_died.wav',
    onion_hurt: 'sfx/onion_hurt.wav',

    pumpkin_appear: 'sfx/pumpkin_appear.wav',
    pumpkin_died: 'sfx/pumpkin_died.wav',
    pumpkin_hurt: 'sfx/pumpkin_hurt.wav',

    radish_appear: 'sfx/radish_appear.wav',
    radish_died: 'sfx/radish_died.wav',
    radish_hurt: 'sfx/radish_hurt.wav',

    whoosh : 'sfx/whoosh.wav'
}

const MUSICS = {
    battle : 'musics/battle.ogg'
}

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
    for(const [key, value] of Object.entries(SFX)){
        k.loadSound(key, value);
    }
    
    // LOAD MUSIC
    for(const [key, value] of Object.entries(MUSICS)){
        k.loadSound(key, value);
    }
}