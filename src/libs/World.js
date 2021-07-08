import { Renderers } from './Renderers.js';
import { Scenes } from './Scenes.js';
import { Assets } from './Assets.js';
import { Cameras } from './Cameras.js';
import { Lights } from './Lights.js';
import { Keyboard } from './Keyboard.js';
import { Controls } from './Controls.js';
import { XR } from './XR.js';

function MyWorld(config) {

    const world = {
        current:{}
    };

    function set(id, object) {

        if (world[id]) {
            throw new Error(`object ${id} already registered`);
        }

        world[id] = object;
    }

    function get(id) {
        return world[id];
    }

    function get3(id) {
        if (!world[id]) {
            throw new Error(`world dont have object with id ${id}`);
        }
        return world[id].threeObject;
    }

    function add(parentId, object) {
        if (!object) {
            object = parentId;
            parentId = 'scene.main';
        }
        
        const parent = get3(parentId);
        if (!parent) {
            throw new Error(`could not add child to ${parentId}, object not registered`);
        }

        parent.add(object);
    }

    return {

        add,
        set,
        get,
        get3,

    }
}

function World(config) {

    const world = new MyWorld(config);
    world.rayTargets = [];

    new Scenes( world, config.scenes );
    new Renderers( world, config.renderers );
    new Assets( world, config.assets );
    new Lights( world, config.lights );
    new Cameras( world, config.cameras );
    
    new Keyboard( world, config.keyboard );
    //new Controls( world, config.controls );

    new XR(world, config.xr );
    return world;

}

export { World }