import { Loader } from './Loader.js';
import { Renderers } from './Renderers.js';
import { Scenes } from './Scenes.js';
import { PBRs } from './PBRs.js';
import { Assets } from './Assets.js';
//import { Cameras } from './Cameras.js';
import { Lights } from './Lights.js';
import { Keyboard } from './Keyboard.js';
//import { Controls } from './Controls.js';
import { Dolly } from './dolly/Dolly.js';
import { XR } from './XR.js';
//import { UI } from './ui/UI.js';

function MyWorld( config ) {

    const world = {
        current:{},
        config
    };

    function set( id, object ) {

        if ( world[id] ) {
            throw new Error( `object ${id} already registered` );
        }

        world[id] = object;
    }

    function get( id ) {
        return world[id];
    }

    function get3( id ) {
        if ( !world[id] ) {
            //log.warn(`world dont have object with id ${id}`);
            return;
        }
        if ( world[id].threeObject ) {
            return world[id].threeObject;
        }
        return world[id];
    }

    function add( parentId, object ) {
        if ( !object ) {
            object = parentId;
            parentId = 'scene.main';
        }
        
        const parent = get3( parentId );
        if ( !parent ) {
            throw new Error( `could not add child to ${parentId}, object not registered` );
        }

        parent.add( object );
    }

    return {

        add,
        set,
        get,
        get3,

    };
}

function World( config ) {

    const world = new MyWorld( config );
    world.rayTargets = [];
    world.config = config;
  
    new Scenes( world, config.scenes );
    new Keyboard( world, config.keyboard );
    new Renderers( world, config.renderers );
    new Dolly( world, config.dolly );
    new Loader( world, config.assets );
    new Assets( world, config.assets );
    new PBRs( world, config.pbrs );
    new Lights( world, config.lights );
    new XR( world, config.xr );
    
    //new Controls( world, config.controls );
    //new Cameras( world, config.cameras );
    //new UI(world, config.ui);

    return world;

}

export { World }