import * as THREE from 'three';

function getLineMaterial() {
    const material = new THREE.RawShaderMaterial( {
        uniforms: {
                color: {
                    type: 'c',
                    value: new THREE.Color(0xffffff)
                },
                limitDistance:{
                    value: 5.0
                }
            },
            transparent: true,
            vertexShader: `
            attribute vec2 uv;
            attribute vec4 position;
            varying vec4 vPos;
            uniform mat4 projectionMatrix;
            uniform mat4 modelViewMatrix;
            void main() {
                vPos = position;
                gl_Position = projectionMatrix * modelViewMatrix * position;
            }
        `,
            fragmentShader:  `
            precision highp float;
            precision highp int;
            uniform vec3 color;
            uniform float opacity;
            varying vec4 vPos;
            float limitDistance = 5.0;
            void main() {
                float distance = clamp(length(vPos), 0., limitDistance);
                float opacity = 1. - distance / limitDistance;
                gl_FragColor = vec4(color, opacity);
            }
        `
            
        }
    );

    return material;
}

function getGlowMaterial() {

    const material = new THREE.ShaderMaterial({
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        fog: true,
    
        uniforms: THREE.UniformsUtils.merge([
          THREE.UniformsLib["fog"], {
            "c": {
              type: "f",
              value: 0
            },
            "p": {
              type: "f",
              value: 4.5
            },
            glowColor: {
              type: "c",
              value: new THREE.Color(0x0061c2)
            },
            viewVector: {
              type: "v3",
              value: {
                x: 0,
                y: 0,
                z: 400
              }
            },
            fog: true
          },
        ]),
    
        fragmentShader: [
            'uniform vec3 glowColor;',
            'varying float intensity;',
            THREE.ShaderChunk[ "common" ],
            THREE.ShaderChunk[ "fog_pars_fragment" ],
            'void main()',
            '{',
              'vec3 outgoingLight = vec3( 0.0 );',
              'vec3 glow = glowColor * intensity;',                    
              THREE.ShaderChunk[ "fog_fragment" ],
              'gl_FragColor = vec4(glow, 1.0 );',
            '}'
          ].join('\n'),
    
        vertexShader: [
            'uniform vec3 viewVector;',
            'uniform float c;',
            'uniform float p;',
            'varying float intensity;',
            'void main()',
            '{',
              'vec3 vNormal = normalize( normalMatrix * normal );',
              'vec3 vNormel = normalize( normalMatrix * viewVector );',
              'intensity = pow( c - dot(vNormal, vNormel), p );',
              'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
            '}'
          ].join("\n")
      });

      return material;

}

function getFineLine() {

    const material = getLineMaterial();
    const geometry = new THREE.BufferGeometry();

    const line = new THREE.Line( geometry, material );
    line.geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( [ 0, 0, 0, 0, 0, - 10 ], 3 ) );
    line.name = 'rayline';

    return line;

}

function getBasicLine() {

    const geometry = new THREE.BufferGeometry().setFromPoints( [
        new THREE.Vector3( 0, 0, 0 ),
        new THREE.Vector3( 0, 0, -1 )
    ] );
    
    const line = new THREE.Line( geometry );
    line.scale.z = 10;

    return line;

}


function getBeam() {

    const line = getBasicLine();
    console.log(line);

    const glow = new THREE.Mesh(line.geometry.clone(), getGlowMaterial());
    glow.scale.multiplyScalar(30);
    line.add(glow);

    return line;

}


const Ray = {};

Ray.getFineLine = getFineLine;
Ray.getBasicLine = getBasicLine;
Ray.getBeam = getBeam;

export { Ray }
