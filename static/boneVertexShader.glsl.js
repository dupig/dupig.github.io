const boneVertexShader = `

    precision highp float;
    precision highp int;
    uniform float time;

    #include <common>
    #include <shadowmap_pars_vertex>
    #include <skinning_pars_vertex>
    
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec2 vUv;
    
    void main() {
        
        #include <skinbase_vertex>
        #include <begin_vertex>
        #include <beginnormal_vertex>
        #include <defaultnormal_vertex>
        vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
        #include <skinning_vertex>
        #include <project_vertex>
        #include <shadowmap_vertex>
        
        vNormal = normal;
        vUv = uv;
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
    }


`;
export default boneVertexShader;