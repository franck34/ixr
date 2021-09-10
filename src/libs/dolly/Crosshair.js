import * as THREE from 'three';

function Crosshair(world, config) {

    const material = new THREE.LineBasicMaterial({ color: 0xAAFFAA });

    // crosshair size
    const x = 0.01;
    const y = 0.01;

    const geometry = new THREE.BufferGeometry();

    const vertices = new Float32Array( [
         0,    y,    0,
         0,   -y,    0,
         0,    0,    0,
    
         0,    0,    0,
         x,    0,    0,
        -x,    0,    0
    ] );

    geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );

    const crosshair = new THREE.Line( geometry, material );

    // place it in the center
    const crosshairPercentX = 50;
    const crosshairPercentY = 50;
    const crosshairPositionX = (crosshairPercentX / 100) * 2 - 1;
    const crosshairPositionY = (crosshairPercentY / 100) * 2 - 1;

    function adjustToCamera(camera) {
        crosshair.position.x = crosshairPositionX * camera.aspect;
        crosshair.position.y = crosshairPositionY;
        crosshair.position.z = -0.3;
    }

    return {
        adjustToCamera,
        mesh:crosshair
    }
}

export { Crosshair }