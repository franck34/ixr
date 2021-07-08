

const assets = {

    // basepath: if specified, added in front of 
    // items[name].file value
    basepath:'/3d/', 

    // items list with name as index key
    items:{

        'decor':{
            type:'Model',
            file:'scene4.glb',
            backed:'/3d/baked4096.jpg',
            envmap:'/3d/starskyhdrispherical_map_by_kirriaa.jpg',
            receiveShadow:true,
            castShadow:true,

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
            type:'Model',
            file:'earth.glb',
            backed:'/3d/earth2048.jpg',
            receiveShadow:true,
            castShadow:true,
            scale:{
                xyz:0.1
            },
            position:{
                //z:-3.2,
            },
            rotation:{
                y:Math.PI * 0.5
            }
        },

        'cube':{
            disable:true,
            type:'BasicRotatingCube',
            receiveShadow:true,
            castShadow:true,
            size:1
        },

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