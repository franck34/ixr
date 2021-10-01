

const assets = {

    // basepath: if specified, added in front of 
    // items[name].file value
    //basepath:'/3d/', 

    // items list with name as index key
    items:{

        'decor':{
            disable:false,
            rayAsset:true,
            type:'Model',
            file:'/blender/showroom.glb',
            wireframe: true,
            /*
            material:{
                color:'/3d/palette.png',
                emissive:'/3d/palette_emissive.png',
                aoMap:'/blender/bakes/MergedBake_Bake1_cyclesbake_AO.jpg'
            },
            */
            bake:'/blender/showroom.png',
            //envmap:'/3d/starskyhdrispherical_map_by_kirriaa.jpg',
            receiveShadow:false,
            castShadow:false,

            scale:{
                xyz:1.0
            },

            position:{
                z:-0.0,
                y:-0.0,
            },

            rotation:{
               // y:Math.PI * 1.5
            },
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

};

export { assets };
