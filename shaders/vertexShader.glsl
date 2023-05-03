#version 300 es
in vec4 a_position; // Add position attribute
in vec2 a_texCoord; // Add texture coordinate attribute
out vec4 v_color; // Pass color to fragment shader
out vec2 v_texCoord; // Pass texture coordinate to fragment shader

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

uniform vec3 u_lightDirection;
uniform vec3 u_lightColor;
uniform vec3 u_ambientLight;
uniform vec3 u_color;

void main() {
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * a_position;

    vec3 normal = normalize(vec3(modelMatrix * a_position));

    float diffuse = max(dot(normal, u_lightDirection), 0.0);

    v_color = vec4(u_color * (u_ambientLight + u_lightColor * diffuse), 1.0);
    v_texCoord = a_texCoord; // Pass the texture coordinate
}