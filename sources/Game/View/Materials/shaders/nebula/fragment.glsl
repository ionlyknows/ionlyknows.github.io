uniform float uIntensity;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uBandAxis;
uniform vec3 uMilkyAxis;
uniform float uMilkyIntensity;

varying vec3 vDirection;

float hash(vec3 p)
{
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float noise(vec3 x)
{
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
        mix(mix(hash(i), hash(i + vec3(1, 0, 0)), f.x), mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y),
        mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x), mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y),
        f.z);
}

float fbm(vec3 p)
{
    float value = 0.0;
    float amplitude = 0.5;
    for(int i = 0; i < 5; i++)
    {
        value += amplitude * noise(p);
        p *= 2.02;
        amplitude *= 0.5;
    }
    return value;
}

// One soft procedural nebula: fbm clouds concentrated along a band of the sky.
// Milky Way (M5): a soft band around the galactic equator with darker dust lanes along its middle.
// Plain noise sums (no third fbm loop: ANGLE's D3D compiler stalls on it).
void main()
{
    vec3 direction = normalize(vDirection);
    float warp = fbm(direction * 2.0);
    float clouds = fbm(direction * 3.5 + warp * 1.5);
    float band = exp(- pow(dot(direction, uBandAxis) * 2.4, 2.0));

    float density = smoothstep(0.35, 0.85, clouds) * band;
    vec3 color = mix(uColorA, uColorB, smoothstep(0.3, 0.75, warp));

    float latitude = dot(direction, uMilkyAxis);
    float milkyBand = exp(- pow(latitude * 5.5, 2.0));
    float milkyNoise = noise(direction * 7.0) * 0.6 + noise(direction * 15.0) * 0.4;
    float dust = smoothstep(0.42, 0.7, noise(direction * 9.0 + 3.1) * 0.65 + noise(direction * 21.0) * 0.35) * exp(- pow(latitude * 14.0, 2.0));
    float milky = milkyBand * (0.45 + 0.75 * milkyNoise) * (1.0 - 0.8 * dust);
    vec3 milkyColor = mix(vec3(0.62, 0.66, 0.78), vec3(0.85, 0.78, 0.66), milkyNoise);

    gl_FragColor = vec4(color * density * uIntensity + milkyColor * milky * uMilkyIntensity, 1.0);
}
