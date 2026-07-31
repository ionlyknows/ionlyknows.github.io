import * as THREE from 'three';
import { getNeonMaterial } from '../materials/neonMaterials.js';
import { registerFlicker } from '../effects/flicker.js';
import { enableBloom } from '../postprocessing/layers.js';

const OUTWARD_TUBE = 0.03;
const OUTWARD_GLOW = 0.015;
export const SIGN_SEED_COUNT = 5;
const FLICKER_CHANCE = 0.4;

function facadeOffset(facingAxis, facingSign, width, depth, outward) {
  const position = new THREE.Vector3();
  if (facingAxis === 'x') {
    position.x = facingSign * (width / 2 + outward);
  } else {
    position.z = facingSign * (depth / 2 + outward);
  }
  return position;
}

function spanAxisSize(facingAxis, width, depth) {
  return facingAxis === 'x' ? depth : width;
}

function applySpanPosition(mesh, facingAxis, value) {
  if (facingAxis === 'x') mesh.position.z = value;
  else mesh.position.x = value;
}

function makeSpanBoxGeometry(facingAxis, thickness, heightOrDepthDim) {
  return facingAxis === 'x'
    ? new THREE.BoxGeometry(thickness, heightOrDepthDim, 1)
    : new THREE.BoxGeometry(1, heightOrDepthDim, thickness);
}

function applySpanScale(mesh, facingAxis, size) {
  if (facingAxis === 'x') mesh.scale.z = size;
  else mesh.scale.x = size;
}

export function buildNeonSignage({
  width,
  height,
  depth,
  zoneColor,
  facingAxis,
  facingSign,
  signSeeds,
}) {
  const group = new THREE.Group();
  const tubeMat = getNeonMaterial(zoneColor, 'tube');
  const glowMat = getNeonMaterial(zoneColor, 'glow');
  const span = spanAxisSize(facingAxis, width, depth);
  const baseOffset = facadeOffset(facingAxis, facingSign, width, depth, OUTWARD_TUBE);
  const glowOffset = facadeOffset(facingAxis, facingSign, width, depth, OUTWARD_GLOW);

  const stripHeight = height * 0.84;
  const stripY = height * 0.08 + stripHeight / 2;
  const stripSpanPos = span / 2 - 0.15;

  const strip = new THREE.Mesh(new THREE.BoxGeometry(0.08, stripHeight, 0.08), tubeMat);
  strip.position.copy(baseOffset);
  strip.position.y = stripY;
  applySpanPosition(strip, facingAxis, stripSpanPos);
  group.add(strip);

  const stripGlow = new THREE.Mesh(new THREE.BoxGeometry(0.3, stripHeight, 0.3), glowMat);
  stripGlow.position.copy(glowOffset);
  stripGlow.position.y = stripY;
  applySpanPosition(stripGlow, facingAxis, stripSpanPos);
  group.add(stripGlow);

  const barCount = 1 + Math.floor(signSeeds[0] * 3);
  const bandTop = height * 0.85;
  const barThickness = 0.12;
  const barGap = 0.28;
  const usableSpan = Math.max(span - 0.6, 1);

  const flickerSeed = signSeeds[4];
  const flickers = flickerSeed < FLICKER_CHANCE;
  const barTubeMat = flickers ? tubeMat.clone() : tubeMat;
  const barGlowMat = flickers ? glowMat.clone() : glowMat;
  if (flickers) {
    const phase = flickerSeed * Math.PI * 8;
    registerFlicker(barTubeMat, phase);
    registerFlicker(barGlowMat, phase);
  }

  let maxBarLength = 0;
  for (let i = 0; i < barCount; i++) {
    const lengthFrac = 0.35 + signSeeds[1 + (i % (SIGN_SEED_COUNT - 2))] * 0.45;
    const barLength = usableSpan * lengthFrac;
    maxBarLength = Math.max(maxBarLength, barLength);
    const barY = bandTop - i * barGap;

    const bar = new THREE.Mesh(makeSpanBoxGeometry(facingAxis, 0.06, barThickness), barTubeMat);
    bar.position.copy(baseOffset);
    bar.position.y = barY;
    applySpanScale(bar, facingAxis, barLength);
    group.add(bar);
  }

  const clusterHeight = barGap * (barCount - 1) + 0.4;
  const clusterY = bandTop - (barGap * (barCount - 1)) / 2;
  const clusterSpan = maxBarLength + 0.4;

  const clusterGlow = new THREE.Mesh(makeSpanBoxGeometry(facingAxis, 0.5, clusterHeight), barGlowMat);
  clusterGlow.position.copy(glowOffset);
  clusterGlow.position.y = clusterY;
  applySpanScale(clusterGlow, facingAxis, clusterSpan);
  group.add(clusterGlow);

  enableBloom(group);
  return group;
}
