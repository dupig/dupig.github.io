const boneCartesianFragment = `

    precision mediump float;
    uniform float time;

    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    varying vec2 vUv;

    float PI = 3.141592653589793;

    float grid3 (vec3 parameter, float width){
        vec3 d = fwidth(parameter);
        vec3 looped = 0.5 - abs(mod(parameter,1.0) - 0.5);
        vec3 a3 = smoothstep(d*(width-0.5),d*(width+0.5),looped);
        return min(min(a3.x,a3.y),a3.z);
    }

    void main(){
        float a = grid3(vWorldPosition*27.2,0.05);
        float alpha = 1.0;
        if(a<1.0) gl_FragColor = vec4(1.0,1.0,1.0,1.0*time);
        else gl_FragColor = vec4(0.3,0.3,0.3,0.0);
    }
`;
export default boneCartesianFragment;