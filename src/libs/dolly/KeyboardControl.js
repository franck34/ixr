
function KeyboardControl(world, config, dolly) {

    /* some bugs left, the keyboard behavior is not yet perfect */

    let keyboardManager;

    function onShiftKeyDown( ev ) {

        if ( ev.code != 'ShiftLeft' ) return false;

        // SHIFT KEY PRESSED (run)

        if ( dolly.status === 'running' ) {

            // already running, no changes

        } else {

            if (dolly.status === 'walking') {

                console.log('SWITCH WALKING TO RUNNING');

                dolly.status = 'running';

                if ( dolly.moveX ) {
                    dolly.moveXoriginal = dolly.moveX;
                    dolly.moveX = dolly.moveX * dolly.runRatio;
                }

                if ( dolly.moveY ) {
                    dolly.moveYoriginal = dolly.moveY;
                    dolly.moveY = dolly.moveY * dolly.runRatio;
                }

                if ( dolly.moveZ ) {
                    dolly.moveZoriginal = dolly.moveZ;
                    dolly.moveZ = dolly.moveZ * dolly.runRatio;
                }

            }

        }

        return true;

    }

    function onShiftKeyUp( ev ) {
        
        if ( ev.code != 'ShiftLeft' ) return false;

        if ( dolly.status ===' running' ) {

            console.log('SWITCH RUNNING TO WALKING', dolly.moveZ);
            dolly.status = 'walking';

        }

        return true;

    }
    
    function showStatus() {
        
        if ( dolly.moveX === 0 && dolly.moveY === 0 && dolly.moveZ === 0 ) {

            if (dolly.status != 'idle') {

                console.log(`SWITCH ${dolly.status.toUpperCase()} TO IDLE`);
                dolly.moving = false;
                dolly.dollyReset();
                
            }
            
        }

    }

    function addKeyEvent(key, moveDirection, moveAxis, moveAxisValue) {

        keyboardManager.addKeyListener( {
            id:key,
            keydown:( delta, time, ev ) => {

                if (onShiftKeyDown(ev)) {

                    if (dolly.status === 'walking') {

                        console.log('SWITCH WALKING TO RUNNING');
                        dolly.status = 'running';

                    }
                        
                    return;
                }

                if (dolly.status === 'idle') {

                    console.log('SWITCH IDLE TO WALKING');
                    dolly.status = 'walking';

                }

                if ( moveDirection ) {

                    dolly[ moveDirection ] = true;
                    dolly.moving = true;
                }
                
                if ( moveAxis ) {

                    dolly[ moveAxis ] = moveAxisValue;
                    if (ev.shiftKey) {
                        dolly[ moveAxis ] = moveAxisValue * dolly.runRatio;
                    }
                    dolly.moving = true;

                }
                
            },

            keyup:( delta, time, ev ) => {

                if (onShiftKeyUp(ev)) {

                    if (dolly.status === 'running') {

                        console.log('SWITCH RUNNING TO WALKING');
                        dolly.status = 'walking';
                        
                        if ( dolly.moveX ) {
                            dolly.moveX = dolly.moveXoriginal || 0;
                        }

                        if ( dolly.moveY ) {
                            dolly.moveY = dolly.moveYoriginal || 0;
                        }

                        if ( dolly.moveZ ) {
                            dolly.moveZ = dolly.moveZoriginal || 0;
                        }

                    }

                    showStatus();
                    return;
                }

                if ( moveDirection ) {
                    dolly[ moveDirection ] = false;
                }
                
                if ( moveAxis ) {
                    dolly[ moveAxis ] = 0;
                }

                showStatus();
                
            }
        });  

    }

    function installEvents() {

        addKeyEvent('KeyW', 'moveForward', 'moveZ', -1);
        addKeyEvent('KeyS', 'moveBackward', 'moveZ', 1);
        addKeyEvent('KeyA', 'moveLeft', 'moveX', -1);
        addKeyEvent('KeyD', 'moveRight', 'moveX', 1);
        addKeyEvent('ShiftLeft');
        
    }

    function init() {

        keyboardManager = world.get('keyboardManager');

        if ( !keyboardManager ) {

            console.warn('could not attach dolly to keyboardManager; keyboardManager not found');

        } 
        
        // Note: keyboardManager handle install/remove events for XR enter/exit
        installEvents();
    
    }

    init();
    
}

export { KeyboardControl }