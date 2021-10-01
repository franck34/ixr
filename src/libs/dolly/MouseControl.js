
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';

function MouseControl( world, config, dolly ) {

    let controls;
    let locked = false;
    let timeout;

    function prepareLock() {
        
        console.log('MouseControl: trying to lock ...');
        controls.lock();

        // https://bugs.chromium.org/p/chromium/issues/detail?id=1127223
        timeout = setTimeout(() => {
            if (!locked) {
                console.error('click again in one sec @TODO: html message');
            }
        }, 1000);


    }

    function onMouseDown() {
        
    }

    function onMouseMove() {
        //console.log('onMouseMove');
    }

    function installEvents() {

        console.log('MouseControl: installEvents');
        window.addEventListener( 'click', prepareLock );
        window.addEventListener( 'mousedown', onMouseDown );
        
    }

    function removeEvents() {
        
        controls.unlock();
        console.log('MouseControl: removeEvents');       
        window.removeEventListener( 'mousedown', onMouseDown );

    }

    function onLock() {

        console.log('MouseControl: locked');
        window.addEventListener( 'mousemove', onMouseMove );
        window.removeEventListener( 'click', prepareLock );
        locked = true;
        clearTimeout( timeout );
        
    }

    function onUnLock() {

        console.log('MouseControl: unlocked');
        window.addEventListener( 'click', prepareLock );
        window.removeEventListener( 'mousemove', onMouseMove );
        locked = false;

    }

    function init() {
        
        controls = new PointerLockControls( dolly, document.body );

        controls.addEventListener( 'lock', onLock );
        controls.addEventListener( 'unlock', onUnLock );

        installEvents();

        PubSub.subscribe('XREnter', removeEvents);
        PubSub.subscribe('XRExit', installEvents);
    }

    init();
}

export { MouseControl }