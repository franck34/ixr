import * as THREE from 'three';


const lights = {

    default:'simple',

    items:{

        'ambient':{
            enable: false,
            type: 'ambient',
            color: new THREE.Color(0x000000),
            intensity: 1
        },

        'directional':{
            enable:false,
            type: 'directional',
            showHelper:true,
            color:new THREE.Color( 0xffffff ),
            intensity: 2,
            position:{
                x: 0,
                y: 2,
                z: 0
            }
        },

        'point':{
            enable:true,
            type: 'point',
            showHelper:false,
            color:new THREE.Color( 0xffffff ),
            intensity:1,

            position:{
                x: 0,
                y: 1.2,
                z: 4
            }
        },

        'hemi':{
            enable:false,
            type: 'hemisphere',
            showHelper:true,
            colorUp:new THREE.Color( 0xddddff ),
            colorDown:new THREE.Color( 0xddddff ),
            intensity:2,
            position:{
                x: -3,
                y: 1.2,
                z: 4
            }
        }
    }

}


export { lights }
