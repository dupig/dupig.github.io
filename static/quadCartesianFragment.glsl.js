const quadCartesianFragment = `

    precision mediump float;
    uniform float time;

    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    varying vec2 vUv;

    float PI = 3.141592653589793;

    float grid2 (vec2 parameter, float width) {
        vec2 d = fwidth(parameter);
        vec2 looped = 0.5 - abs(mod(parameter, 1.0) - 0.5);
        vec2 a2 = smoothstep(d * (width - 0.5), d * (width + 0.5), looped);
        return min(a2.x,a2.y);
      }
      
    
    void main() 
    {
        if(time>-2.0){
            float PI = 3.14159265358;
            float a = 0.5 - abs(mod(vWorldPosition.x*27.2, 1.0) - 0.5);
            float b = 0.5 - abs(mod(vWorldPosition.y*27.2, 1.0) - 0.5);
            float c = 0.5 - abs(mod(vWorldPosition.z*27.2, 1.0) - 0.5);
            float m = min(a,b);
            //使用sin函数完成先变量再变暗
            if (m>0.01) m = 1.0;
            else m = 0.0;
            float alpha = 0.0;
            //vPosition要到100量级才有明显效果，可能跟原模型的尺度有关？原模型是300长宽
            float ratioX = 0.5*(1.0-1.0*time)*floor(abs(vWorldPosition.x-27.2)*0.125+2.0);
            float ratioY = 0.5*(1.0-1.0*time)*floor(abs(vWorldPosition.y-27.2)*0.125+2.0);
            //交错xy有奇效。。。但中间的衍射波纹还没处理好，可能跟参数有关
            //让ratio和mod使用相同的相乘系数，配合ratioX/Y内floor函数初始值的提升(2.0)，可以去除初始态的衍射波纹
            //配合a*ratioX和b*ratioY实现格子大小和颜色相邻的衰退
            if(a>0.5*time*(1.0-0.5*ratioX)&&b>0.5*time*(1.0-0.5*ratioY)) alpha = 1.0*ratioX*ratioY;
            else alpha = 0.0;
            gl_FragColor = vec4(m,m,m,alpha); 
        }
        else gl_FragColor = vec4(1.0,1.0,1.0,0.0);
    }
    `;
export default quadCartesianFragment;