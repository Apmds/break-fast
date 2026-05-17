import { inputManager } from "./input_manager.js";
import * as THREE from 'three';
import Player from '../player/player.js';
import City from "../city/city.js";
import MainMenu from '../ui/main_menu.js';
import CannonDebugger from 'cannon-es-debugger';
import isDebugMode from "./debug_utils.js";
import EndScene from "../city/end_scene.js";

const GameState = {
    MAIN_MENU: "MAIN_MENU",
    TRANSITIONING: "TRANSITIONING",
    PLAYING: "PLAYING",
}

class GameManager {
    constructor() {
        this.gameState = GameState.MAIN_MENU;
        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.5, 10000);

        // Menu camera
        this.menuCameraPos = new THREE.Vector3(35, 25, -191);
        this.menuCameraEuler = new THREE.Euler(-0.148, 0.575, 0.081);

        this.camera.position.copy(this.menuCameraPos);
        this.camera.quaternion.setFromEuler(this.menuCameraEuler);

        // Player start position and rotations
        this.playerStartPos = new THREE.Vector3(-79, 3.4, -309);
        this.playerStartPitch = -0.148;
        this.playerStartYaw = Math.PI / 2;
        this.playerStartEuler = new THREE.Euler(this.playerStartPitch, this.playerStartYaw, 0, 'YXZ');

        this.scene = new City(this.camera, () => {
            this.scene.unsetAsCurrent();

            // Go to end scene
            this.scene = new EndScene(this.camera, this.player);
            this.scene.setAsCurrent();
        });
        this.scene.setAsCurrent();

        this.player = new Player(this.camera, this.scene.domElement, this.scene.physicsWorld, this.scene.scene);
        this.scene.setPlayer(this.player);
        this.player.canMove = isDebugMode();

        this.clock = new THREE.Timer();
        
        if (isDebugMode()) {
            this.cannonDebugger = new CannonDebugger(this.scene.scene, this.scene.physicsWorld);
        }

        this.main_menu = new MainMenu(this.camera, this.menuCameraPos, this.menuCameraEuler, this.playerStartPos, this.playerStartEuler);
        this.main_menu.onStart = () => {
            this.gameState = GameState.TRANSITIONING;
        };
        this.main_menu.onEnd = () => {
            this.gameState = GameState.PLAYING;

            // Snap physics body to player start (camera was free during transition)
            this.player.physicsBody.position.set(
                this.playerStartPos.x,
                this.playerStartPos.y - 1.2,
                this.playerStartPos.z
            );
            this.player.physicsBody.velocity.set(0, 0, 0);
            this.player.physicsBody.angularVelocity.set(0, 0, 0);

            // Sync CameraControls so mouse doesn't snap on first move
            this.player.cameraControls.pitch = this.playerStartPitch;
            this.player.cameraControls.yaw = this.playerStartYaw;

            // Engage pointer lock — player stays frozen until bridge_guy convo done
            this.player.lock();
        };

        if (isDebugMode()) {
            (function() {
                let spamInterval;
                let isSpamming = false;

                function pressE() {
                    const eventOptions = { key: 'e', code: 'KeyE', keyCode: 69, bubbles: true };
                    window.dispatchEvent(new KeyboardEvent('keydown', eventOptions));
                    window.dispatchEvent(new KeyboardEvent('keyup', eventOptions));
                }

                window.addEventListener('keydown', (e) => {
                    if (e.key === 'F4') {
                        if (!isSpamming) {
                            spamInterval = setInterval(pressE, 50);
                            isSpamming = true;
                            console.log("E Spammer: STARTED");
                        } else {
                            clearInterval(spamInterval);
                            isSpamming = false;
                            console.log("E Spammer: STOPPED");
                        }
                    }
                });

                console.log("E Spammer loaded. Press F4 to start/stop.");
            })();
        }

        // Skip main menu on debug mode
        if (isDebugMode()) {
            this.gameState = GameState.PLAYING;
            this.main_menu.hide();
            this.camera.position.copy(this.playerStartPos);
            this.camera.quaternion.setFromEuler(this.playerStartEuler);
            this.player.physicsBody.position.set(
                this.playerStartPos.x,
                this.playerStartPos.y - 1.2,
                this.playerStartPos.z
            );
            this.player.cameraControls.pitch = this.playerStartPitch;
            this.player.cameraControls.yaw = this.playerStartYaw;
            this.player.lock();
        }

        window.addEventListener('resize', () => {
            this.scene.handleResize();
        });
    }

    frameUpdate() {
        this.scene.begin();
        this.update();
        this.render();
        this.scene.end();
    }

    update() {
        const delta = this.clock.getDelta();

        switch (this.gameState) {
            case GameState.TRANSITIONING:
                this.main_menu.update(delta);
                break;

            case GameState.PLAYING:
                this.player.update(delta);
                break;
        }

        this.scene.update(delta);
        if (isDebugMode()) {
            this.cannonDebugger.update();
        }
        this.clock.update();
        inputManager.update();
    }

    render() {
        this.scene.render();
    }
}

export default GameManager;