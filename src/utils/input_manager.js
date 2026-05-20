class InputManager {
    constructor() {
        this.pressedKeys = {};
        this.justPressedKeys = {};
        this.leftJoystick = { x: 0, y: 0 };
        this.rightJoystick = { x: 0, y: 0 };
        this.isMobile = false;

        window.addEventListener('keydown', (e) => {
            if (!this.pressedKeys[e.code]) {
                this.justPressedKeys[e.code] = true;
            }
            this.pressedKeys[e.code] = true;
        });
        window.addEventListener('keyup', (e) => {
            this.pressedKeys[e.code] = false;
        });

        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            this.isMobile = true;
            document.body.classList.add('touch-device');
            this._initJoysticks();
        }
    }

    _initJoysticks() {
        this._leftTouch = null;
        this._rightTouch = null;
        const MAX_RADIUS = 40;

        const leftEl   = document.getElementById('joystick-left');
        const rightEl  = document.getElementById('joystick-right');
        const leftKnob = document.getElementById('joystick-left-knob');
        const rightKnob = document.getElementById('joystick-right-knob');

        const assignTouch = (touch) => {
            const lRect = leftEl.getBoundingClientRect();
            const rRect = rightEl.getBoundingClientRect();
            const x = touch.clientX, y = touch.clientY;

            if (!this._leftTouch &&
                x >= lRect.left && x <= lRect.right &&
                y >= lRect.top  && y <= lRect.bottom) {
                this._leftTouch = { id: touch.identifier, ox: x, oy: y };
            } else if (!this._rightTouch &&
                x >= rRect.left && x <= rRect.right &&
                y >= rRect.top  && y <= rRect.bottom) {
                this._rightTouch = { id: touch.identifier, ox: x, oy: y };
            }
        };

        const moveKnob = (touch) => {
            const update = (state, joystick, knob) => {
                if (!state || touch.identifier !== state.id) return false;
                const dx = touch.clientX - state.ox;
                const dy = touch.clientY - state.oy;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const clamped = Math.min(dist, MAX_RADIUS);
                const angle = Math.atan2(dy, dx);
                const nx = Math.cos(angle) * clamped;
                const ny = Math.sin(angle) * clamped;
                joystick.x = nx / MAX_RADIUS;
                joystick.y = ny / MAX_RADIUS;
                knob.style.transform = `translate(calc(-50% + ${nx}px), calc(-50% + ${ny}px))`;
                return true;
            };
            update(this._leftTouch, this.leftJoystick, leftKnob);
            update(this._rightTouch, this.rightJoystick, rightKnob);
        };

        const releaseTouch = (id) => {
            if (this._leftTouch && this._leftTouch.id === id) {
                this._leftTouch = null;
                this.leftJoystick.x = 0;
                this.leftJoystick.y = 0;
                leftKnob.style.transform = 'translate(-50%, -50%)';
            }
            if (this._rightTouch && this._rightTouch.id === id) {
                this._rightTouch = null;
                this.rightJoystick.x = 0;
                this.rightJoystick.y = 0;
                rightKnob.style.transform = 'translate(-50%, -50%)';
            }
        };

        // Touch events
        leftEl.addEventListener('touchstart', (e) => {
            e.preventDefault();
            for (const t of e.changedTouches) assignTouch(t);
        }, { passive: false });

        rightEl.addEventListener('touchstart', (e) => {
            e.preventDefault();
            for (const t of e.changedTouches) assignTouch(t);
        }, { passive: false });

        document.addEventListener('touchmove', (e) => {
            let isTracked = false;
            for (const t of e.changedTouches) {
                if ((this._leftTouch && t.identifier === this._leftTouch.id) ||
                    (this._rightTouch && t.identifier === this._rightTouch.id)) {
                    isTracked = true;
                }
            }
            if (isTracked) e.preventDefault();
            for (const t of e.changedTouches) moveKnob(t);
        }, { passive: false });

        document.addEventListener('touchend', (e) => {
            for (const t of e.changedTouches) releaseTouch(t.identifier);
        });

        document.addEventListener('touchcancel', (e) => {
            for (const t of e.changedTouches) releaseTouch(t.identifier);
        });

        // Mouse events for desktop testing
        const MOUSE_ID = 'mouse';
        const startMouse = (el, e) => {
            e.preventDefault();
            const rect = el.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top  + rect.height / 2;
            const isLeft = el === leftEl;
            const state = { id: MOUSE_ID, ox: cx, oy: cy };
            if (isLeft) this._leftTouch  = state;
            else        this._rightTouch = state;
            moveKnob({ identifier: MOUSE_ID, clientX: e.clientX, clientY: e.clientY });
        };

        leftEl.addEventListener('mousedown',  (e) => startMouse(leftEl,  e));
        rightEl.addEventListener('mousedown', (e) => startMouse(rightEl, e));

        document.addEventListener('mousemove', (e) => {
            if (!this._leftTouch && !this._rightTouch) return;
            moveKnob({ identifier: MOUSE_ID, clientX: e.clientX, clientY: e.clientY });
        });

        document.addEventListener('mouseup', () => {
            releaseTouch(MOUSE_ID);
        });

        this._initActionButtons();
    }

    _initActionButtons() {
        const jumpBtn     = document.getElementById('btn-jump');
        const interactBtn = document.getElementById('btn-interact');

        const bindBtn = (el, code, justPress = false) => {
            const press = (e) => {
                e.preventDefault();
                this.pressedKeys[code] = true;
                if (justPress) this.justPressedKeys[code] = true;
                el.classList.add('pressed');
            };
            const release = () => {
                this.pressedKeys[code] = false;
                el.classList.remove('pressed');
            };
            el.addEventListener('touchstart',  press,   { passive: false });
            el.addEventListener('touchend',    release);
            el.addEventListener('touchcancel', release);
            el.addEventListener('mousedown',   press);
            el.addEventListener('mouseup',     release);
            el.addEventListener('mouseleave',  release);
        };

        bindBtn(jumpBtn,     'Space', false);
        bindBtn(interactBtn, 'KeyE',  true);
    }

    update() {
        this.justPressedKeys = {};
    }

    keyJustPressed(key) {
        return this.justPressedKeys[key] ?? false;
    }

    keyPressed(key) {
        return this.pressedKeys[key] ?? false;
    }
}

export const inputManager = new InputManager();
