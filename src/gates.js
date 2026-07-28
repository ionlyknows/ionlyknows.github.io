import * as THREE from 'three';
import { getGates } from './city.js';

function archMesh(width, height, color) {
  const group = new THREE.Group();
  const postThickness = 0.5;
  const postGeo = new THREE.BoxGeometry(postThickness, height, postThickness);
  const mat = new THREE.MeshBasicMaterial({ color: 0x0d0d14 });
  const edgesMat = new THREE.LineBasicMaterial({ color, fog: false });

  [-1, 1].forEach((side) => {
    const post = new THREE.Mesh(postGeo, mat);
    post.position.set((width / 2) * side, height / 2, 0);
    group.add(post);
    const wire = new THREE.LineSegments(new THREE.EdgesGeometry(postGeo), edgesMat);
    wire.position.copy(post.position);
    group.add(wire);
  });

  const beamGeo = new THREE.BoxGeometry(width + 1.0, postThickness, postThickness);
  const beam = new THREE.Mesh(beamGeo, mat);
  beam.position.set(0, height, 0);
  group.add(beam);
  const beamWire = new THREE.LineSegments(new THREE.EdgesGeometry(beamGeo), edgesMat);
  beamWire.position.copy(beam.position);
  group.add(beamWire);

  return group;
}

export function createGates(scene) {
  const gates = getGates();
  gates.forEach(({ zone, point, tangent }) => {
    const arch = archMesh(8, 5.5, zone.color);
    arch.position.set(point.x, 0, point.z);
    arch.rotation.y = Math.atan2(tangent.x, tangent.z);
    scene.add(arch);
  });
}
