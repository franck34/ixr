import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';

function MouseControl( world, config, dolly ) {

    let controls;

    function onClick() {
        controls.lock();
    }

    function onMouseDown() {
        
    }

    function installEvents() {

        window.addEventListener( 'click', onClick );
        window.addEventListener( 'mousedown', onMouseDown );

    }

    function init() {
        
        controls = new PointerLockControls( dolly, document.body );
        installEvents();

    }

    init();
}

export { MouseControl }