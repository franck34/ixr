import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


function ControlOrbitControls( world, name, config ) {

    if (!config || typeof config != 'object') {
        throw new Error('ControlOrbitControls: unexpected typeof of config');
    }

    const controls = new OrbitControls(
        world.get3('camera.main'),
        world.get3('renderer.main').domElement
    );

    /*
    controls.enableDamping = config.enableDamping || true;
    controls.dampingFactor = config.dampingFactor || 0.05;
    controls.screenSpacePanning = config.screenSpacePanning || false;
    controls.minDistance = config.minDistance || 1;
    controls.maxDistance = config.maxDistance || 10;
    controls.maxPolarAngle = config.maxPolarAngle || Math.PI/2;
    */

    controls.maxPolarAngle = Math.PI/1.5;
    controls.enablePan = true;
    controls.enableDamping = false;
    controls.target.set(0, 1.6, 0);
    controls.update();

    function renderOrbitControl() {
        controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
    }

    world.get('renderer.main').addRenderJob(renderOrbitControl);

    return {
        threeObject:controls
    }

}

function Controls(world, config) {

    const controls = {};

    if (!config || typeof config != 'object') {
        throw new Error('Controls: unexpected typeof of config');
    }

    for (const name in config.items) {

        const controlConfig = config.items[name];
        
        if (controlConfig.enable === false) {
            continue;
        }

        if (controlConfig.type === 'OrbitControls') {
            controls[name] = new ControlOrbitControls( world, name, controlConfig );
        } else {
            throw new Error('unknow config type');
        }
        

    }

    world.set( 'controls', controls) ;
    world.set( 'control.main', controls[config.default] );

    return controls;

}

export { Controls }

