uniform float uIntensity;

varying float vAlpha;

void main()
{
    gl_FragColor = vec4(vec3(0.75, 0.9, 1.0) * vAlpha * uIntensity, 1.0);
}
