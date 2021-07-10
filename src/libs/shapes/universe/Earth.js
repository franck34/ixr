import * as THREE from 'three';

function Earth( world, config ) {

    const scene = world.get3('scene.main');
    const textureLoader = world.get('loader').textureLoader;

    const EARTH_SIZE = 0.98;
    const CLOUD_SIZE = 1;
    const GALAXY_SIZE = 200;
    const SUN_SIZE = 1;
    const SPEED = 0.02;

    let earthMesh;
    let cloudMesh;
    let starMesh;

    init();

    function init() {
        
        setupSun();
        setupGalaxy();
        setupEarth();
        setupCloud();
        setupLight();

        world.get('renderer.main').addRenderJob(rotateEarth);
    }

    function rotateEarth(delta, time) {
        
        earthMesh.rotation.y+= SPEED * delta;
        cloudMesh.rotation.y+= (SPEED+0.005) * delta;
        starMesh.rotation.y+= SPEED/4 * delta;
        
    }

    function setupLight() {

        //ambient light
        const ambientlight = new THREE.AmbientLight(0xffffff, 0.1);
        scene.add(ambientlight);

        //point Light
        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.castShadow = true;
        pointLight.shadow.bias = 0.00001;
        pointLight.shadow.mapSize.width = 2048;
        pointLight.shadow.mapSize.height = 2048;
        pointLight.position.set(-50, 20, -60);
        scene.add(pointLight);

    }

    function setupCloud() {

        const cloudgeometry = new THREE.SphereGeometry(CLOUD_SIZE, 32, 32);

        const cloudMaterial = new THREE.MeshStandardMaterial({
            map: textureLoader.load('/3d/earth/1/earthCloud.png'),
            transparent: true,
        });

        cloudMesh = new THREE.Mesh(cloudgeometry, cloudMaterial);
        cloudMesh.rotation.x = -0.5;
        cloudMesh.castShadow = true;
        cloudMesh.layers.set(0);
        scene.add(cloudMesh);

    }

    function setupEarth() {
        
        //earth geometry
        const earthgeometry = new THREE.SphereGeometry(EARTH_SIZE, 64, 64);

        //earth material
        const earthMaterial = new THREE.MeshStandardMaterial({
            roughness: 1,
            metalness: 0,
            map: textureLoader.load('/3d/earth4096.jpg'),
            displacementMap: textureLoader.load('/3d/earth/Bump.jpg'),
            displacementScale: 0.5,
        });
  
        //earthMesh
        earthMesh = new THREE.Mesh(earthgeometry, earthMaterial);
        earthMesh.receiveShadow = true;
        earthMesh.castShadow = true;
        earthMesh.layers.set(0);
        earthMesh.rotation.x = -0.5
        scene.add(earthMesh);

    }

    function setupGalaxy() {

        const geometry = new THREE.SphereGeometry(GALAXY_SIZE, 64, 64);
        const material = new THREE.MeshBasicMaterial({
            map: world.get('loader').textureLoader.load('/3d/earth/1/galaxy1.png'),
            side: THREE.BackSide,
            transparent: true,
        });

        starMesh = new THREE.Mesh(geometry, material);
        starMesh.layers.set(0);
        scene.add(starMesh);

    }

    function setupSun() {

        //sun object
        const color = new THREE.Color("#FDB813");
        const geometry = new THREE.IcosahedronGeometry(SUN_SIZE, 15);
        const material = new THREE.MeshBasicMaterial({ color: color });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(-50, 20, -60);
        sphere.layers.set(0);
        scene.add(sphere);

    }
}

export { Earth }