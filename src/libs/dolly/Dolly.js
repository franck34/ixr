import * as THREE from 'three';
import { TextPanel } from '../shapes/basic/TextPanel.js';
import { merge } from '../utils/merge.js';
import { KeyboardControl } from './KeyboardControl.js';
import { MouseControl } from './MouseControl.js';
import { Crosshair } from './Crosshair.js';

function Dolly(world, config) {

    console.log('XR', config);

    const self = this;

    const defaults = {
        smoothRotate:true,
        buttonMinTrigger: 0.8,
        thumbsAxisEastWest: 2,
        thumbsAxisNorthSouth: 3,
        axiesMinThreshold: 0.2,
        speedFactorMax: 0.15,
        gravity: 9.8,
        stayOnFloor:false,
        speedFactor:[
            0.04,
            0.1,
            0.04 ,
            0.07
        ],
        camera:{
            fov:40,
            near:0.001,
            far:1000
        },
        initial:{
            screen:{
                position:[ 0.0, 0.0, 0.0 ],
                rotation:[ 0.0, 0.0, 0.0 ]
            },
            xr:{
                position:[ 0.0, 0.0, 0.0 ],
                rotation:[ 0.0, 0.0, 0.0 ]
            }
        }
    }

    config = merge(defaults, config || {});

    console.log('Dolly', config);

    const scene = world.get3('scene.main');
    const renderer = world.get('renderer.main');
    const prevGamePads = new Map();
    
    let dolly, camera, xrCamera, old, data, textPanel, controller;
    let handedness = "unknown";
    let dummyCam;

    init();

    function init() {

        // setup camera
        camera = new THREE.PerspectiveCamera(
            config.camera.fov,
            window.innerWidth / window.innerHeight,
            config.camera.near,
            config.camera.far
        );

        world.set('camera.main', camera);

        textPanel = new TextPanel(world);
        //world.debugPanel = panel;
        textPanel.position.x = 0;
        textPanel.position.y = 1;
        textPanel.position.z = 1;
        scene.add(textPanel);

        dummyCam = new THREE.Object3D();
        camera.add(dummyCam); 
        
        const geometry = new THREE.BoxGeometry( 1, 1, 1 );
        const material = new THREE.MeshBasicMaterial( {color: 0x00ff00, wireframe: true, visible:false} );
        dolly = new THREE.Mesh( geometry, material );

        //dolly = new THREE.Object3D();

        //const helper = new THREE.BoxHelper( dolly, 0xffffff );
        //scene.add( helper );

        dolly.name = "dolly";
        dolly.dollyReset = dollyReset;
        dollyReset();


        dolly.status = 'idle'; // walking, running
        dolly.moving = false;

        dolly.canJump = false;
        dolly.onObject = false;
        
        dolly.velocity = new THREE.Vector3();
        dolly.direction = new THREE.Vector3();
        dolly.vector = new THREE.Vector3(),
        dolly.runRatio = 3;

        dolly.add(camera);
        //dolly.add(panel);

        scene.add(dolly);

        world.set('dolly', dolly);

        renderer.addRenderJob(renderDolly);
        //renderer.addRenderJob(renderInformations);
    
        PubSub.subscribe('XREnter', dollyInitialPositionXR);
        PubSub.subscribe('XRExit', dollyInitialPositionScreen);

        new KeyboardControl(world, config, dolly);
        new MouseControl(world, config, dolly);

        const crosshair = new Crosshair(world, config);
        crosshair.adjustToCamera(camera);
        camera.add( crosshair.mesh );

        dollyInitialPositionScreen();
    }

    function dollyReset() {

        dolly.moveForward = false;
        dolly.moveBackward = false;
        dolly.moveLeft = false;
        dolly.moveRight = false;
        dolly.moveUp = false;
        dolly.moveDown = false;
        dolly.rotating = false;
        dolly.moving = false;
        dolly.status = 'idle';
        dolly.moveX = 0;
        dolly.moveY = 0;
        dolly.moveZ = 0;
        dolly.rotatingY = 0;

    }
    
    function dollyInitialPositionXR(session) {

        console.log('dollyInitialPositionXR', session);

        xrCamera = renderer.threeObject.xr.getCamera(camera);

        // attached to camera container
        /*
        textPanel.position.x = 0.05;
        textPanel.position.y = 1.1;
        textPanel.position.z = -0.4;
        */

        // attached to dolly
        //textPanel.position.x = 0.05;
        //textPanel.position.y = 0.9;
        //textPanel.position.z = -0.7;
 
        // attached to the camera
        textPanel.position.x = 0;
        textPanel.position.y = -1.3;
        textPanel.position.z = -1;

        dolly.position.set(...config.initial.xr.position);
        console.log('XR initial xr dolly position', dolly.position);

    }

    function dollyInitialPositionScreen(session) {

        if (!textPanel) return;

        console.log('dollyInitialPositionScreen', session);
        // attached to dolly
        //textPanel.position.x = 0;
        //textPanel.position.y = 1.38;
        //textPanel.position.z = 2.7;

        // attached to the camera
        textPanel.position.x = 0;
        textPanel.position.y = -0.35;
        textPanel.position.z = -1;
        textPanel.lookAt(dolly.position);

        dolly.position.set(...config.initial.screen.position);
        console.log('XR initial screen dolly position', dolly.position, camera.position);

        console.log('XR dolly.position', dolly.position);
        return;
    }

    function pulse(source) {

        if (!source.gamepad.hapticActuators) return;
        if (!source.gamepad.hapticActuators[0]) return;

        var pulseStrength = Math.abs(data.axes[2]) + Math.abs(data.axes[3]);
        if (pulseStrength > 0.75) {
            pulseStrength = 0.75;
        }

        var didPulse = source.gamepad.hapticActuators[0].pulse(pulseStrength, 100);

    }

    function isLeftThumbstick(data) {
        if (data.handedness == "left") {
            return true;
        }
        return false;
    }

    
    function isIterable(obj) {
        // checks for null and undefined
        if (obj == null) {
            return false;
        }
        return typeof obj[Symbol.iterator] === "function";
    }

    function handleButtons(data, value, i) {

        if (value === old.buttons[i] || Math.abs(value) < config.buttonMinTrigger ) return;
        
        if (value === 1) {
            
            console.log("handleButtons: Button" + i + "Down");
            if (data.handedness == "left") {
                console.log("Left Paddle Down");                
            } else {
                console.log("handleButtons: Right Paddle Down");
                if (i == 1) {
                    dolly.rotateY(THREE.Math.degToRad(1));
                }
            }

        } else {
        
            //console.log("handleButtons: Button " + i + " Up");

            if (i!=0) {

                //use the paddle buttons to rotate
                if (data.handedness == "left") {

                    console.log("handleButtons: Left Paddle Down");
                    dolly.rotateY(-THREE.Math.degToRad(Math.abs(value)));

                } else {
                    console.log("handleButtons: Right Paddle Down");
                    dolly.rotateY(THREE.Math.degToRad(Math.abs(value)));
                }
            }
        }

    }

    function debugHandleAxesEastWest( data, v ) {

        if (isLeftThumbstick( data )) {
        
            if ( v < 0 ) {
                console.log('handleAxes: left on left thumbstick', v);
             } else {
                console.log('handleAxes: right on left thumbstick', v)
             }
             
        } else {

            if ( v > 0 ) {
                console.log('handleAxes: right on right thumbstick', v);
            } else {
                console.log('handleAxes: left on right thumbstick', v);
            }

        }

    }

    function debugHandleAxesNorthSouth( data, v ) {
        
        if ( isLeftThumbstick(data) ) {

            if ( v > 0) {
                console.log('handleAxes: down on left thumbstick');
            } else {
                console.log('handleAxes: up on left thumbstick');
            }

        } else {

            if ( v > 0 ) {
                console.log('handleAxes: down on right thumbstick');
            } else {
                console.log('handleAxes: up on right thumbstick');
            }

        }
        
    }

    function handleAxes(data, value, axisID) {

        // if thumbstick axis has moved beyond the minimum threshold from center, 
        // windows mixed reality seems to wander up to about .17 with no input

        if ( Math.abs(value) <= config.axiesMinThreshold ) {

            //axis below threshold - reset the speedFactor if it is greater than zero  or 0.025 but below our threshold
            /*
            if (Math.abs(value) > config.speedFactorMax) {
                config.speedFactor[axisID] = config.speedFactorMax;
            }
            */

            return;
        }

        //set the speedFactor per axis, with acceleration when holding above threshold, up to a max speed
        //config.speedFactor[axisID] > 1 ? (config.speedFactor[axisID] = 1) : (config.speedFactor[axisID] *= 1.001);

        if ( axisID === config.thumbsAxisEastWest ) {

            const v = data.axes[2];

            if (isLeftThumbstick(data)) {
                
                // left/right on left thumbstick: translateX
                 dollyTranslateX( v );
                 
            } else {
                
                // left/right on right thumbstick: rotate around Y axis
                dollyRotateY( v );

            }

            // debugHandleAxesEastWest(data, v);

        } else if ( axisID === config.thumbsAxisNorthSouth ) {

            const v = data.axes[3];

            if ( isLeftThumbstick(data) ) {

                // north/south on left thumbstick: translateZ
                dollyTranslateZ( v );

            } else {

                // north/south on right thumbstick: translateY
                if (!config.stayOnFloor) {
                    dollyTranslateY( v );
                }

            }
            
        } else {

        }

        world.controls && world.controls.update();
    }

    function inversSign( num ) {
        return num - (num * 2);
    }

    function dollyTranslateX( value ) {

        console.log('dolly translateX', value);

        if ( value <= 0 ) {
            dolly.moveLeft = true;
        } else if ( value >= 0 ) {
            dolly.moveRight = true;
        }

        dolly.moveX = value;
    }

    function dollyTranslateY( value ) {

        console.log('dolly translateY', value);

        if ( value >= 0 ) {
            dolly.moveUp = true;
        } else if ( value <= 0 ) {
            dolly.moveDown = true;
        }
        dolly.moveY = value;
    }

    function dollyTranslateZ( value ) {

        console.log('dolly translateZ', value);

        if ( value >= 0 ) {
            dolly.moveForward = true;
        } else if ( value <= 0 ) {
            dolly.moveBackward = true;
        }
        dolly.moveZ = value;

    }

    function dollyRotateY( value ) {

        if (value) {
            dolly.rotating = true;
            dolly.rotatingY = value;
        }

    }

    function dollyRotateYReal() {

        dolly.rotateY(-THREE.Math.degToRad(360/4));

    }

    function limitY() {
        if (config.stayOnFloor) {
            if ( dolly.position.y != 1.6 ) {
                dolly.position.y = 0;
                dolly.canJump = true;
            }
        }

    }

    function dollyMove() {
        
        /*
        if ( dolly.onObject === true ) {
            dolly.velocity.y = Math.max( 0, dolly.velocity.y );
            dolly.canJump = true;
        }
        */

        let v;

        if ( dolly.moveLeft || dolly.moveRight ) {
            v = config.speedFactor[0] * dolly.moveX;
            //console.log('XR Dolly moveX', v);
            dolly.translateX(v);
        }

        if ( dolly.moveUp || dolly.moveDown ) {
            v = config.speedFactor[1] * inversSign(dolly.moveY);
            //console.log('XR Dolly moveY', v);
            dolly.translateY(v);
        }

        if ( dolly.moveForward || dolly.moveBackward ) {
            v = config.speedFactor[2] * dolly.moveZ;
            //console.log('XR Dolly moveZ', v);
            dolly.translateZ(v);
        }

        if ( dolly.rotating ) {
            
            if ( config.smoothRotate ) {
                dolly.rotateY(-THREE.Math.degToRad(dolly.rotatingY));
                return;
            }

        }

        limitY();

        return true;
    }

    function renderDolly(timeDelta) {
               
        if (!renderer || !renderer.threeObject) {
            console.log('XR renderer not ready');
            // renderer is not yet ready
            return;
        }        
                
        const session = renderer.threeObject.xr.getSession();

        if (!session || !xrCamera) {
            dollyMove();
            return;
        }

        dollyReset();

        if (!isIterable(session.inputSources)) {
            // prevent console errors if only one input source
            return;
        }

        let i = 0;

        for (const source of session.inputSources) {

            if (source && source.handedness) {
                handedness = source.handedness; //left or right controllers
            }
            
            if (!source.gamepad) {
                continue;
            }

            controller = renderer.threeObject.xr.getController(i++);

            data = {
                handedness: handedness,
                buttons: source.gamepad.buttons.map((b) => b.value),
                axes: source.gamepad.axes.slice(0)
            };

            old = prevGamePads.get(source);

            if (old) {

                data.buttons.forEach((value, i) => {
                    handleButtons(data, value, i);
                });

                data.axes.forEach((value, i) => {
                    handleAxes(data, value, i);
                });

            }
            
            ///store this frames data to compare with in the next frame
            prevGamePads.set(source, data);
        }

        return dollyMove();
    
    }

    
    function roundCoordinates(obj) {

        const m = 3;

        const ret = { 
            x: obj.position.x.toFixed(m),
            y: obj.position.y.toFixed(m),
            z: obj.position.z.toFixed(m)
        }

        if (ret.x>=0) ret.x = '+'+ret.x;
        if (ret.y>=0) ret.y = '+'+ret.y;
        if (ret.z>=0) ret.z = '+'+ret.z;

        return ret;

    }

    function roundOrientation(obj) {

        const m = 3;

        const ret = { 
            x: obj.rotation.x.toFixed(m),
            y: obj.rotation.y.toFixed(m),
            z: obj.rotation.z.toFixed(m)
        }

        if (ret.x>=0) ret.x = ' '+ret.x;
        if (ret.y>=0) ret.y = ' '+ret.y;
        if (ret.z>=0) ret.z = ' '+ret.z;

        return ret;

    }

    function roundSpeedFactor() {

        const m = 3;

        const ret = { 
            x: config.speedFactor[0].toFixed(m),
            y: config.speedFactor[1].toFixed(m),
            z: config.speedFactor[2].toFixed(m),
            w: config.speedFactor[3].toFixed(m),
        }

        if (ret.x>=0) ret.x = ' '+ret.x;
        if (ret.y>=0) ret.y = ' '+ret.y;
        if (ret.z>=0) ret.z = ' '+ret.z;
        if (ret.w>=0) ret.w = ' '+ret.w;

        return ret;

    }

    let lc, rc, lo, ro, text, dco, dor, sf;

    function renderInformations(delta) {
       
        text = '';
        if (world.controllers) {
            lc = roundCoordinates(world.controllers.left);
            rc = roundCoordinates(world.controllers.right);
            text = `LC ${lc.x} ${lc.y} ${lc.z} | `; // left controller position
            text+= `RC ${rc.x} ${rc.y} ${rc.z} | `; // right controller position
        }

        dco = roundCoordinates(dolly);
        dor = roundOrientation(dolly);
        sf = roundSpeedFactor();

        text+= `DP ${dco.x} ${dco.y} ${dco.z} | `; // dolly position
        text+= `DT ${sf.x} ${sf.y} ${sf.z} ${sf.w}\n`; // dolly translation

        if (world.controllers) {
            lo = roundOrientation(world.controllers.left);
            ro = roundOrientation(world.controllers.right);
            text+= `LO ${lo.x} ${lo.y} ${lo.z} | `; // left controller rotation
            text+= `RO ${ro.x} ${ro.y} ${ro.z} | `; // right controller rotation
        }

        text+= `DO ${dor.x} ${dor.y} ${dor.z}\n`; // dolly rotation

        world.log.text = text;
        return true;
    }
    
    return self;

}

export { Dolly }
