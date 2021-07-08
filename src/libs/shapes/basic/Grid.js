import * as THREE from 'three';

function Helper( world, config ) {

    const size = config.size || 100;
    const divisions = config.division || 100;

    const mesh = new THREE.GridHelper( size, divisions );

    mesh.name = 'BasicGridHelper';
    mesh.position.x = 0;
    mesh.position.y = 0;
    mesh.position.z = 0;

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    world.add( mesh );

}

export { Helper }