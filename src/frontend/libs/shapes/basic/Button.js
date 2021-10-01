import * as THREE from 'three';

function Button( world, config ) {

    const size = config.size || 1;
    const color = config.color || new THREE.Color( 0xFFFFFF );
    
    const geometry = new THREE.BoxGeometry( 0.4, 0.2, 0.08 );
    const material = new THREE.MeshPhongMaterial( { color } );
    const cube = new THREE.Mesh( geometry, material );

    cube.name = 'Button';
    cube.position.x = 0;
    cube.position.y = 1.6;
    cube.position.z = 0;

    cube.castShadow = true;
    cube.receiveShadow = true;

    world.add( cube );

}

export { Button }