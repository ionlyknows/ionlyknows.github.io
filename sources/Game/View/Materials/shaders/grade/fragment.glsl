uniform sampler2D tDiffuse;
uniform float uTime;
uniform float uVignette;
uniform float uGrain;
uniform float uGrade;

varying vec2 vUv;

float random(vec2 st)
{
    return fract(sin(dot(st, vec2(12.9898, 78.233))) * 43758.5453);
}

void main()
{
    vec4 color = texture2D(tDiffuse, vUv);

    // Color grading: cool shadows, warm highlights
    float luma = dot(color.rgb, vec3(0.299, 0.587, 0.114));
    vec3 shadows = vec3(-0.004, 0.0, 0.01); // keep space near-black
    vec3 highlights = vec3(0.03, 0.012, -0.02);
    color.rgb += mix(shadows, highlights, smoothstep(0.15, 0.75, luma)) * uGrade;

    // Vignette
    float distanceToCenter = length(vUv - 0.5);
    color.rgb *= 1.0 - uVignette * smoothstep(0.35, 0.85, distanceToCenter);

    // Film grain
    float grain = random(vUv * 1000.0 + fract(uTime * 7.0) * 100.0) - 0.5;
    color.rgb += grain * uGrain;

    gl_FragColor = vec4(clamp(color.rgb, 0.0, 1.0), color.a);
}
