#version 300 es
in vec3 a_position; // object space vertex position
in vec3 a_normal; // object space vertex normal
in vec2 a_texCoord; // vertex texture coordinates
in vec2 a_normalCoord; // vertex normal map coordinates

out vec4 v_color; // interpolated fragment color (out to the fragment shader)

out vec3 v_normal; // interpolated normal for phong lighting
out vec3 v_lightRay; // light vector for phong lighting
out vec3 v_eyeVec; // eye vector for phong lighting
 
out vec2 v_texCoord; // interpolated texture coordinates
out vec2 v_normalMapCoord; // interpolated normal map coordinates

uniform mat4 modelMatrix; // object space -> world space matrix
uniform mat4 viewMatrix; // world space -> eye space matrix
uniform mat4 projectionMatrix; // eye space -> clip space matrix

uniform vec3 u_lightDirection; // light direction in eye space
uniform vec3 u_color; // diffuse material color

void main() {
    mat4 modelViewMatrix = viewMatrix * modelMatrix;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(a_position, 1.0);

    vec4 vertex = modelViewMatrix * vec4(a_position, 1.0);

    mat3 normalMatrix = mat3(inverse(transpose(modelViewMatrix)));
    vec4 light = vec4(normalMatrix * u_lightDirection, 0.0);

    // calculate the lighting vectors
    v_normal = vec3(normalMatrix * a_normal);
    v_lightRay = vertex.xyz - light.xyz;
    v_eyeVec = -vec3(vertex.xyz);

    // pass the texture coordinates to the fragment shader
    v_texCoord = a_texCoord;
    v_normalMapCoord = a_normalCoord;

    v_color = vec4(u_color, 1.0);
}
