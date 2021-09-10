

const assets = {

    // basepath: if specified, added in front of 
    // items[name].file value
    //basepath:'/3d/', 

    // items list with name as index key
    items:{

        'decor':{
            disable:false,
            type:'Model',
            file:'/blender/shootingrange9.glb',
            /*
            material:{
                color:'/3d/palette.png',
                emissive:'/3d/palette_emissive.png',
                aoMap:'/blender/bakes/MergedBake_Bake1_cyclesbake_AO.jpg'
            },
            */
            baked:'/blender/SimpleBake_Bakes/MergedBake_Bake1_cyclesbake_COMBINED.jpg',
            //envmap:'/3d/starskyhdrispherical_map_by_kirriaa.jpg',
            receiveShadow:true,
            castShadow:true,

            scale:{
                xyz:1.3
            },

            position:{
                z:-0.01,
                y:0.01,
            },

            rotation:{
                y:Math.PI * 1
            },
            depthWrite:true
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
            disable:true,
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