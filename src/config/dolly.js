
const dolly = {

    speedFactor:[
        0.1,
        0.1,
        0.1,
        1
    ],

    camera:{
        fov:50,
        near:0.1,
        far:350000,
    },

    initial:{
        screen:{
            position:[ 0.0, 1.6, 6.0 ],
            rotation:[ 0.0, 0.0, 0.0 ]
        },

        xr:{
            position:[ 0.0, 0.5, 6.0 ],
            rotation:[ 0.0, 0.0, 0.0 ]
        }
    }

};


export { dolly };

