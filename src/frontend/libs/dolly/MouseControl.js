
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';

function MouseControl( world, config, dolly ) {

    let domEl;
    let controls;
    let locked = false;
    let timeout;

    function prepareLock() {
        
        console.log( 'MouseControl: trying to lock ...' );
        controls.lock();

        // https://bugs.chromium.org/p/chromium/issues/detail?id=1127223
        timeout = setTimeout( () => {
            if ( !locked ) {
                console.error( 'click again in one sec @TODO: html message' );
            }
        }, 1000 );


    }

    function onMouseDown() {
        
    }

    function onMouseMove() {
        //console.log('onMouseMove');
    }

    function installEvents() {

        console.log( 'MouseControl: installEvents' );
        domEl.addEventListener( 'click', prepareLock );
        domEl.addEventListener( 'mousedown', onMouseDown );

        controls = new PointerLockControls( dolly, document.body );

        controls.addEventListener( 'lock', onLock );
        controls.addEventListener( 'unlock', onUnLock );
        
    }

    function removeEvents() {
        
        controls.unlock();
        console.log( 'MouseControl: removeEvents' );       
        domEl.removeEventListener( 'mousedown', onMouseDown );

    }

    function onLock() {

        console.log( 'MouseControl: locked' );
        domEl.addEventListener( 'mousemove', onMouseMove );
        domEl.removeEventListener( 'click', prepareLock );
        locked = true;
        clearTimeout( timeout );
        
    }

    function onUnLock() {

        console.log( 'MouseControl: unlocked' );
        domEl.addEventListener( 'click', prepareLock );
        domEl.removeEventListener( 'mousemove', onMouseMove );
        locked = false;

    }

    function onRendererReady( channel, rendererInstance ) {
        
        domEl = rendererInstance.threeObject.domElement;
        installEvents();
        
    }

    function init() {

        PubSub.subscribe( 'XREnter', removeEvents );
        PubSub.subscribe( 'XRExit', installEvents );
        PubSub.subscribe( 'rendererReady', onRendererReady );
    }

    init();
}

export { MouseControl };
