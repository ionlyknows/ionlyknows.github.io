uniform float uIntensity;

varying vec3 vColor;

void main()
{
    gl_FragColor = vec4(vColor * uIntensity, 1.0);
}
