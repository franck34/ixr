import * as THREE from 'three';
import { Shapes } from './shapes/index.js';

function Assets(world, config) {

    if (!config || typeof config != 'object') {
        throw new Error('Assets: unexpected typeof of assetsConfig');
    }

    const assets = {};
    const loader = world.get('loader');
    const categories = {};

    const gltfLoader = loader.gltfLoader;
    const textureLoader = loader.textureLoader;
    const rgbeLoader = loader.rgbeLoader;

    function applyAnimation( options, object ) {

        console.log('applyAnimation', options);
        if (!options.animate || options.animate.enable === false) {
            return;
        }
        
        const r = options.animate.rotation;
        if (r) {
    
            function rotateEarth(delta, time) {
                if (r.x) object.rotation.x += r.x * delta;
                if (r.y) object.rotation.y += r.y * delta;
                if (r.z) object.rotation.z += r.z * delta;
                return true;
            }
    
            world.get('renderer.main').addRenderJob( rotateEarth );
            console.log('apply animation', object.name, options.castShadow, options.receiveShadow);
        }
    
    }
    
    function applyShadow( options, object ) {
    
        if ( !object.isMesh ) {
            return;
        }
    
        console.log('apply shadow', object.name, options.castShadow, options.receiveShadow);
    
        if (options.castShadow) {
            object.castShadow = true;
        }
    
        if (options.receiveShadow) {
            object.receiveShadow = true;
        }
    
        /*
        if (child.userData && child.userData.receiveRay) {
            child.geometry.computeBoundsTree = computeBoundsTree;
            self.objectsReceiveRay.push(child);
            
            if (child.geometry.computeBoundsTree()) {
                console.log('computeBoundsTree');
                child.geometry.computeBoundsTree();
            }
        }
        */
    }
    
    function applyScale( options, object ) {
    
        if (!options.scale) return;
    
        const v = options.scale;
        if (v.xyz) {
            v.x = v.xyz;
            v.y = v.xyz;
            v.z = v.xyz;
            delete v.xyz;
        }
    
        //child.geometry.scale( v.x, v.y, v.z );
        //console.log(child.scale);
        console.log('applyScale', object, v);
        object.scale.set( v.x, v.y, v.z );
    
    }
    
    function applyPosition( options, object ) {
    
        if (!options.position) return;
    
        const v = options.position;
        if (v.xyz) {
            v.x = v.xyz;
            v.y = v.xyz;
            v.z = v.xyz;
            delete v.xyz;
        }
    
        console.log('applyPosition', object, v);
    
        object.position.x = v.x || 0.0;
        object.position.y = v.y || 0.0;
        object.position.z = v.z || 0.0;
    
        console.log(object.position);
    }
    
    function applyRotation( options, object ) {
    
        if (!options.rotation) return;
    
        const v = options.rotation;
        if (v.xyz) {
            v.x = v.xyz;
            v.y = v.xyz;
            v.z = v.xyz;
            delete v.xyz;
        }
    
        console.log('applyRotation', object, v);
    
        object.rotation.x = v.x || 0.0;
        object.rotation.y = v.y || 0.0;
        object.rotation.z = v.z || 0.0;
    }
    
    function loadModel(world, options) {

        if (options.type != 'Model') return;
        if (options.disable) return;

        if (typeof options.file != 'string') {
            console.warn(`Assets: asset ${name}: actual file attribute is ${typeof item.file}, expected string`);
            return;

        }

        let textureEquirec;

        if (options.envmap) {
            
            if (options.envmap.match(/\.hdr/)) {

                const pmremGenerator = new THREE.PMREMGenerator( world.get3('renderer.main') );
                pmremGenerator.compileEquirectangularShader();
            
                function onLoad(texture) {
                    const envMap = pmremGenerator.fromEquirectangular( texture ).texture;
                    pmremGenerator.dispose();
                    console.log('environment', options.envmap, envMap);
                    world.get3('scene.main').environment = envMap;
                }

                rgbeLoader.load(
                    options.envmap,
                    onLoad,
                    undefined,
                    (err) => {
                        console.error( 'An error occurred setting the environment');
                    }
                );

            } else if (options.envmap.match(/\.png|\.jpe?g$/)) {

                textureEquirec = textureLoader.load( options.envmap );
			    textureEquirec.mapping = THREE.EquirectangularReflectionMapping;
			    textureEquirec.encoding = THREE.sRGBEncoding;
                world.get3('scene.main').background = textureEquirec;

            } else {
                
                /* TODO
                {
                    const loader = new THREE.CubeTextureLoader();
                    const texture = loader.load([
                    'resources/images/cubemaps/computer-history-museum/pos-x.jpg',
                    'resources/images/cubemaps/computer-history-museum/neg-x.jpg',
                    'resources/images/cubemaps/computer-history-museum/pos-y.jpg',
                    'resources/images/cubemaps/computer-history-museum/neg-y.jpg',
                    'resources/images/cubemaps/computer-history-museum/pos-z.jpg',
                    'resources/images/cubemaps/computer-history-museum/neg-z.jpg',
                    ]);
                    scene.background = texture;
                }
                */

            }
        }

        let bakedTexture;
        if (options.backed) {
            bakedTexture = textureLoader.load( options.backed );
            bakedTexture.flipY = false;
            bakedTexture.encoding = THREE.sRGBEncoding;
        }

        function onLoad(gltf) {

            console.log('Assets:loadAsset:onLoad', gltf.scene);

            let bakedMaterial;
            if (options.backed) {
                bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture });
            } else {
                bakedMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
            }

            const vitreMaterial = new THREE.MeshStandardMaterial({
                color:0xFFFFFF,
                transparent: true,
                opacity: 0.2,
                emissive:0xFF0000,
                emissiveIntensity:100,
            });

            gltf.scene.traverse(child => {
                applyShadow(options, child);
                child.material = bakedMaterial;
                if (textureEquirec) {
                    //child.material.envMap = textureEquirec;
                }

                if (child.material) {
                    child.material.needsUpdate = true;
                    //child.material.side = THREE.DoubleSide;
                }

                if (child.name.match(/vitre/)) {
                    child.material = vitreMaterial;
                }
            });


            applyScale( options, gltf.scene );
            applyPosition( options, gltf.scene );
            applyRotation( options, gltf.scene );
            applyAnimation( options, gltf.scene );

            world.add( gltf.scene );
            
        }

        if (options.file.match(/(gltf|glb)$/i)) {
            assets[name] = gltfLoader.load(options.file, onLoad);
        } else {
            throw new Error(`Assets:loadAsset: ${options.file} file extension not supported`);
        }

    }

    function createShape(world, shapeName, options) {
        if (options.disable) return;
        console.log('Assets:createShape:', shapeName, options, categories);
        const mesh = new categories[shapeName]( world, options );

        return mesh;
    }

    function  loadAsset(name, options) {
        
        if (options.disable) return;
        //console.log('Assets:loadAsset:', name, options);

        let shape;

        for (const shapeCategoryName in Shapes) {
            const category = Shapes[shapeCategoryName];
            categories[shapeCategoryName] = category;
            
            for (const shapeName in category) {
                const camelCaseName = `${shapeCategoryName}${shapeName}`;
                if (options.type === camelCaseName) {
                    console.log('Assets:loadAsset: categoryName', shapeCategoryName, camelCaseName);
                    categories[camelCaseName] = Shapes[shapeCategoryName][shapeName];
                    shape = createShape(world, camelCaseName, options);                   
                    break;
                }
            }    
        }

        if (!shape) {
            if (options.type === 'Model') {
                loadModel(world, options);
                return;
            } else {
                throw new Error(`unknow options type ${options.type}`);
            }
        }
        
        return shape;
    }

    function loadAssets() {
        
        if (!config.items) {
            console.warn('Assets: no items');
            return;
        }

        for (const name in config.items) {
            loadAsset(name, config.items[name]);
        }
    }

    loadAssets();

    return assets;

}

export { Assets }