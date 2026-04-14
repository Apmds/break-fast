import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

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

        this.composer = null;
        this.outlinePass = null;
    }

    setupPostProcessing(scene, camera) {
        this.composer = new EffectComposer(this.renderer);

        const renderPass = new RenderPass(scene, camera);
        this.composer.addPass(renderPass);

        this.outlinePass = new OutlinePass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            scene,
            camera
        );
        this.outlinePass.visibleEdgeColor.set(0xffffff);
        this.outlinePass.hiddenEdgeColor.set(0xffffff);
        this.outlinePass.edgeStrength = 3.0;
        this.outlinePass.edgeGlow = 0.0;
        this.outlinePass.edgeThickness = 1.0;
        this.composer.addPass(this.outlinePass);

        this.composer.addPass(new OutputPass());
    }

    getOutlinedObjects(scene) {
        const outlinedObjects = [];

        scene.traverse((node) => {
            if (node.userData?.outline !== true) {
                return;
            }

            if (node.isMesh) {
                outlinedObjects.push(node);
                return;
            }

            node.traverse((child) => {
                if (child.isMesh) {
                    outlinedObjects.push(child);
                }
            });
        });

        return outlinedObjects;
    }

    addToDom() {
        document.body.appendChild(this.renderer.domElement);
    }

    removeFromDom() {
        document.body.removeChild(this.renderer.domElement);
    }

    update() {
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

        if (this.composer) {
            this.composer.setSize(window.innerWidth, window.innerHeight);
        }

        if (this.outlinePass) {
            this.outlinePass.setSize(window.innerWidth, window.innerHeight);
        }
    }

    get domElement() {
        return this.renderer.domElement;
    }

    render(scene, camera) {
        if (!this.composer || !this.outlinePass) {
            this.setupPostProcessing(scene, camera);
        }

        this.outlinePass.selectedObjects = this.getOutlinedObjects(scene);
        this.composer.render();
    }
}

export default Renderer;