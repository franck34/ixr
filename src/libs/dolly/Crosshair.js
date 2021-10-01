import * as THREE from 'three';

function Crosshair(world, config) {

    const material = new THREE.LineBasicMaterial( { color: 0xAAFFAA, visible: false } );

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

    function adjustToCamera( camera ) {

        // take care of camera aspect

        const percentX = 50;
        const percentY = 50;
        const positionX = ( percentX / 100 ) * 2 - 1;
        const positionY = ( percentY / 100 ) * 2 - 1;

        crosshair.position.x = positionX * camera.aspect;
        crosshair.position.y = positionY;
        crosshair.position.z = -0.3;

    }

    return {
        adjustToCamera,
        mesh:crosshair
    };
}

export { Crosshair };