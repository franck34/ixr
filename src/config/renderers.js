import * as THREE from 'three';

const renderers = {

    default:'WebGlRenderer',

    items:{
        'WebGlRenderer':{
            type:'webGlRenderer',
            webGLRendererOptions :{ antialias:true },

            // Set up a non-black clear color so that we can see if something renders wrong.
            clearColor:0x010203,
            autoClear:true,

            shadowMap:{
                enabled:true,
                type:THREE.PCFSoftShadowMap, // BasicShadowMap, PCFShadowMap (default), PCFSoftShadowMap, VSMShadowMap
            },

            outputEncoding:THREE.sRGBEncoding,
            toneMapping: THREE.ACESFilmicToneMapping, // THREE.ACESFilmicToneMapping, ...
            //toneMapping: THREE.NoToneMapping,
            //toneMapping: THREE.LinearToneMapping,
            //toneMapping: THREE.ReinhardToneMapping,
            //toneMapping: THREE.CineonToneMapping,
            //@TODO: implement toneMappingExposureXR
            //toneMappingExposure:Math.pow(2, 4.0),
            physicallyCorrectLights:false
        }
                
    }

}


export { renderers }
