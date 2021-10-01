import * as THREE from 'three';
//import { MeshBVH, acceleratedRaycast } from 'three-mesh-bvh';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';
import { VRButton } from './VRButton.js';
import { Ray } from './shapes/Ray.js';

const RAY_MARKER_SCALE = 0.07;

class MotionControllerPointer {
    
    constructor( hand ) {
        this.hand = hand;
        this.object = new THREE.Object3D();

        this.light = new THREE.PointLight();
        this.object.add( this.light );
    }

}

class XR {

    constructor( world, config ) {

        this.dolly = world.get3( 'dolly' );
        if ( !this.dolly ) {
            throw new Error( 'XR controller require a camea dolly' );
        }

        this.world = world;

        this.setupRenderer();
        this.setupXRButton();
        this.setupRaycaster();

    }

    setupRaycaster() {

        //THREE.Mesh.prototype.raycast = acceleratedRaycast;
        setTimeout( () => {
            //console.log(this.world.blender);
            this.world.raycaster.firstHitOnly = true;
            this.world.raycaster.intersectObjects( this.world.rayTargets );
        }, 3000 );
        
        //this.world.scene.boundsTree = new MeshBVH(this.world.scene);

        this.world.raycaster = new THREE.Raycaster();
        this.line = new Ray.getBeam();
        this.marker = this.raymarker();
        
    }

    setupRenderer() {
        
        this.renderer = this.world.get3( 'renderer.main' );
        this.renderer.xr.enabled = true;
        this.renderer.xr.setFramebufferScaleFactor( 2.0 );
        this.renderer.toneMappingExposure = Math.pow( 1.2, 4.0 );
        //this.renderer.toneMappingExposure = THREE.ACESFilmicToneMapping;

    }

    setupXRButton() {

        const btn = new VRButton(
            this.renderer,
            {
                vrStatus:this.vrStatus.bind( this )
            }
        );
        document.body.appendChild( btn.createButton() );

    }

    vrStatus( available ) {

        if ( available ) {
    
            this.setupXRControllers();
            
        } else {
            
            /*
            this.joystick = new JoyStick({
                onMove: self.onMove.bind(self)
            });
            */
            
        }
    }

    raymarker() {

        const geometry = new THREE.CircleBufferGeometry( 1, 32 );
        const material = new THREE.MeshBasicMaterial( {
            color: 0xff0000
        } );

        const laserMarker = new THREE.Mesh( geometry, material );
        laserMarker.name = 'marker';    
        laserMarker.scale.set( RAY_MARKER_SCALE, RAY_MARKER_SCALE, 1 );
        laserMarker.position.z = -10;

        return laserMarker;
    }

        
    setupXRControllers() {

        console.log( 'setupXRControllers' );
        
        const fn = this.setupXRController.bind( this );
        for ( let i = 0; i < 3; ++i ) {
            fn( i );
        }

    }

    
    setupXRController( ctrlIdx ) {

        console.log( 'setupXRController', ctrlIdx );

        const self = this;

        const motionControllers = new Map( [
            ['left', new MotionControllerPointer( 'left' )],
            ['right', new MotionControllerPointer( 'right' )],
            ['none', new MotionControllerPointer( 'none' )]
        ] );
        

        function onSelectStart( event ) {
            this.userData.selectPressed = true;
        }

        function onSelectEnd( event ) {
            this.userData.selectPressed = false;
        }

        function onConnected( evt ) {
            console.log( 'onConnected' , evt );
            const session = self.renderer.xr.getSession();
            const device = session.inputSources[ctrlIdx];
            handedness = device.handedness;
            if ( motionControllers.has( handedness ) ) {
                const mc = motionControllers.get( handedness );
                mc.inputSource = device;
                mc.controller = ray;
                mc.object.add( grip );
                mc.enabled = true;
                self.dolly.add( mc.object );
            }
        }

        function onDisconnected( evt ) {
            console.log( 'onDisconnected' );
            if ( motionControllers.has( handedness ) ) {
                const mc = motionControllers.get( handedness );
                mc.enabled = false;
                mc.object.remove( grip );
                mc.controller = null;
                mc.inputSource = null;
                self.dolly.remove( mc.object );
            }
        }

        const ray = this.renderer.xr.getController( ctrlIdx );
        ray.addEventListener( 'selectstart', onSelectStart );
        ray.addEventListener( 'selectend', onSelectEnd );
        ray.addEventListener( 'connected', onConnected );
        ray.addEventListener( 'disconnected', onDisconnected );
        ray.add( self.line.clone() );
        ray.add( self.marker.clone() );

        ray.userData.selectPressed = false;

        const grip = self.renderer.xr.getControllerGrip( ctrlIdx );
        const modelFactory = new XRControllerModelFactory();
        const model = modelFactory.createControllerModel( ray );
        grip.add( model );
    
        let handedness = null;
        self.dolly.add( ray );


    };

}

export { XR }
