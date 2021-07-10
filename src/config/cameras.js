const cameras = {

    default:'none',

    items:{
        'dolly':{
            enable:false,
            type:'dolly',
            camera:{
                showHelper:true,
                fov:60,
                near:0.1, 
                far:200,
                position:{
                    x: 0,
                    y: 1.6, // default devices value, i.e human eyes height,
                    z: 0
                }
            },
            dolly:{
                showHelper:true,
                position:{
                    x: 0,
                    y: 0,
                    z:-5
                }
            }
        },
        'simple':{
            enable:false,
            type:'simple',
            camera:{
                showHelper:true,
                fov:60,
                near:0.1, 
                far:200,
                position:{
                    x: 0,
                    y: 1.6,
                    z: -7
                },
                lookAt:{
                    x:0,
                    y:0.75,
                    z:0
                }
            }
        }
    }

}


export { cameras }
