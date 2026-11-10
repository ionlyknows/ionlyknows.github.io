uniform vec3 uColor;
uniform float uIntensity;
uniform float uLimb; // cos-angle where the planet's edge sits inside the shell
uniform vec3 uSunDirection;

varying vec3 vNormal;
varying vec3 vViewDirection;
varying vec3 vWorldNormal;

// Thin scattering glow: brightest at the limb, mostly on the sunlit side
void main()
{
    vec3 normal = normalize(vNormal);
    vec3 view = normalize(vViewDirection);
    float glow;

    if(gl_FrontFacing)
    {
        // Over the planet disc: haze that rises toward the limb; outside it, fade to the shell's edge
        float facing = clamp(dot(normal, view), 0.0, 1.0);
        glow = facing > uLimb
            ? pow(1.0 - (facing - uLimb) / (1.0 - uLimb), 4.0)
            : pow(facing / uLimb, 3.0);
        glow *= 0.55;
    }
    else
    {
        // Ring outside the planet: 1 at the limb, 0 at the shell's edge
        glow = pow(clamp(- dot(normal, view) / uLimb, 0.0, 1.0), 3.0);
    }

    float day = smoothstep(- 0.35, 0.55, dot(normalize(vWorldNormal), uSunDirection));
    glow *= 0.06 + 0.94 * day;

    gl_FragColor = vec4(uColor * glow * uIntensity, 1.0);
}
