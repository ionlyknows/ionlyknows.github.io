uniform float uTime;
uniform float uFlowerDistance;
uniform vec3 uPlayerPosition;
uniform float uTerrainSize;
uniform float uTerrainTextureSize;
uniform sampler2D uTerrainATexture;
uniform vec2 uTerrainAOffset;
uniform sampler2D uTerrainBTexture;
uniform vec2 uTerrainBOffset;
uniform sampler2D uTerrainCTexture;
uniform vec2 uTerrainCOffset;
uniform sampler2D uTerrainDTexture;
uniform vec2 uTerrainDOffset;
uniform sampler2D uNoiseTexture;
uniform float uFresnelOffset;
uniform float uFresnelScale;
uniform float uFresnelPower;
uniform vec3 uSunPosition;
uniform float uFlowerHeight;
uniform float uFlowerWidth;
uniform vec3 uHeadColorA;
uniform vec3 uHeadColorB;
uniform vec3 uStemColor;

attribute vec2 aCenter;
attribute float aScale;
attribute float aHue;
attribute float aSeed;

varying vec2 vUv;
varying vec3 vColor;
varying float vSeed;

#include ../partials/inverseLerp.glsl
#include ../partials/remap.glsl
#include ../partials/getSunShade.glsl
#include ../partials/getSunShadeColor.glsl
#include ../partials/getSunReflection.glsl
#include ../partials/getSunReflectionColor.glsl
#include ../partials/getRotatePivot2d.glsl

vec3 hueShift(vec3 color, float hue)
{
    const vec3 k = vec3(0.57735, 0.57735, 0.57735);
    float cosAngle = cos(hue);
    return color * cosAngle + cross(k, color) * sin(hue) + k * dot(k, color) * (1.0 - cosAngle);
}

void main()
{
    vUv = uv;
    vSeed = aSeed;

    vec2 newCenter = aCenter;
    newCenter -= uPlayerPosition.xz;
    float halfSize = uFlowerDistance * 0.5;
    newCenter.x = mod(newCenter.x + halfSize, uFlowerDistance) - halfSize;
    newCenter.y = mod(newCenter.y + halfSize, uFlowerDistance) - halfSize;
    vec4 modelCenter = modelMatrix * vec4(newCenter.x, 0.0, newCenter.y, 1.0);

    vec3 localPosition = vec3(position.x * uFlowerWidth, position.y * uFlowerHeight, position.z) * aScale;

    vec4 modelPosition = modelMatrix * vec4(localPosition, 1.0);
    modelPosition.xz += newCenter;

    float angleToCamera = atan(modelCenter.x - cameraPosition.x, modelCenter.z - cameraPosition.z);
    modelPosition.xz = getRotatePivot2d(modelPosition.xz, angleToCamera, modelCenter.xz);

    vec2 terrainAUv = (modelPosition.xz - uTerrainAOffset.xy) / uTerrainSize;
    vec2 terrainBUv = (modelPosition.xz - uTerrainBOffset.xy) / uTerrainSize;
    vec2 terrainCUv = (modelPosition.xz - uTerrainCOffset.xy) / uTerrainSize;
    vec2 terrainDUv = (modelPosition.xz - uTerrainDOffset.xy) / uTerrainSize;

    float fragmentSize = 1.0 / uTerrainTextureSize;
    vec4 terrainAColor = texture2D(uTerrainATexture, terrainAUv * (1.0 - fragmentSize) + fragmentSize * 0.5);
    vec4 terrainBColor = texture2D(uTerrainBTexture, terrainBUv * (1.0 - fragmentSize) + fragmentSize * 0.5);
    vec4 terrainCColor = texture2D(uTerrainCTexture, terrainCUv * (1.0 - fragmentSize) + fragmentSize * 0.5);
    vec4 terrainDColor = texture2D(uTerrainDTexture, terrainDUv * (1.0 - fragmentSize) + fragmentSize * 0.5);

    vec4 terrainData = vec4(0);
    terrainData += step(0.0, terrainAUv.x) * step(terrainAUv.x, 1.0) * step(0.0, terrainAUv.y) * step(terrainAUv.y, 1.0) * terrainAColor;
    terrainData += step(0.0, terrainBUv.x) * step(terrainBUv.x, 1.0) * step(0.0, terrainBUv.y) * step(terrainBUv.y, 1.0) * terrainBColor;
    terrainData += step(0.0, terrainCUv.x) * step(terrainCUv.x, 1.0) * step(0.0, terrainCUv.y) * step(terrainCUv.y, 1.0) * terrainCColor;
    terrainData += step(0.0, terrainDUv.x) * step(terrainDUv.x, 1.0) * step(0.0, terrainDUv.y) * step(terrainDUv.y, 1.0) * terrainDColor;

    vec3 normal = terrainData.rgb;

    modelPosition.y += terrainData.a;
    modelCenter.y += terrainData.a;

    float slope = 1.0 - abs(dot(vec3(0.0, 1.0, 0.0), normal));

    float distanceAttenuation = distance(uPlayerPosition.xz, modelCenter.xz) / uFlowerDistance * 2.0;
    float distanceScale = 1.0 - clamp(0.0, 1.0, smoothstep(0.5, 1.0, distanceAttenuation));
    float slopeScale = smoothstep(remap(slope, 0.3, 0.4, 1.0, 0.0), 0.0, 1.0);
    float scale = distanceScale * slopeScale;
    modelPosition.xyz = mix(modelCenter.xyz, modelPosition.xyz, scale);

    float sway = uv.y * uv.y;
    vec2 noiseUv = modelPosition.xz * 0.02 + uTime * 0.05 + aSeed * 4.0;
    vec4 noiseColor = texture2D(uNoiseTexture, noiseUv);
    modelPosition.x += (noiseColor.x - 0.5) * sway * scale * 0.4;
    modelPosition.z += (noiseColor.y - 0.5) * sway * scale * 0.4;

    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    vec3 viewDirection = normalize(modelPosition.xyz - cameraPosition);
    vec3 worldNormal = normalize(mat3(modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz) * normal);
    vec3 viewNormal = normalize(normalMatrix * normal);

    vec3 headColor = mix(uHeadColorA, uHeadColorB, aSeed);
    headColor = hueShift(headColor, aHue);
    vec3 color = mix(uStemColor, headColor, smoothstep(0.35, 0.6, uv.y));

    float sunShade = getSunShade(normal);
    color = getSunShadeColor(color, sunShade);

    float sunReflection = getSunReflection(viewDirection, worldNormal, viewNormal);
    color = getSunReflectionColor(color, sunReflection * 0.4);

    vColor = color;
}
