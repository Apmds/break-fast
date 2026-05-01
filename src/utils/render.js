import * as THREE from 'three';
import { BufferGeometryUtils } from 'three/addons/Addons.js';
import objectManager from './object_manager.js';

class Renderer {
    constructor() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setClearColor(new THREE.Color(0xffffff));
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowMap;

        const outline_vert_shader = objectManager.getObject("outline_vert_shader", false);
        const outline_frag_shader = objectManager.getObject("outline_frag_shader", false);

        this.outlineScale = 1.0;
        this.outlineHelpers = new Map();
        this.outlineMaterial = new THREE.ShaderMaterial({
            uniforms: {
                outlineColor: { value: new THREE.Color(0xffffff) },
                thickness: { value: 0.1 }
            },
            vertexShader: outline_vert_shader,
            fragmentShader: outline_frag_shader,
            side: THREE.BackSide,
            skinning: true
        });
    }
    
    ensureOutlineHelper(sourceMesh) {
        let helper = this.outlineHelpers.get(sourceMesh.uuid);
        if (helper) return helper;
        
        let smoothGeometry = sourceMesh.geometry.clone();
        
        // Delete everything except the spatial positions animation stuff
        const attributesToRemove = Object.keys(smoothGeometry.attributes).filter(
            attr => !['position', 'skinIndex', 'skinWeight'].includes(attr)
        );
        attributesToRemove.forEach(attr => smoothGeometry.deleteAttribute(attr));

        smoothGeometry = BufferGeometryUtils.mergeVertices(smoothGeometry);        
        smoothGeometry.computeVertexNormals();

        // 2. Determine if we need a Mesh or a SkinnedMesh
        if (sourceMesh.isSkinnedMesh) {
            helper = new THREE.SkinnedMesh(smoothGeometry, this.outlineMaterial);
            
            // 3. Link the skeleton of the source to the helper
            helper.bind(sourceMesh.skeleton, sourceMesh.bindMatrix);
        } else {
            helper = new THREE.Mesh(smoothGeometry, this.outlineMaterial);
        }

        helper.name = `${sourceMesh.name || 'mesh'}_outline`;
        helper.userData.isOutline = true;
        helper.castShadow = false;
        helper.receiveShadow = false;
        helper.raycast = () => null;
        
        // Important for transparent or complex scenes
        helper.renderOrder = sourceMesh.renderOrder - 1; 

        sourceMesh.add(helper);
        this.outlineHelpers.set(sourceMesh.uuid, helper);
        return helper;
    }

    syncOutlineHelpers(scene) {
        const activeMeshIds = new Set();

        scene.traverse((node) => {
            if (node.userData?.outline !== true || node.userData?.isOutline === true) {
                return;
            }

            node.traverse((child) => {
                if (!child.isMesh || child.userData?.isOutline === true) {
                    return;
                }

                activeMeshIds.add(child.uuid);
                const helper = this.ensureOutlineHelper(child);
                helper.visible = true;
            });
        });

        this.outlineHelpers.forEach((helper, sourceId) => {
            if (!helper.parent) {
                this.outlineHelpers.delete(sourceId);
                return;
            }

            helper.visible = activeMeshIds.has(sourceId);
        });
    }

    addToDom() {
        document.body.appendChild(this.renderer.domElement);
    }

    removeFromDom() {
        document.body.removeChild(this.renderer.domElement);
    }

    update() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    get domElement() {
        return this.renderer.domElement;
    }

    render(scene, camera) {
        this.syncOutlineHelpers(scene);
        this.renderer.render(scene, camera);
    }
}

export default Renderer;