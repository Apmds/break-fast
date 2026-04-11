
import * as THREE from 'three';
import objectManager from '../utils/object_manager.js';

function make_skybox() {
    const geometry = new THREE.BoxGeometry(5000,5000,5000);
    var materials = [
         new THREE.MeshBasicMaterial({
              map : objectManager.getObject('skybox_px'),
              side : THREE.BackSide,
         }),
         new THREE.MeshBasicMaterial({
              map : objectManager.getObject('skybox_nx'),
              side : THREE.BackSide,
         }),
         new THREE.MeshBasicMaterial({
              map : objectManager.getObject('skybox_py'),
              side : THREE.BackSide,
         }),
         new THREE.MeshBasicMaterial({
              map : objectManager.getObject('skybox_ny'),
              side : THREE.BackSide,
         }),
         new THREE.MeshBasicMaterial({
              map : objectManager.getObject('skybox_pz'),
              side : THREE.BackSide,
         }),
         new THREE.MeshBasicMaterial({
              map : objectManager.getObject('skybox_nz'),
              side : THREE.BackSide,
         }),
    ];
    const skybox = new THREE.Mesh(geometry,materials);

    return skybox
}

export default make_skybox;

