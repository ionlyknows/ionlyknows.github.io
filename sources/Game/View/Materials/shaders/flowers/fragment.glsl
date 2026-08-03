#define M_PI 3.1415926535897932384626433832795

uniform float uSpeciesType;
uniform float uPetalCount;

varying vec2 vUv;
varying vec3 vColor;
varying float vSeed;

void main()
{
    float mask;

    if(uSpeciesType < 0.5)
    {
        vec2 headCenter = vec2(0.5, 0.78);
        vec2 toCenter = vUv - headCenter;
        float radius = length(toCenter);
        float angle = atan(toCenter.x, toCenter.y) + vSeed * 6.2831853;
        float petal = cos(angle * uPetalCount);
        float petalRadius = mix(0.1, 0.24, 0.5 + 0.5 * petal);

        float isHead = step(0.5, vUv.y);
        float insideHead = step(radius, petalRadius);

        float stemHalfWidth = 0.07;
        float insideStem = step(abs(vUv.x - 0.5), stemHalfWidth);

        mask = max(isHead * insideHead, (1.0 - isHead) * insideStem);
    }
    else
    {
        float repeats = 7.0;
        float bandY = vUv.y * repeats;
        float bandIndex = floor(bandY);
        float localY = fract(bandY);
        float bandCenterX = 0.5 + 0.22 * sin((bandIndex + vSeed * 10.0) * 2.399);
        vec2 bandCenter = vec2(bandCenterX, 0.5);
        float radius = length((vec2(vUv.x, localY) - bandCenter) * vec2(1.0, 0.7));

        float isBloomZone = step(0.3, vUv.y);
        float insideBloom = step(radius, 0.3);

        float stemHalfWidth = 0.05;
        float insideStem = step(abs(vUv.x - 0.5), stemHalfWidth);

        mask = max(isBloomZone * insideBloom, (1.0 - isBloomZone) * insideStem);
    }

    if(mask < 0.5)
        discard;

    gl_FragColor = vec4(vColor, 1.0);
}
