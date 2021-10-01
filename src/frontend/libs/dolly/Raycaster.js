import * as THREE from 'three';

function Raycaster(world, config, options) {

    const raycaster = new THREE.Raycaster();
    const renderer = world.get('renderer.main');
    const scene = world.get('scene.main');

    const rayOrigin = new THREE.Vector3( 0, 0, -0.1 );
    const rayDirection = new THREE.Vector3( 0, 0, -1 );
    const point = new THREE.Vector3();

    const ballGeometry = new THREE.SphereGeometry(0.2, 8, 8);
    const ballMaterial = new THREE.MeshBasicMaterial( { color : "#ffff00", wireframe : true, visible: false } );
    const ball = new THREE.Mesh( ballGeometry, ballMaterial );
    scene.add(ball);

    let assets;
    let intersects = [];
    let callbackIntercept;
    let meshOrigin;
    let showTargetBall = false;

    function init() {

        assets = world.get('assets');
        if (!assets) {
            // retry
            console.warn('Raycaster initialization failed: no raycaster assets, retrying');
            setTimeout(init, 500);
            return;
        }

        if (!assets.rayAssets) {
            log.error('Raycaster initialization failed: raycaster is undefined');
            return;
        }

        
        renderer.addRenderJob(cast);

    }

    function cast() {

        // reposition origin
        meshOrigin.getWorldPosition(rayOrigin);
        raycaster.set(rayOrigin, rayDirection);

        intersects = raycaster.intersectObjects( assets.rayAssets, true );

        if (intersects.length && callbackIntercept) {
            
            callbackIntercept(intersects);

            if (showImpacts) {
                point.copy(intersects[0].point);
                ball.position.set(point);
            }
        
        }

    }

    function onIntercept(callback) {
        callbackIntercept = callback;
    }

    function setOrigin( mesh ) {
        meshOrigin = mesh;
        init();
    }

    function showImpacts() {
        showTargetBall = true;
    }


    return {
        onIntercept,
        setOrigin,
        showImpacts,
    }
}

export { Raycaster }