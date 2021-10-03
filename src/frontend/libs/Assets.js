/* eslint-disable no-mixed-spaces-and-tabs */
import * as THREE from 'three';
import { Shapes } from './shapes/index.js';

function Assets( world, config ) {

    if ( !config || typeof config != 'object' ) {
        throw new Error( 'Assets: unexpected typeof of assetsConfig' );
    }

    const assets = {};
    const loader = world.get( 'loader' );
    const categories = {};
    const rayAssets = [];

    const gltfLoader = loader.gltfLoader;
    const textureLoader = loader.textureLoader;
    const rgbeLoader = loader.rgbeLoader;

    function applyAnimation( options, object ) {

        console.log( 'Assets: applyAnimation', options );
        if ( !options.animate || options.animate.enable === false ) {
            return;
        }
        
        function rotateEarth( delta, time ) {
            if ( r.x ) object.rotation.x += r.x * delta;
            if ( r.y ) object.rotation.y += r.y * delta;
            if ( r.z ) object.rotation.z += r.z * delta;
            return true;
        }

        const r = options.animate.rotation;
        if ( r ) {
            world.get( 'renderer.main' ).addRenderJob( rotateEarth );
            console.log( 'Assets: apply animation', object.name, options.castShadow, options.receiveShadow );
        }
    
    }
    
    function applyShadow( options, object ) {
    
        if ( !object.isMesh ) {
            return;
        }
    
        console.log( 'apply shadow', object.name, options.castShadow, options.receiveShadow );
    
        if ( options.castShadow ) {
            object.castShadow = true;
        }
    
        if ( options.receiveShadow ) {
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
    
        if ( !options.scale ) return;
    
        const v = options.scale;
        if ( v.xyz ) {
            v.x = v.xyz;
            v.y = v.xyz;
            v.z = v.xyz;
            delete v.xyz;
        }
    
        //child.geometry.scale( v.x, v.y, v.z );
        //console.log(child.scale);
        console.log( 'Assets: applyScale', object, v );
        object.scale.set( v.x, v.y, v.z );
    
    }

    function applyWireframe( options, object ) {

        object.wireframable = true;

        if ( typeof options.wireframe === 'boolean' ) {

            object.material.wireframe = options.wireframe || false;

        }

    }
    
    function applyPosition( options, object ) {
    
        if ( !options.position ) return;
    
        const v = options.position;
        if ( v.xyz ) {
            v.x = v.xyz;
            v.y = v.xyz;
            v.z = v.xyz;
            delete v.xyz;
        }
    
        console.log( 'Assets: applyPosition', object, v );
    
        object.position.x = v.x || 0.0;
        object.position.y = v.y || 0.0;
        object.position.z = v.z || 0.0;
    
    }
    
    function applyRotation( options, object ) {
    
        if ( !options.rotation ) return;
    
        const v = options.rotation;
        if ( v.xyz ) {
            v.x = v.xyz;
            v.y = v.xyz;
            v.z = v.xyz;
            delete v.xyz;
        }
    
        console.log( 'Assets: applyRotation', object, v );
    
        object.rotation.x = v.x || 0.0;
        object.rotation.y = v.y || 0.0;
        object.rotation.z = v.z || 0.0;
    }

    function applyUV2( options, object ) {
        
        if ( !object.isMesh ) {
            return;
        }

        if ( !options.material ) return;
        if ( !options.material.aoMap ) return;

        object.geometry.attributes.uv2 = object.geometry.attributes.uv;
    
    }
    
    function loadModel( world, options, name ) {

        if ( options.type != 'Model' ) return;
        if ( options.disable ) return;

        if ( typeof options.file != 'string' ) {
            console.warn( `Assets: asset ${name}: actual file attribute is ${typeof item.file}, expected string` );
            return;

        }

        
        const pmremGenerator = new THREE.PMREMGenerator( world.get3( 'renderer.main' ) );
        pmremGenerator.compileEquirectangularShader();
        
        function rgbeLoaderOnLoad( texture ) {
            const envMap = pmremGenerator.fromEquirectangular( texture ).texture;
            pmremGenerator.dispose();
            console.log( 'environment', options.envmap, envMap );
            world.get3( 'scene.main' ).environment = envMap;
        }

        let textureEquirec;

        if ( options.envmap ) {
            
            if ( options.envmap.match( /\.hdr/ ) ) {

            
                rgbeLoader.load(
                    options.envmap,
                    rgbeLoaderOnLoad,
                    undefined,
                    ( err ) => {
                        console.error( 'An error occurred setting the environment' );
                    }
                );

            } else if ( options.envmap.match( /\.png|\.jpe?g$/ ) ) {

                textureEquirec = textureLoader.load( options.envmap );
			    textureEquirec.mapping = THREE.EquirectangularReflectionMapping;
			    textureEquirec.encoding = THREE.sRGBEncoding;
                world.get3( 'scene.main' ).background = textureEquirec;

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

        let bakeTexture;
        let bakeMaterial;

        if ( options.bake ) {
            bakeTexture = textureLoader.load( options.bake );
            bakeTexture.flipY = false;
            bakeTexture.encoding = THREE.sRGBEncoding;

            bakeMaterial = new THREE.MeshBasicMaterial( {
                map: bakeTexture,
                //Important to avoid z-index in OC2, must be false
                depthTest: true,
                depthWrite: true,
            } );
        }

        let customMaterial;
        let aoMap;
        if ( options.material ) {
            let colorPalette;
            let colorsEmissivePalette;
            if ( options.material.color ) {
                colorPalette = textureLoader.load( options.material.color );
                colorPalette.flipY = false;
                colorPalette.encoding = THREE.sRGBEncoding;
            }

            if ( options.material.emissive ) {
                colorsEmissivePalette = textureLoader.load( options.material.emissive );
                colorsEmissivePalette.flipY = false;
                colorsEmissivePalette.encoding = THREE.sRGBEncoding;
            }

            if ( options.material.aoMap ) {
                aoMap = textureLoader.load( options.material.aoMap );
                aoMap.flipY = false;
                aoMap.encoding = THREE.sRGBEncoding;
            }

            // MeshLambertMaterial
            customMaterial = new THREE.MeshLambertMaterial( {
                color:0xFFFFFF,
                map: colorPalette,
                emissiveMap:colorsEmissivePalette,
                emissiveIntensity:1,
                aoMap
            } );
        }

        /*
        const vitreMaterial = new THREE.MeshStandardMaterial({
            color:0xFFFFFF,
            transparent: true,
            opacity: 0.2,
            emissive:0xFF0000,
            emissiveIntensity:100,
            roughness:1
        });
        */

        function replacePBRs( child ) {

            const pbrs = world.get( 'pbrs' );

            const customProperties = child.userData;
            for ( const propertie in customProperties ) {
                if ( propertie.match( /pbr/ ) ) {
                    const name = propertie.replace( /^pbr_/ , '' );
                    child.material = pbrs.getMaterial( name );
                }
            }

        }

        function processChild( child ) {

            if ( child instanceof THREE.Mesh ) {

                // Trying to fix mouse raycaster
                // console.warn( 'Assets: updateMatrix() & updateMatriwWorld()', child );
                child.updateMatrix();
                child.updateMatrixWorld();
            
                //child.renderOrder = i;

                replacePBRs( child );

                applyShadow( options, child );

                if ( bakeMaterial ) {
                    child.material = bakeMaterial;
                }

                if ( customMaterial ) {
                    child.material = customMaterial;
                }

                if ( textureEquirec ) {
                    //child.material.envMap = textureEquirec;
                }

                if ( child.material ) {
                    //child.material.needsUpdate = false;
                    child.material.side = THREE.DoubleSide;
                }

                if ( child.geometry ) {
                    // Trying to fix mouse raycaster
                    child.geometry.computeBoundingBox();
                }


                /*
                if (child.name.match(/vitre/)) {
                    child.material = vitreMaterial;
                }
                */

                if ( options.rayAsset ) {
                    console.warn( 'Assets: pushing in raycaster list', child );
                    rayAssets.push( child );
                }

                applyWireframe( options, child );


            }

            /*
            if ( child instanceof THREE.Group && child.children.length) {
                child.children.map(processChild);
            }
            */

        }

        function gltfOnLoad( gltf ) {

            console.log( 'Assets:loadAsset:gltfOnLoad', gltf.scene );

            if ( options.bake ) {
                console.log( 'Assets: bake loaded', options.bake );
            } else {
                /*
                bakeMaterial = new THREE.MeshBasicMaterial(
                    {
                        color: 0x444444
                    }
                );
                */
            }

            gltf.scene.traverse( processChild );

            applyScale( options, gltf.scene );
            applyPosition( options, gltf.scene );
            applyRotation( options, gltf.scene );
            applyAnimation( options, gltf.scene );
            applyUV2( options, gltf.scene );

            setTimeout(() => {
                world.add( gltf.scene );
            }, 1000 );
            

        }

        if ( options.file.match( /(gltf|glb)$/i ) ) {
            assets[name] = gltfLoader.load( options.file, gltfOnLoad );
        } else {
            throw new Error( `Assets:loadAsset: ${options.file} file extension not supported` );
        }

    }

    function createShape( world, shapeName, options ) {
        if ( options.disable ) return;
        console.log( 'Assets:createShape:', shapeName, options, categories );
        const mesh = new categories[shapeName]( world, options );

        return mesh;
    }

    function  loadAsset( name, options ) {
        
        if ( options.disable ) return;
        //console.log('Assets:loadAsset:', name, options);

        let shape;

        for ( const shapeCategoryName in Shapes ) {
            const category = Shapes[shapeCategoryName];
            categories[shapeCategoryName] = category;
            
            for ( const shapeName in category ) {
                const camelCaseName = `${shapeCategoryName}${shapeName}`;
                if ( options.type === camelCaseName ) {
                    console.log( 'Assets:loadAsset: categoryName', shapeCategoryName, camelCaseName );
                    categories[camelCaseName] = Shapes[shapeCategoryName][shapeName];
                    shape = createShape( world, camelCaseName, options );                   
                    break;
                }
            }    
        }

        if ( !shape ) {
            if ( options.type === 'Model' ) {
                loadModel( world, options, name );
                return;
            } else {
                throw new Error( `unknow options type ${options.type}` );
            }
        }
        
        return shape;
    }

    function loadAssets() {
        
        if ( !config.items ) {
            console.warn( 'Assets: no items' );
            return;
        }

        for ( const name in config.items ) {
            loadAsset( name, config.items[name] );
        }
    }

    loadAssets();

    const self = {
        assets,
        rayAssets
    };

    world.set( 'assets', self );
    return self;

}

export { Assets }