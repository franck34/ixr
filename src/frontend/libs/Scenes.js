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

    const scene = new THREE.Scene();
    const addWireframeObject = true;

    let wireframe = false;
    let keyboardManager;

    /************************************************************************************************
     * init
     ***********************************************************************************************/
     
    init();

    /************************************************************************************************
     * Private methods
     ***********************************************************************************************/

    function setupKeyboard() {

        console.log('setupKeyboard');

        keyboardManager.addKeyListener( {
            id:'w',
            keydown:toggleWireframe,
            keyup:toggleWireframe
        } );  

    }

    function add() {

        scene.add( ...arguments );

    }

    function wireframeOn() {

        scene.traverse( child => {
        
            // attributes wireframable setted in Assets.js
            if ( child.wireframable ) {

                if ( addWireframeObject ) {

                    const wireframeGeometry = new THREE.WireframeGeometry( child.geometry );
                    const wireframeMaterial = new THREE.LineBasicMaterial( { color: 0xFFFFFF } );
                    const wireframe = new THREE.LineSegments( wireframeGeometry, wireframeMaterial );

                    child.add( wireframe );
                    child.wireframe = wireframe;

                }  else {

                    child.material.wireframe = true;

                }

                
            }

        } );

        wireframe = true;

    }

    function wireframeOff() {
        
        scene.traverse( child => {
			
            if ( child.wireframable ) {
                if ( child.wireframe ) {

                    scene.remove( child.wireframe );
                    child.remove( child.wireframe );

                } else {

                    child.material.wireframe = false;

                }
                
            }

        } );

        wireframe = false;

    }

    function toggleWireframe() {

        if ( wireframe === false ) {

            wireframeOn();

        } else {

            wireframeOff();
            
        }

    }

    function onKeyboardReady( channel, keyboardManagerInstance ) {

        keyboardManager = keyboardManagerInstance;
        setupKeyboard();

    }

    function init() {

        console.log( 'Scene', sceneName, sceneConfig );

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

            PubSub.subscribe( 'keyboardReady' , onKeyboardReady );
            
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

            console.log( '@TODO: take the first scene' );

        }

    }

    return scenes;

}

export { Scenes };




