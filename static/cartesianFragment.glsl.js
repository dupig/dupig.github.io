const cartesianFragment = `

    precision mediump float;
    uniform float time;

    varying vec3 vPosition;
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
        float a = grid3(vPosition*0.003,0.1);
        float alpha = 0.5+0.5*time;
        float ratioZ = 0.01*floor((20.0-vPosition.z)*0.01);
        if(a<1.0) gl_FragColor = vec4(0.54,0.76,1.0,0.6);
        else gl_FragColor = vec4(0.54,0.76,1.0,0.2);
    }
`;
export default cartesianFragment;