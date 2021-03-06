import PubSub from 'pubsub-js';

import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { SAOPass } from 'three/examples/jsm/postprocessing/SAOPass.js';

const WINDOW_RESIZE_TIMEOUT = 100;
const renderers = {};

let timeoutOnWindowResize;


function onWindowResized() {
    
    clearTimeout( timeoutOnWindowResize );
    timeoutOnWindowResize = setTimeout( onWindowResizeHandler, WINDOW_RESIZE_TIMEOUT );

}

function onWindowResizeHandler() {

    for ( const name in renderers ) {
        updateRendererSize( renderers[name].threeObject );
    }

    PubSub.publish( 'windowResized' );

}

function Renderer( world, name, config ) {

    if ( !config || typeof config != 'object' ) {
        throw new Error( 'Renderer: unexpected typeof of config' );
    }

    const clock = new THREE.Clock();
    const renderQueue = [ render ];
    const renderer = new THREE.WebGLRenderer( config.webGLRendererOptions );
    renderer.name = name;

    let firstRender = true;

    for ( const key in config ) {
        renderer[key] = config[key];
    }

    function addRenderJob( job ) {

        renderQueue.push( job );

    }

    function removeRenderJob( job ) {

        const idx = renderQueue.indexOf( job );

        if ( idx > -1 ) {

            renderQueue.splice( idx, 1 );

        } else {

            console.warn( 'Renderers: removeRenderJob: handler not found', job );

        }

    }

    function execRenderQueue( delta, time ) {

        let changes = false;

        for ( const job of renderQueue ) {
            //try {
            if ( job( delta, time ) ) {
                changes = true;
            }
            //} catch( e ) {
            //    throw e;
            //}
        }

        if ( firstRender ) {
            firstRender = false;
            changes = true;
        }

        if ( changes ) {
            render();
            return true;
        }

        return false;
    }


    
    /*
    // this is broken in an XR session
    function addComposer( scene, camera ) {

        const renderPass = new RenderPass( scene, camera );
        const saoPass = new SAOPass( scene, camera, false, true );

        composer = new EffectComposer( renderer );
        composer.setSize( window.innerWidth, window.innerHeight );
        
        composer.addPass( saoPass );
        composer.addPass( renderPass );
        
        renderer.setRenderTarget( composer.readBuffer );

    }
    */

    let sm, cm;

    function render() {
        
        if ( !sm ) sm = world.get3( 'scene.main' );
        if ( !cm ) cm = world.get3( 'camera.main' );
        if ( sm && cm ) {

            renderer.render( sm, cm );

            /*
            if ( !composer ) {
                renderer.render( sm, cm );
                addComposer( sm, cm );
            } else {
                composer.render();
            }
            */

        }

    }

    function animationLoop( time ) {

        const delta = clock.getDelta();

        //stats.begin();
        execRenderQueue( delta, time );
        //stats.end()

        

    }

    updateRendererSize( renderer );

    renderer.setAnimationLoop(  animationLoop );
    document.body.appendChild( renderer.domElement );

    const instance = {
        addRenderJob,
        removeRenderJob,
        threeObject:renderer
    };

    PubSub.publish( 'rendererReady' , instance );

    return instance;

}

function updateRendererSize( renderer ) {
    
    renderer.setPixelRatio( Math.min( window.devicePixelRatio, 2 ) );
    renderer.setSize( window.innerWidth, window.innerHeight );

}

function Renderers( world, config ) {

    if ( !config || typeof config != 'object' ) {
        throw new Error( 'Renderers: unexpected typeof of renderersConfig' );
    }

    for ( const name in config.items ) {

        renderers[name] = new Renderer( world, name, config.items[name] );

    }

    world.set( 'renderers', renderers );
    world.set( 'renderer.main', renderers[config.default] );
    
    window.addEventListener( 'resize', onWindowResized );

    return renderers;

}

export { Renderers }