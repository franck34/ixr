import * as THREE from 'three';


function SimpleCamera( world, name, config ) {

    if (!config || typeof config != 'object') {
        throw new Error('Camera: unexpected typeof of config');
    }

    const fov = config.camera.fov || 60;
    const near = config.camera.near || 0.1;
    const far = config.camera.far || 10;

    const camera = new THREE.PerspectiveCamera( fov, window.innerWidth/window.innerHeight, near, far );
    camera.name = name;
    camera.type = 'simple';
    
    if (config.camera.position) {
        camera.position.set(config.camera.position.x, config.camera.position.y, config.camera.position.z);
    } else {
        camera.position.set(0, 1.6, 0);
    }

    if (config.camera.lookAt) {
        camera.lookAt(config.camera.lookAt.x, config.camera.lookAt.y, config.camera.lookAt.z);
    } else {
        //camera.lookAt(0, 0, 0);
    }
    
    if (config.showHelper) {
        const helper = new THREE.CameraHelper( camera );
        world.add( helper );
    }

    world.add( camera );

    console.log('SimpleCamera: adding', camera);

    return {
        threeObject:camera
    }

}

function DollyCamera( world, name, config ) {

    console.log('new DollyCamera', name, config);

    const fov = config.camera.fov || 60;
    const near = config.camera.near || 0.1;
    const far = config.camera.far || 10;

    const dummyCam = new THREE.Object3D();
    const dolly = new THREE.Object3D();

    const camera = new THREE.PerspectiveCamera( fov, window.innerWidth/window.innerHeight, near, far );
    camera.name = name;
    camera.type = 'dolly';
    camera.position.set(config.camera.position.x, config.camera.position.y, config.camera.position.z);

    camera.add( dummyCam );

    dolly.position.set(config.dolly.position.x, config.dolly.position.y, config.dolly.position.z);
    dolly.rotation.y = Math.PI;  
    dolly.add(camera);    
    
    world.set('dolly', dolly);
    world.set('dolly.dummyCam', dummyCam);

    world.add(dolly);
    console.log('DollyCamera: adding', camera);

    return {
        threeObject:camera,
        dolly,
        dummyCam,
    }
}


function Cameras(world, config) {

    const cameras = {};

    if (!config || typeof config != 'object') {
        throw new Error('Cameras: unexpected typeof of scenesConfig');
    }

    for (const name in config.items) {

        const cameraConfig = config.items[name];
        
        if (cameraConfig.enable === false) {
            continue;
        }

        if (cameraConfig.type === 'dolly') {

            cameras[name] = new DollyCamera( world, name, cameraConfig );

        } else if (cameraConfig.type === 'simple') {

            cameras[name] = new SimpleCamera( world, name, cameraConfig );

        }

    }

    world.set('cameras', cameras);
    world.set('camera.main', cameras[config.default]);

    return cameras;

}

export { Cameras }

