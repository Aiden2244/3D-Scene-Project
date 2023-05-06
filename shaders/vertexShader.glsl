#version 300 es
in vec3 a_position;
in vec3 a_normal;
in vec2 a_texCoord;
in vec2 a_normalCoord;

out vec4 v_color;

out vec3 v_normal;
out vec3 v_lightRay;
out vec3 v_eyeVec;

out vec2 v_texCoord;
out vec2 v_normalMapCoord;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

uniform vec3 u_lightDirection;
uniform vec3 u_color;

void main() {
    mat4 modelViewMatrix = viewMatrix * modelMatrix;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(a_position, 1.0);

    vec4 vertex = modelViewMatrix * vec4(a_position, 1.0);
    vec4 light = viewMatrix * vec4(u_lightDirection, 0.0);

    mat3 normalMatrix = mat3(inverse(transpose(modelViewMatrix)));
    v_normal = vec3(normalMatrix * a_normal);
    v_lightRay = vertex.xyz - light.xyz;
    v_eyeVec = -vec3(vertex.xyz);

    v_texCoord = a_texCoord;
    v_normalMapCoord = a_normalCoord;

    v_color = vec4(u_color, 1.0);
}
