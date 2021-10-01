import * as THREE from 'three';
import canvasTxt from 'canvas-txt';
import { Text } from 'troika-three-text';


function TextPanel(world) {

    let ctx, canvas, text, textTexture, group;

    const MESH_TRANSPARENT_MATERIAL_DEFAULT = {
        wireframe:false,
        transparent: true,
        opacity:0.99,
        side: THREE.DoubleSide,
        alphaTest:0.1,
        map:undefined,
    };

    const panelWidth = 0.60;
    const panelHeight = (panelWidth*9)/16;

    const canvasWidth = 256;
    const canvasHeight = (canvasWidth*9)/16;

    const textColor = '#ffffff';

    init();

    function init() {
        
        initCanvas();
        group = new THREE.Group();
        group.selectable = true;

        //initTransparentBlock(group);
        //initText(group);
        //setText('');
        
        // Initialize troika-text
        text = new Text();
        text.anchorX = 'center';
        text.anchorY = 'middle';
        //text.curveRadius = 1;
        text.font = '/fonts/CONSOLA.TTF';

        group.add(text)
        group.rotation.x = -Math.PI/3;
        
        // Set properties to configure:
        text.text = '';
        text.fontSize = 0.01;

        text.color = 0x9966FF;

        // Update the rendering
        text.sync();

        world.log = text;

    }

    function merge(defaults, options) {
        const target = {};
        for (const key in defaults) {
            if (key in options) {
                target[key] = options[key];
            } else {
                if (defaults[key]!=undefined) {
                    target[key] = defaults[key];
                }
            }
        }
        return target;
    }

    function MeshTransparentMaterial(options) {
        options = merge(MESH_TRANSPARENT_MATERIAL_DEFAULT, options);
        if (options.map) {
            //options.bumpMap = options.map;
        }
        return new THREE.MeshPhongMaterial(options);
    }

    function initCanvas() {
        canvas = document.createElement("canvas");
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        ctx = canvas.getContext("2d");
        textTexture = new THREE.CanvasTexture(canvas);
    }

    function initTransparentBlock(group) {
        const material = MeshTransparentMaterial({ opacity:0.2 });
        const geometry = new THREE.BoxGeometry(panelWidth, panelHeight, 0.01);
        const mesh = new THREE.Mesh( geometry, material );
        mesh.position.z-=0.006;
        mesh.rotation.x-=0.3;
        mesh.selectable = true;
        mesh.receiveShadow = true;
        mesh.castShadow = true;
        group.add( mesh );
    }

    function initText(group) {
        const material = new THREE.MeshPhongMaterial({ map:textTexture });
        const geometry = new THREE.PlaneGeometry(panelWidth-0.02, panelHeight-0.02);
        const mesh = new THREE.Mesh( geometry, material );
        mesh.rotation.x-=0.3;
        mesh.selectable = true;
        //mesh.receiveShadow = true;
        //mesh.castShadow = true;
        group.add( mesh );
    }

    function setText(val) {
        text = val.toString();

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        //ctx.globalCompositeOperation = "destination-over";
        //ctx.fillStyle = "#010101";
        //ctx.fillRect(0, 0, canvas.width, canvas.height);

        // https://github.com/geongeorge/canvas-txt

        canvasTxt.align = 'left';
        canvasTxt.vAlign = 'top';
        canvasTxt.justify = false;
        canvasTxt.font = 'sans-serif';
        canvasTxt.fontSize = 10;
        canvasTxt.fontWeight = 'normal';
        //canvasTxt.lineHeight = 60;

        ctx.fillStyle = textColor;     
        canvasTxt.drawText(ctx, text, 0, 0, canvasWidth, canvasHeight);
        
        // stroke blue
        //ctx.globalCompositeOperation = "source-over";
        //ctx.lineWidth = 1;
        //ctx.strokeStyle="#0000FF";
        //ctx.strokeRect(0, 0, canvas.width, canvas.height);

        textTexture.needsUpdate = true;

    }

    group.setText = setText;

    return group;
}

export { TextPanel }