import * as THREE from 'three';


function AmbientLight( world, name, config ) {

    if (!config || typeof config != 'object') {
        throw new Error('AmbientLight: unexpected typeof of config');
    }

    const intensity = config.intensity || 0.5;
    const color = config.color || new THREE.Color(0xffffff);

    const light = new THREE.AmbientLight( color, intensity );
    light.name = name;
    light.type = 'ambient';
    
    if (config.position) {
        light.position.set(config.position.x, config.position.y, config.position.z);
    }
    
    world.add( light );

    return {
        threeObject:light
    }

}

function DirectionalLight( world, name, config ) {

    if (!config || typeof config != 'object') {
        throw new Error('DirectionalLight: unexpected typeof of config');
    }

    const intensity = config.intensity || 0.1;
    const color = config.color || new THREE.Color( 0xffffff );
    const light = new THREE.DirectionalLight( color, intensity );
   
    light.name = name;
    light.castShadow = true;

    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 10;

    const intensidad=50;

    light.shadow.camera.left = -intensidad;
    light.shadow.camera.right = intensidad;
    light.shadow.camera.top = intensidad;
    light.shadow.camera.bottom = -intensidad;

    if (config.position) {
        light.position.set(config.position.x, config.position.y, config.position.z);
    }

    light.target.position.set(0, -1, 0);

    world.add( light );
    world.add( light.target );
    
    if (config.showHelper) {
        const helper = new THREE.DirectionalLightHelper(light);
        helper.name = 'DirectionalLightHelper';
        world.add( helper );
        world.add( new THREE.CameraHelper( light.shadow.camera ) );
    }
    
    return {
        threeObject:light
    }
}

function PointLight( world, name, config ) {

    if (!config || typeof config != 'object') {
        throw new Error('PointLight: unexpected typeof of config');
    }

    const color = config.color || new THREE.Color( 0xffffff );
    const intensity = config.intensity || 0.2;
    const distance = config.distance || 100;
    const decay = config.decay || 20;
    const light = new THREE.PointLight( color, intensity, distance, decay );

    light.name = name;
    light.castShadow = true;

    if (config.position) {
        light.position.set(config.position.x, config.position.y, config.position.z);
    }

    light.shadow.mapSize.width = 512; // default
    light.shadow.mapSize.height = 512; // default
    light.shadow.camera.near = 10;
    light.shadow.camera.far = 100; // default

    world.add( light );
    
    if (config.showHelper) {
        const helper = new THREE.PointLightHelper(light);
        helper.name = 'PointLightHelper';
        world.add( helper );
    }

    return {
        threeObject:light
    }
}


function HemisphereLight( world, name, config ) {

    if (!config || typeof config != 'object') {
        throw new Error('HemisphereLight: unexpected typeof of config');
    }

    const colorUp = config.colorUp || new THREE.Color( 0xffffff );
    const colorDown = config.colorDown || new THREE.Color( 0xffffff );
    const intensity = config.intensity || 0.2;
    const light = new THREE.HemisphereLight( colorUp, colorDown, intensity );

    light.name = name;
    light.castShadow = true;

    if (config.position) {
        light.position.set(config.position.x, config.position.y, config.position.z);
    }

    world.add( light );
    
    if (config.showHelper) {
        const helper = new THREE.HemisphereLightHelper( light );
        helper.name = 'HemisphereLightHelper';
        world.add( helper );
    }

    return {
        threeObject: light
    }
}

function Lights(world, config) {

    const lights = {};

    if (!config || typeof config != 'object') {
        throw new Error('Lights: unexpected typeof of config');
    }

    for (const name in config.items) {

        const lightConfig = config.items[name];
        
        if (lightConfig.enable === false) {
            continue;
        }

        if (lightConfig.type === 'ambient') {
            lights[name] = new AmbientLight( world, name, lightConfig );
        } else if (lightConfig.type === 'directional') {
            lights[name] = new DirectionalLight( world, name, lightConfig );
        } else if (lightConfig.type === 'point') {
            lights[name] = new PointLight( world, name, lightConfig );
        } else if (lightConfig.type === 'hemisphere') {
            lights[name] = new HemisphereLight( world, name, lightConfig );
        }

    }

    world.lights = lights;

    return lights;

}

export { Lights }

