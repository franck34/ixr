/* eslint-disable no-mixed-spaces-and-tabs */
import * as THREE from 'three';

function PBRs( world, config ) {

    if ( !config || typeof config != 'object' ) {
        throw new Error( 'PBRs: unexpected "config" type' );
    }

    const pbrs = {};
    const loader = world.get( 'loader' );
    const extension = '.jpg';
    const basePath = '/textures/pbrs';
    const resolution = '4k';
    
    function getFilePath( name, type ) {
        return `${basePath}/${name}_${type}_${resolution}${extension}`;
    }

    const textureLoader = loader.textureLoader;

    function loadPBR( name, options ) {
        
        if ( options.disable ) return;
        //console.log('Assets:loadAsset:', name, options);     
    
        let fname = '';
        if ( options.basepath ) fname+= options.basepath;
        if ( options.basename ) fname+= options.basename;

        const textures = {
            color:{
                file:getFilePath( fname, 'color' )
            },
            /*
            alpha:{
                file:getFilePath( fname, 'alpha' )
            },
            */
            height:{
                file:getFilePath( fname, 'height' )
            },
            normal:{
                file:getFilePath( fname, 'normal' )
            },
            ambient:{
                file:getFilePath( fname, 'ao' )
            },
            metalness:{
                file:getFilePath( fname, 'metallic' )
            },
            roughness:{
                file:getFilePath( fname, 'roughness' )
            }
        };

        for ( const textureKey in textures ) {

            const item = textures[ textureKey ];

            item.texture = textureLoader.load( item.file );
            item.texture.flipY = false;
            item.texture.encoding = THREE.sRGBEncoding;
            item.texture.repeat.x = 1;
            item.texture.repeat.y = 1;

            pbrs[ name ] = textures;

        }
                
    }

    function loadPBRs() {
        
        if ( !config.items ) {
            console.warn( 'loadPBRs: no items' );
            return;
        }

        for ( const name in config.items ) {
            loadPBR( name, config.items[name] );
        }
    }

    loadPBRs();


    function createPBRMaterial( name ) {

        console.log( 'createPBRMaterial', name );

        const pbr = pbrs [ name ];
        if ( !pbr ) {
            throw new Error( 'unknow PBR material' );
        }

        const opts = {};

        if ( pbr.color && pbr.color.texture ) {
            opts.map = pbr.color.texture;
        }
        
        if ( pbr.alpha && pbr.alpha.texture ) {
            opts.alphaMap = pbr.alpha.texture;
        }

        if ( pbr.ambient && pbr.ambient.texture ) {
            opts.aoMap = pbr.ambient.texture;
        }

        if ( pbr.height && pbr.height.texture ) {
            opts.displacementMap = pbr.height.texture;
        }

        if ( pbr.normal && pbr.normal.texture ) {
            opts.normalMap = pbr.normal.texture;
        }

        if ( pbr.metalness && pbr.metalness.texture ) {
            opts.metalnessMap = pbr.metalness.texture;
        }

        if ( pbr.roughness && pbr.roughness.texture ) {
            opts.roughnessMap = pbr.roughness.texture;
        }


        opts.wireframe = false;

        const material = new THREE.MeshStandardMaterial( opts );
        //material.side = THREE.DoubleSide // Frontside BackSide
        //material.flatShading = true;
        material.aoMapIntensity = 1;
        material.displacementScale = 0;
        material.transparent = false;
        material.wireframe = false;
        material.color = new THREE.Color( 0xFFFFFF );

        console.log(material );
        return material;

    }

    function getMaterial( name ) {

        console.log( 'getMaterial', name, pbrs );
        if ( !pbrs[ name ].material ) {
            pbrs[ name ].material = createPBRMaterial( name );
        }

        return pbrs[ name ].material;

    }

    const self = {
        getMaterial
    };

    world.set( 'pbrs', self );

    return self;

}

export { PBRs };
