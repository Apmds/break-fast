import * as THREE from 'three';
import { BufferGeometryUtils } from 'three/addons/Addons.js';
import objectManager from './object_manager.js';

class Renderer {
    constructor() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setClearColor(new THREE.Color(0xffffff));
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowMap;

        const outline_vert_shader = objectManager.getObject("outline_vert_shader", false);
        const outline_frag_shader = objectManager.getObject("outline_frag_shader", false);

        this.outlineScale = 1.0;
        this.outlineHelpers = new Map();
        this._lastOutlined = null;
        this.outlineMaterial = new THREE.ShaderMaterial({
            uniforms: {
                outlineColor: { value: new THREE.Color(0xffffff) },
                thickness: { value: 0.1 }
            },
            vertexShader: outline_vert_shader,
            fragmentShader: outline_frag_shader,
            side: THREE.BackSide,
            depthTest: false,
            depthWrite: false,
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
        
        helper.renderOrder = 999;
        sourceMesh.renderOrder = 1000;

        sourceMesh.add(helper);
        this.outlineHelpers.set(sourceMesh.uuid, helper);
        return helper;
    }

    syncOutlineHelpers(hovered) {
        // Outline state only changes when the hovered object changes, so skip the
        // per-frame model traversal unless the target actually changed.
        if (hovered === this._lastOutlined) {
            return;
        }

        // Hide outline helpers of the previously hovered object.
        this._lastOutlined?.model?.traverse((child) => {
            if (child.userData?.isOutline === true) {
                child.visible = false;
            }
        });

        this._lastOutlined = null;

        const model = hovered?.model;
        if (!model || model.userData?.outline !== true) {
            return;
        }

        const ignoreSet = hovered.outlineIgnore;

        model.traverse((child) => {
            if (!child.isMesh || child.userData?.isOutline === true) {
                return;
            }

            if (!child.visible || (child.material && !child.material.visible)) {
                return;
            }

            if (ignoreSet?.has(child.name)) {
                return;
            }

            const helper = this.ensureOutlineHelper(child);
            helper.visible = true;
        });

        this._lastOutlined = hovered;
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

    render(scene, camera, hovered = null) {
        this.syncOutlineHelpers(hovered);
        //console.log(this.renderer.info)
        this.renderer.render(scene, camera);
    }
}

export default Renderer;