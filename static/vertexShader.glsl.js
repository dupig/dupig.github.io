const vertexShader = `

    precision highp float;
    precision highp int;
    uniform float time;

    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec2 vUv;

    float PI = 3.141592653589793;

    void main(){
        vNormal = normal;
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

}
`;
export default vertexShader;