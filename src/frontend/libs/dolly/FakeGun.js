import * as THREE from 'three';

function Gun(world, config, scene, camera, dolly) {

    const renderer = world.get('renderer.main');
    const bullets = [];

    let gun;

    let shooting = false;

    let bulletAliveTimeout = 5000;
    let bulletAliveCount = 0;
    let bulletMaxAlive = 1;
    let bulletWidth = 0.008;
    let bulletHeight = 0.05;
    let bulletPositionStart = new THREE.Vector3();
    let bulletGeometry = new THREE.BoxGeometry(bulletWidth, bulletWidth, bulletHeight);
    let bulletMaterial = new THREE.MeshBasicMaterial({ color: "aqua" });

    let dollyQuaternion = new THREE.Vector3();
    

    function createGun() {

        const geometry = new THREE.BoxGeometry(0.05, 0.05, 0.2);
        const material = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: true } );
        gun = new THREE.Mesh( geometry, material );
        
        gun.position.x = 0.2;
        gun.position.y = -0.1;
        gun.position.z = -0.3;
        
        dolly.add(gun);

        window.addEventListener('mousedown', onMouseDown, false);
        window.addEventListener('mouseup', onMouseUp, false);
    }

    function onMouseDown() {
        console.log('FakeGun: onMouseDown, addRenderJob');
        shooting = true;
        renderer.addRenderJob(bulletsManager);
    }

    function onMouseUp() {
        console.log('FakeGun: onMouseUp, removeRenderJob');
        shooting = false;
        renderer.removeRenderJob(bulletsManager);
    }

    
    function bulletsManager( delta, time ) {
        
        if ( shooting ) {
            generateBullets();
        }

        if (!bullets.length) {
            renderer.removeRenderJob(bulletsManager);
        }

        for ( let i = 0; i<bullets.length; i++ ) {
            
            if ( !bullets[i] ) {
                continue;
            }

            if ( bullets[i].alive === false ) {
                bullets.splice(i, 1);
                continue;
            }

            bullets[i].position.add(bullets[i].velocity);
            console.log('FakeGun: bulletsManager: bullet position');

        }
    }

    function generateBullets() {

        if ( bulletAliveCount >= bulletMaxAlive ) {
            //console.log( 'FakeGun: max bullets reached' );
            return;
        }

        const bullet = new THREE.Mesh(
            
        );

        // get gun center position and store it into a THREE.Vector3
        gun.getWorldPosition(bulletPositionStart);

        // add a Z distance
        bulletPositionStart.z-= 0.10;
        
        // set bullet position
        bullet.position.x = bulletPositionStart.x;
        bullet.position.y = bulletPositionStart.y;
        bullet.position.z = bulletPositionStart.z;

        // ??
        bullet.quaternion.copy(dolly.quaternion);

        bullet.alive = true;

        // speed ?
        dolly.rotation.y
        
        //console.log(dolly.getWorldQuaternion( dolly ));

        //console.log('generateBullets: dolly rotation', dolly.getWorldRotation);
        bullet.velocity = new THREE.Vector3(
            -Math.sin( dolly.rotation.y ),
            0,
            Math.cos( dolly.rotation.y )
        );

        // increment number of bullets alive
        bulletAliveCount++;

        console.log('FakeGun: generateBullets: new bullet at position', bullet.position);
        console.log('FakeGun: generateBullets: gun is at position', gun.position);

        // add bullet to bullets list
        bullets.push(bullet);

        // add the bullet to the scene
        scene.add(bullet);

        // destroy the bullet after a delay
        setTimeout( destroyBullet.bind( bullet ), bulletAliveTimeout );

    }
    
    function destroyBullet() {
        console.log('FakeGun: destroyBullet');
        this.alive = false;
        bulletAliveCount--;
        scene.remove( this );

    }

    function init() {
        
        createGun();

    }

    init();

    return {
        mesh:gun
    };
}

export { Gun }