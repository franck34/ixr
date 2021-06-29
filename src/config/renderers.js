import * as THREE from 'three';

const renderers = {

    'defaults':{

        webGLRendererOptions :{ antialias:true },
        pixelRatio:window.devicePixelRatio,
        size:[window.innerWidth, window.innerHeight],

        // Set up a non-black clear color so that we can see if something renders wrong.
        clearColor:0x010203,
        autoClear:false,

        shadowMapEnabled:true,
        shadowMapSoft:true,
        shadowMapType:THREE.PCFSoftShadowMap,

        outputEncoding:THREE.sRGBEncoding,
        toneMapping:THREE.ReinhardToneMapping, // THREE.ACESFilmicToneMapping, ...
        //@TODO: implement toneMappingExposureXR
        toneMappingExposure:Math.pow(2, 4.0),
                
    }

}


export { renderers }
