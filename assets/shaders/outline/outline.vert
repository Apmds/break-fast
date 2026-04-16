uniform float thickness;

void main() {
    vec3 pos = position + normal * thickness;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}