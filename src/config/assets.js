

const assets = {

    // basepath: if specified, added in front of 
    // items[name].file value
    //basepath:'/3d/', 

    // items list with name as index key
    items:{

        'decor':{
            disable:false,
            type:'Model',
            file:'/3d/scene4.glb',
            backed:'/3d/baked2048.jpg',
            envmap:'/3d/starskyhdrispherical_map_by_kirriaa.jpg',
            receiveShadow:true,
            castShadow:false,

            scale:{
                xyz:1
            },

            position:{
                //z:-3.2,
            },

            rotation:{
                y:Math.PI * 0.5
            }
        },
        'earth':{
            disable:true,
            type:'Model',
            file:'earth.glb',
            backed:'/3d/earth2048.jpg',
            receiveShadow:true,
            castShadow:true,
            scale:{
                xyz:5
            },
            position:{
                z:70,
                y:-50
            },
            rotation:{
                y:Math.PI * 2,
                x:Math.PI * 2
            },
            animate:{
                rotation:{
                    y:0.03
                }
            }
        },

        'cube':{
            disable:true,
            type:'BasicRotatingCube',
            receiveShadow:true,
            castShadow:true,
            size:1
        },

        'earth':{
            disable:true,
            type:'UniverseEarth',
            receiveShadow:true,
            castShadow:true,
        },

        'button':{
            disable:false,
            type:'BasicButton'
        }

        /*
        'floor':{
            type:'BasicGridHelper',
            receiveShadow:true,
            castShadow:true,
            size:100
        }
        */
    }

}

export { assets }