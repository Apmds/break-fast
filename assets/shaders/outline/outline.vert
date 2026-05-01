uniform float thickness;

#include <skinning_pars_vertex>

void main() {
    vec3 objectNormal = vec3(normal);
    vec3 transformed = vec3(position);

    // Apply skeletal animations
    #include <skinbase_vertex>
    #include <skinnormal_vertex>
    #include <skinning_vertex>

    // Extrude the mesh
    vec3 pos = transformed + objectNormal * thickness;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}