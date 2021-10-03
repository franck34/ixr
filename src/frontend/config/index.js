import { renderers } from './renderers.js';
import { shaders } from './shaders.js';
import { scenes } from './scenes.js';
import { pbrs } from './pbrs.js';
import { assets } from './assets.js';
import { lights } from './lights.js';
import { keyboard } from './keyboard.js';
//import { controls } from './unused/controls.js';
//import { cameras } from './unused/cameras.js';
import { dolly } from './dolly.js';

const config = {

    logLevel:'debug',
    renderers,
    shaders,
    scenes,
    pbrs,
    assets,
    lights,
    keyboard,
    //controls,
    //cameras,
    dolly
    
};

localStorage.setItem( 'log', config.logLevel || 'debug' );

export { config };
