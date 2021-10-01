import { renderers } from './renderers.js';
import { shaders } from './shaders.js';
import { scenes } from './scenes.js';
import { pbrs } from './pbrs.js';
import { assets } from './assets.js';
import { cameras } from './cameras.js';
import { lights } from './lights.js';
import { keyboard } from './keyboard.js';
import { controls } from './controls.js';
import { dolly } from './dolly.js';

const config = {

    logLevel:'debug',
    renderers,
    shaders,
    scenes,
    pbrs,
    assets,
    lights,
    cameras,
    keyboard,
    controls,
    dolly
    
};

localStorage.setItem( 'log', config.logLevel || 'debug' );

export { config };
