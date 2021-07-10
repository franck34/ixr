import * as THREE from 'three';

function RotatingCube( world, config ) {

    const size = config.size || 1;
    const color = config.color || new THREE.Color( 0x100000 );
    
    const geometry = new THREE.BoxGeometry( size, size/2, size );
    const material = new THREE.MeshStandardMaterial( { color, transparent: true, opacity: 0.5} );
    const cube = new THREE.Mesh( geometry, material );

    cube.name = 'RotatingCube';
    cube.position.x = -1;
    cube.position.y = 1.5;
    cube.position.z = 3;

    cube.castShadow = true;
    cube.receiveShadow = true;

    function rotateCube( delta, time ) {

        const v = 0.1;
        //cube.rotation.x+=v*delta/2;
        cube.rotation.y+=v*delta;

        // return true to say something changed
        return true;
    }

    world.add( cube );
    world.get('renderer.main').addRenderJob(rotateCube);

}

export { RotatingCube }