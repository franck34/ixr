import * as THREE from 'three';


const lights = {

    default:'simple',

    items:{

        'ambient':{
            enable: true,
            type: 'ambient',
            color: new THREE.Color( 0x111111 ),
            intensity: 2
        },

        'directional':{
            enable:true,
            type: 'directional',
            showHelper:false,
            color:new THREE.Color( 0xffffff ),
            intensity: 1,
            position:{
                x: 3,
                y: 3,
                z: 5
            }
        },

        'point':{
            enable:false,
            type: 'point',
            showHelper:false,
            color:new THREE.Color( 0xffffff ),
            intensity:1,

            position:{
                x: 0,
                y: 3,
                z: 0
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
                y: 2,
                z: 5
            }
        }
    }

};


export { lights };
