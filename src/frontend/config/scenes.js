import { colors } from './colors.js';

const scenes = {

    default:'defaultScene',
    
    items:{
        'defaultScene':{

            //background: colors.sceneBackgroundColor,
            autoUpdate: true,
            axesHelper: 0,

            fog:{
                enable: false,
                color: colors.sceneBackgroundColor,
                near: 1,
                far: 1000
            }

        }
    }

};


export { scenes };


