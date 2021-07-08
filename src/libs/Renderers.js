import PubSub from 'pubsub-js';
import * as THREE from 'three';

const WINDOW_RESIZE_TIMEOUT = 100;
const renderers = {};

let timeoutOnWindowResize;


function onWindowResized() {
    
    clearTimeout(timeoutOnWindowResize);
    timeoutOnWindowResize = setTimeout(onWindowResizeHandler, WINDOW_RESIZE_TIMEOUT);

}

function onWindowResizeHandler() {

    for (const name in renderers) {
        updateRendererSize(renderers[name].threeObject)
    }

    PubSub.publish('windowResized');

}

function Renderer(world, name, config) {

    if (!config || typeof config != 'object') {
        throw new Error('Renderer: unexpected typeof of config');
    }

    const clock = new THREE.Clock();
    const renderQueue = [ render ];
    let firstRender = true;
    let changes = false;

    const renderer = new THREE.WebGLRenderer(config.webGLRendererOptions);
    renderer.name = name;

    for (const key in config) {
        renderer[key] = config[key];
    }
    
    function addRenderJob(job) {

        renderQueue.push(job);

    }

    function removeRenderJob(job) {

        const idx = renderQueue.indexOf(job);
		if (idx > -1) {
			renderQueue.splice(idx, 1);
		} else {
			console.warn('Renderers: removeRenderJob: handler not found', job);
		}

    }

    function execRenderQueue(delta, time) {

        let changes = false;

        for (const job of renderQueue) {
            try {
                if (job(delta, time)) {
                    changes = true;
                }
            } catch(e) {
                throw e;
            }
        }

        if (firstRender) {
            firstRender = false;
            changes = true;
        }

        if (changes) {
            render();
            return true;
        }

        return false;
    }

    function render() {

        renderer.render( world.get3('scene.main'), world.get3('camera.main'));

    }

    function animationLoop(time) {

        const delta = clock.getDelta();

        //stats.begin();
        execRenderQueue(delta, time);
        //stats.end()

        

    }

    updateRendererSize(renderer);

    renderer.setAnimationLoop(  animationLoop );
    document.body.appendChild(renderer.domElement);

    return {
        addRenderJob,
        removeRenderJob,
        threeObject:renderer
    }

}

function updateRendererSize(renderer) {
    
    renderer.setPixelRatio( Math.min(window.devicePixelRatio, 2) );
    renderer.setSize( window.innerWidth, window.innerHeight );

}

function Renderers(world, config) {

    if (!config || typeof config != 'object') {
        throw new Error('Renderers: unexpected typeof of renderersConfig');
    }

    for (const name in config.items) {

        renderers[name] = new Renderer( world, name, config.items[name] );

    }

    world.set('renderers', renderers);
    world.set('renderer.main', renderers[config.default]);
    
    window.addEventListener('resize', onWindowResized);

    return renderers;

}

export { Renderers }