import * as THREE from "three/build/three.module.js";

function loadTextureRepeater(world, file, repeater) {

    const map = world.loader.textureLoader.load( `${file}` );
    map.repeat.set( repeater, repeater );
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.magFilter = THREE.NearestFilter;
    map.encoding = THREE.sRGBEncoding;
    return map;
    
}

function textureFrom3DTextureMe(world, file, repeater) {
    
    // https://3dtextures.me/
    return {
        diffuse:loadTextureRepeater(world, `${file}_COLOR.jpg`, repeater),
        displacement:loadTextureRepeater(world, `${file}_DISP.png`, repeater),
        mask:loadTextureRepeater(world, `${file}_MASK.jpg`, repeater),
        normal:loadTextureRepeater(world, `${file}_NORM.jpg`, repeater),
        ao:loadTextureRepeater(world, `${file}_OCC.jpg`, repeater),
        roughness:loadTextureRepeater(world, `${file}_ROUGH.jpg`, repeater),
    }

}

export { textureFrom3DTextureMe }