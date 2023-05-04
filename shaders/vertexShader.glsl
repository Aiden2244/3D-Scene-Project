#version 300 es
in vec3 a_position;
in vec3 a_normal;
in vec2 a_texCoord;

out vec4 v_color;

out vec3 v_normal;
out vec3 v_lightRay;
out vec3 v_eyeVec;

out vec2 v_texCoord;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

uniform vec3 u_lightDirection;
uniform vec3 u_color;

mat3 calculateNormalMatrix(mat4 modelViewMatrix) {
    return transpose(inverse(mat3(modelViewMatrix)));
}

void main() {
    mat4 modelViewMatrix = viewMatrix * modelMatrix;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(a_position, 1.0);

    vec4 vertex = modelViewMatrix * vec4(a_position, 1.0);
    vec4 light = viewMatrix * vec4(u_lightDirection, 0.0);

    mat3 normalMatrix = calculateNormalMatrix(modelViewMatrix);
    v_normal = vec3(normalMatrix * a_normal);
    v_lightRay = vertex.xyz - light.xyz;
    v_eyeVec = -vec3(vertex.xyz);

    v_texCoord = a_texCoord;

    v_color = vec4(u_color, 1.0);
}
