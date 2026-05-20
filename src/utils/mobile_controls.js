import { inputManager } from './input_manager.js';

const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

class MobileControls {
    constructor() {
        this._initialized = false;
        this.cameraControls = null;

        this.joystickTouchId = null;
        this.joystickCenter = { x: 0, y: 0 };
        this.activeJoystickKeys = new Set();
        this.maxKnobDistance = 42;
        this.deadzone = 12;

        this.lookTouchId = null;
        this.lastLookPos = { x: 0, y: 0 };
    }

    init(cameraControls) {
        if (!isMobile) return;

        this.cameraControls = cameraControls;
        this.cameraControls.isMobile = true;

        if (this._initialized) return; // listeners already set up; just swap cameraControls

        this.container     = document.getElementById('mobile-controls');
        this.joystickZone  = document.getElementById('joystick-zone');
        this.joystickBase  = document.getElementById('joystick-base');
        this.joystickKnob  = document.getElementById('joystick-knob');
        this.btnJump       = document.getElementById('btn-jump');
        this.btnInteract   = document.getElementById('btn-interact');

        if (!this.container) return;

        this._setupJoystick();
        this._setupButtons();
        this._setupGlobalTouchHandlers();

        this._initialized = true;
        this.hideAll();
    }

    // ── Joystick ──────────────────────────────────────────────────────────────

    _setupJoystick() {
        this.joystickBase.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (this.joystickTouchId !== null) return;
            const touch = e.changedTouches[0];
            this.joystickTouchId = touch.identifier;
            const rect = this.joystickBase.getBoundingClientRect();
            this.joystickCenter = {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
            };
            this._updateJoystick(touch.clientX, touch.clientY);
        }, { passive: false });
    }

    _updateJoystick(touchX, touchY) {
        const dx = touchX - this.joystickCenter.x;
        const dy = touchY - this.joystickCenter.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const clamped = Math.min(dist, this.maxKnobDistance);
        const angle   = Math.atan2(dy, dx);
        const kx = Math.cos(angle) * clamped;
        const ky = Math.sin(angle) * clamped;
        this.joystickKnob.style.transform = `translate(calc(-50% + ${kx}px), calc(-50% + ${ky}px))`;

        if (dist < this.deadzone) { this._releaseAllJoystickKeys(); return; }

        const P = Math.PI;
        let newKeys;
        if      (angle >= -P/8   && angle <  P/8)   newKeys = ['ArrowRight'];
        else if (angle >=  P/8   && angle <  3*P/8) newKeys = ['ArrowDown', 'ArrowRight'];
        else if (angle >=  3*P/8 && angle <  5*P/8) newKeys = ['ArrowDown'];
        else if (angle >=  5*P/8 && angle <  7*P/8) newKeys = ['ArrowDown', 'ArrowLeft'];
        else if (angle >=  7*P/8 || angle < -7*P/8) newKeys = ['ArrowLeft'];
        else if (angle >= -7*P/8 && angle < -5*P/8) newKeys = ['ArrowUp', 'ArrowLeft'];
        else if (angle >= -5*P/8 && angle < -3*P/8) newKeys = ['ArrowUp'];
        else                                         newKeys = ['ArrowUp', 'ArrowRight'];

        for (const key of this.activeJoystickKeys) {
            if (!newKeys.includes(key)) { inputManager.releaseVirtualKey(key); this.activeJoystickKeys.delete(key); }
        }
        for (const key of newKeys) {
            if (!this.activeJoystickKeys.has(key)) { inputManager.pressVirtualKey(key); this.activeJoystickKeys.add(key); }
        }
    }

    _releaseAllJoystickKeys() {
        for (const key of this.activeJoystickKeys) inputManager.releaseVirtualKey(key);
        this.activeJoystickKeys.clear();
        if (this.joystickKnob) this.joystickKnob.style.transform = 'translate(-50%, -50%)';
    }

    // ── Buttons ───────────────────────────────────────────────────────────────

    _setupButtons() {
        this._setupButton(this.btnJump,     'Space');
        this._setupButton(this.btnInteract, 'KeyE');
    }

    _setupButton(btn, key) {
        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            inputManager.pressVirtualKey(key);
        }, { passive: false });
        btn.addEventListener('touchend', (e) => {
            e.preventDefault();
            inputManager.releaseVirtualKey(key);
        }, { passive: false });
        btn.addEventListener('touchcancel', () => inputManager.releaseVirtualKey(key));
    }

    // ── Touch look + global touch routing ─────────────────────────────────────

    _setupGlobalTouchHandlers() {
        // Look drag: any touch not on controls or UI overlays
        document.addEventListener('touchstart', (e) => {
            if (this.lookTouchId !== null) return;
            const touch = e.changedTouches[0];
            if (touch.identifier === this.joystickTouchId) return;
            const blocked = '#joystick-zone,#btn-jump,#btn-interact,' +
                            '#main-menu,#get-item-menu,#end-menu,#loading-screen,.dialog-box';
            if (e.target.closest(blocked)) return;
            this.lookTouchId = touch.identifier;
            this.lastLookPos = { x: touch.clientX, y: touch.clientY };
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            if (this.joystickTouchId !== null || this.lookTouchId !== null) e.preventDefault();
            for (const touch of e.changedTouches) {
                if (touch.identifier === this.joystickTouchId) {
                    this._updateJoystick(touch.clientX, touch.clientY);
                }
                if (touch.identifier === this.lookTouchId) {
                    this._updateLook(touch.clientX, touch.clientY);
                }
            }
        }, { passive: false });

        const endTouch = (e) => {
            for (const touch of e.changedTouches) {
                if (touch.identifier === this.joystickTouchId) {
                    this.joystickTouchId = null;
                    this._releaseAllJoystickKeys();
                }
                if (touch.identifier === this.lookTouchId) {
                    this.lookTouchId = null;
                }
            }
        };
        document.addEventListener('touchend',    endTouch);
        document.addEventListener('touchcancel', endTouch);
    }

    _updateLook(touchX, touchY) {
        if (!this.cameraControls?.canMove) return;
        const dx = touchX - this.lastLookPos.x;
        const dy = touchY - this.lastLookPos.y;
        this.lastLookPos = { x: touchX, y: touchY };

        this.cameraControls.yaw   -= dx * this.cameraControls.sensitivity * 2.5;
        this.cameraControls.pitch -= dy * this.cameraControls.sensitivity * 2.5;
        const maxPitch = Math.PI / 2 - 0.1;
        this.cameraControls.pitch = Math.max(-maxPitch, Math.min(maxPitch, this.cameraControls.pitch));
    }

    // ── Visibility API ────────────────────────────────────────────────────────

    showAll() {
        if (!this._initialized) return;
        this.container.classList.remove('invisible');
        this.joystickZone.classList.remove('invisible');
        this.btnJump.classList.remove('invisible');
        this.btnInteract.classList.remove('invisible');
    }

    hideAll() {
        if (!this._initialized) return;
        this.container.classList.add('invisible');
    }

    showOnlyInteract() {
        if (!this._initialized) return;
        this._releaseAllJoystickKeys();
        this.container.classList.remove('invisible');
        this.joystickZone.classList.add('invisible');
        this.btnJump.classList.add('invisible');
        this.btnInteract.classList.remove('invisible');
    }
}

export const mobileControls = new MobileControls();
