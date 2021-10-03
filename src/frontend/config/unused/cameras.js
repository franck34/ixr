const cameras = {

    default:'none',

    items:{
        'dolly':{
            enable:false,
            type:'dolly',
            camera:{
                showHelper:false,
                fov:60,
                near:10000, 
                far:3500000,
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

/*
window.addEventListener('resize', () =>
{
    // Update displaySize
    displaySize.width = window.innerWidth
    displaySize.height = window.innerHeight

    // Update camera
    const aspectRatio = displaySize.width / displaySize.height
    const vFOV = 2 * Math.atan( displaySize.height / ( 2 * CAMERA_FAR_PLANE ) ) * RAD_TO_DEG_RATIO
    camera.fov = vFov;
    camera.aspect = aspectRatio
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(displaySize.width, displaySize.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
*/


export { cameras };
