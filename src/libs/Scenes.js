import * as THREE from 'three';

//@TODO: https://stackoverflow.com/questions/16226693/three-js-show-world-coordinate-axes-in-corner-of-scene

function Scene(world, sceneName, sceneConfig) {

    if (!sceneConfig || typeof sceneConfig != 'object') {
        throw new Error('Scene: unexpected typeof of sceneConfig');
    }

    console.log('Scene', sceneName, sceneConfig);

    let wireframe = false;

    const wireframes = [];
    const scene = new THREE.Scene();
    scene.name = sceneName;

    for (const key in sceneConfig) {
        
        const value = sceneConfig[key];

        // setup fog
        if (key === 'fog') {

            if (sceneConfig[key].enable) {
                scene[key] = value;
            }

            continue;
        }

        // setup axesHelper
        if (key === 'axesHelper' && value) {

            const axesHelper = new THREE.AxesHelper( value );
            scene.add(axesHelper);
            scene.axesHelper = axesHelper;

        }

        scene[key] = sceneConfig[key];

        setupKeyboard();
    }

    function setupKeyboard() {
        
        const keyboardManager = world.get('keyboardManager');
        if (keyboardManager) {
            keyboardManager.addKeyListener({
                key:'w',
                event:'keydown',
                handler:toggleWireframe
            });
        }

    }

    function add() {
        console.log('Scene:add', ...arguments);
        scene.add(...arguments);
    }

    function toggleWireframe() {

    	if (wireframe === false) {

            console.log('Scene:toggleWireframe', 'adding wireframes');

		    scene.traverse(child => {
			
                if (child.isMesh) {

                    if (child.font) {
                        // dont wireframe fonts ! (browser crash)
                        return;
                    }
                    
				    const wireframeGeometry = new THREE.WireframeGeometry( child.geometry );
				    const wireframeMaterial = new THREE.LineBasicMaterial( { color: 0xFFFFFF } );
				    const wireframe = new THREE.LineSegments( wireframeGeometry, wireframeMaterial );
				    wireframe.name = 'wireframe_all';
				    child.add(wireframe);
                    child.wireframe = wireframe;
                    //child.visible = false;

    			}
		    });

		    wireframe = true;

    	} else {

            console.log('Scene:toggleWireframe', 'removing wireframes', wireframes );

            scene.traverse(child => {
			
                if (child.wireframe) {

                    scene.remove(child.wireframe);
				    child.remove(child.wireframe);
                    
    			}

		    });
		    wireframe = false;

        }

        console.log('done');
    }

    // for debugging
    window.scene = scene;

    return {
        add,
        toggleWireframe,
        threeObject:scene
    }

}


function Scenes(world, config) {

    const scenes = {};

    if (!config || typeof config != 'object') {
        throw new Error('Scenes: unexpected typeof of config');
    }

    for (const name in config.items) {

        scenes[name] = new Scene( world, name, config.items[name] );

    }

    world.set('scenes', scenes)
    world.set('scene.main', scenes[config.default]);

    return scenes;

}

export { Scenes }

