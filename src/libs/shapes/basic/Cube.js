import * as THREE from 'three';

function RotatingCube( world, config ) {

    const size = config.size || 1;
    const color = config.color || new THREE.Color( 0x100000 );
    
    const geometry = new THREE.BoxGeometry( size, size, size );
    const material = new THREE.MeshPhongMaterial( { color } );
    const cube = new THREE.Mesh( geometry, material );

    cube.name = 'RotatingCube';
    cube.position.x = -1;
    cube.position.y = 1;
    cube.position.z = 3;

    cube.castShadow = true;
    cube.receiveShadow = true;

    function rotateCube( delta, time ) {

        const v = 0.8;
        cube.rotation.x+=v*delta;
        cube.rotation.y+=v*delta;

        // return true to say something changed
        return true;
    }

    world.add( cube );
    world.get('renderer.main').addRenderJob(rotateCube);

}

export { RotatingCube }