#version 300 es
precision highp float;

uniform vec4 u_ambientLight;
uniform vec4 u_diffuseLight;
uniform vec4 u_specularLight;

uniform vec3 u_ambientMaterial;
uniform vec3 u_diffuseMaterial;
uniform vec3 u_specularMaterial;
uniform float u_shininess;

uniform sampler2D u_texture; // Add texture sampler
uniform sampler2D u_normalMap; // Add normal map sampler
uniform bool u_useTexture; // Add texture sampler
uniform bool u_useNormalMap; // Add normal map sampler

in vec3 v_normal;
in vec3 v_lightRay;
in vec3 v_eyeVec;

in vec4 v_color;

in vec2 v_texCoord; // Add vertex attribute
in vec2 v_normalMapCoord; // Add vertex attribute

out vec4 fragColor;


void main() {

    vec3 L = normalize(v_lightRay);
    vec3 N = normalize(v_normal);

    if (u_useNormalMap) {
        vec3 normalMapColor = texture(u_normalMap, v_normalMapCoord).rgb;
        normalMapColor = normalMapColor * 2.0 - 1.0;
        N = normalize(N + normalMapColor);
    }

    float lambertTerm = dot(N, -L);

    vec4 Ia = u_ambientLight * vec4(u_ambientMaterial, 1.0);
    vec4 Id = vec4(0.0, 0.0, 0.0, 1.0);
    vec4 Is = vec4(0.0, 0.0, 0.0, 1.0);

    if (lambertTerm > 0.0) {
        Id = u_diffuseLight * vec4(u_diffuseMaterial, 1.0) * lambertTerm;
        vec3 E = normalize(v_eyeVec);
        vec3 R = reflect(L, N);
        float specular = pow(max(dot(R, E), 0.0), u_shininess + 0.01);
        Is = u_specularLight * vec4(u_specularMaterial, 1.0) * specular;
    }

    vec4 color = vec4(vec3(Ia + Id + Is),1.0);

    vec4 texColor = vec4(texture(u_texture, v_texCoord)); // Sample the texture
    if (u_useTexture) {
        fragColor = v_color * color * vec4(texColor.rgb, 1.0); // Multiply color with texture color
    } else {
        fragColor = v_color * color;
    }
}