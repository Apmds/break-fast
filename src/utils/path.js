class Path {
    constructor() {
        this._points = [];
        this._idx = 0;
    }

    ended() {
        return this._idx >= this._points.length;
    }

    _getLastIdx() {
        return this._points.length - 1;
    }

    getLast() {
        return this._points[this._getLastIdx()];
    }

    getNext(loop = true) {
        if (this.ended()) {
            if (loop) {
                this._idx = 0;
            } else {
                this._idx = this._getLastIdx();
            }
        }

        const res = this._points[this._idx];

        if (loop) {
            this._idx++;
        }

        return res;
    }

    addPoint(position, rotation, speed = 1) {
        this._points.push({
            position: position,
            rotation: rotation,
            speed: speed,
        });

        return this;
    }

    clear() {
        this._points = [];
    }
}

export default Path;