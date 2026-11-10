uniform vec3 uDirection;
uniform float uLength;

attribute float aEnd;

varying float vAlpha;

void main()
{
    // Each star becomes a streak trailing opposite the travel direction
    vec3 streakPosition = position - uDirection * uLength * aEnd;
    vAlpha = 1.0 - aEnd;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(streakPosition, 1.0);
}
