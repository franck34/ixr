import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

function Loader( world, config ) {

    let loadingManager;


    /*
    <div class="progress-container">
        <div class="progress">
            <div class="progress-value-percent">0%</div>
            <div class="progress-value"></div>
        </div>
    </div>
    */

    const progressBarContainer = document.createElement( 'div' );
    progressBarContainer.className = 'progress-container centered';

    const progressWrapper = document.createElement( 'div' );
    progressWrapper.className = 'progress';

    const progressBar = document.createElement( 'div' );
    progressBar.className = 'progress-value';

    const progressBarValue = document.createElement( 'div' );
    progressBarValue.className = 'progress-value-percent';

    progressBarContainer.appendChild( progressWrapper );
    progressWrapper.appendChild( progressBarValue );
    progressWrapper.appendChild( progressBar );
    document.body.appendChild( progressBarContainer );

    const styles = `

        .progress-container {
            position:absolute;
            bottom:0px;
            height:80px;
            text-align:center;
            margin-left:-325px;
            margin-right:auto;
            left:50%;
            width:650px;
            overflow:hidden;
            transition:opacity 1s;
        }
       
        .progress-container.ended {
            opacity:0;
        }

        .progress {
            background: rgba(255,255,255,0.1);
            justify-content: flex-start;
            border-radius: 100px;
            align-items: center;
            padding: 0 5px;
            display: flex;
            height: 40px;
            width: 500px;
            margin-left:auto;
            margin-right:auto;
            position:relative;
        }

        .progress-value-percent {
            /*animation: load 3s normal forwards;*/
            height: 30px;
            width: 100%;
            text-align:center;
            line-height:30px;
            font-size:20px;
            color:black;
            position:absolute;
            text-shadow: 1px 1px 0px white;
        }

        .progress-value {
            /*animation: load 3s normal forwards;*/
            box-shadow: 0 10px 40px -10px #fff;
            border-radius: 100px;
            background: #fff;
            height: 30px;
            width: 10%;
            transition: width 0.1s;
        }

    `;

    function onStart() {

        console.log( 'LoadingManager: onStart' );

    }

    function onLoad() {

        console.log( 'LoadingManager: onLoaded' );
        setTimeout( () => {
            progressBarContainer.classList.add( 'ended' );
        }, 500 );
        
        setTimeout( () => {
            progressBarContainer.style.zIndex = -1;
        }, 2000 );

    }

    function onProgress( itemUrl, itemsLoaded, itemsTotal ) {

        let progressRatio = itemsLoaded/itemsTotal;
        progressRatio = Math.round( progressRatio );
        progressBar.style.width = `${progressRatio * 100}%`;
        progressBarValue.innerHTML = progressBar.style.width;
        console.log( 'LoadingManager: onProgress', itemUrl, itemsLoaded, itemsTotal );

    }

    
    const css = document.createElement( 'style' );
    css.innerHTML = styles;
    css.setAttribute( 'type', 'text/css' );
    document.head.appendChild( css );

    loadingManager = new THREE.LoadingManager();
    loadingManager.onStart = onStart;
    loadingManager.onLoad = onLoad;
    loadingManager.onProgress = onProgress;


    // Texture loader
    const textureLoader = new THREE.TextureLoader( loadingManager );

    // Draco loader
    const dracoLoader = new DRACOLoader( loadingManager );
    dracoLoader.setDecoderPath( 'draco/' );
    
    // GLTFLoader
    const gltfLoader = new GLTFLoader( loadingManager );
    gltfLoader.setDRACOLoader( dracoLoader );
    if ( config.basepath ) {
        gltfLoader.setPath( config.basepath );
    }

    const rgbeLoader = new RGBELoader( loadingManager ).setDataType( THREE.UnsignedByteType );

    const objLoader = new OBJLoader( loadingManager );

    const loader = {
        loadingManager,
        textureLoader,
        dracoLoader,
        gltfLoader,
        rgbeLoader,
        objLoader
    };

    world.set( 'loader', loader );

    return loader;

}

export { Loader }
