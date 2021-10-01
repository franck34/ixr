import anylogger from 'anylogger';
const log = anylogger( 'Scenes' );
console.log(log);

import * as THREE from 'three';


//@TODO: https://stackoverflow.com/questions/16226693/three-js-show-world-coordinate-axes-in-corner-of-scene

function Scene( context, sceneName, sceneConfig ) {

    /************************************************************************************************
     * Integrity checks
     ***********************************************************************************************/
    
    console.assert( typeof context === 'object','context should be an object' );
    console.assert( typeof sceneConfig === 'object', 'sceneConfig should be an object' );

    /************************************************************************************************
     * Variables & constantes (locales)
     ***********************************************************************************************/

    const wireframes = [];
    const scene = new THREE.Scene();

    let wireframe = false;

    /************************************************************************************************
     * init
     ***********************************************************************************************/
     
    init();

    /************************************************************************************************
     * Private methods
     ***********************************************************************************************/

    function setupKeyboard() {
        
        const keyboardManager = context.get( 'keyboardManager' );
        if ( keyboardManager ) {
            keyboardManager.addKeyListener( {
                key:'w',
                event:'keydown',
                handler:toggleWireframe
            } );
        }

    }

    function add() {
        log.info( 'add', ...arguments );
        scene.add( ...arguments );
    }

    function toggleWireframe() {

        if ( wireframe === false ) {

            log.info( 'toggleWireframe', 'adding wireframes' );

            scene.traverse( child => {
			
                if ( child.isMesh ) {

                    if ( child.font ) {
                        // dont wireframe fonts ! (browser crash)
                        return;
                    }
                    
                    const wireframeGeometry = new THREE.WireframeGeometry( child.geometry );
                    const wireframeMaterial = new THREE.LineBasicMaterial( { color: 0xFFFFFF } );
                    const wireframe = new THREE.LineSegments( wireframeGeometry, wireframeMaterial );
                    wireframe.name = 'wireframe_all';
                    child.add( wireframe );
                    child.wireframe = wireframe;
                    //child.visible = false;

                }

            } );

            wireframe = true;

        } else {

            console.log( 'Scene:toggleWireframe', 'removing wireframes', wireframes );

            scene.traverse( child => {
			
                if ( child.wireframe ) {

                    scene.remove( child.wireframe );
                    child.remove( child.wireframe );
                    
                }

            } );
            wireframe = false;

        }

        console.log( 'done' );
    }

    function init() {

        log.info( 'Scene', sceneName, sceneConfig );        

        scene.name = sceneName;

        for ( const key in sceneConfig ) {
            
            const value = sceneConfig[key];

            // setup fog
            if ( key === 'fog' ) {

                if ( sceneConfig[key].enable ) {

                    scene[key] = value;

                }

                continue;
            }

            // setup axesHelper
            if ( key === 'axesHelper' && value ) {

                const axesHelper = new THREE.AxesHelper( value );
                scene.add( axesHelper );
                scene.axesHelper = axesHelper;

            }

            scene[key] = sceneConfig[key];

            setupKeyboard();
        }

    }

    return {
        add,
        toggleWireframe,
        threeObject:scene
    };

}


function Scenes( context, config ) {

    /************************************************************************************************
     * Integrity checks
     ***********************************************************************************************/

    console.assert( typeof context === 'object','context should be an object' );
    console.assert( typeof config === 'object','config should be an object' );

    /************************************************************************************************
     * Variables & constantes (locales)
     ***********************************************************************************************/

    const scenes = {};
    context.set( 'scenes', scenes );

    /************************************************************************************************
     * init
     ***********************************************************************************************/
     
    init();

    /************************************************************************************************
     * Private methods
     ***********************************************************************************************/

    function init() {


        for ( const name in config.items ) {

            scenes[name] = new Scene( context, name, config.items[name] );

        }

        if ( config.default ) {

            console.log( 'setting scene.main with value from config', config.default );
            context.set( 'scene.main', scenes[ config.default ] );

        } else {

            log.debug( '@TODO: take the first scene' );

        }

    }

    return scenes;

}

export { Scenes };




