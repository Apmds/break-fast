class Conversation {
    constructor(text, talker, onEnd = null) {
        this.talker = talker;
        this.text = text;

        this.onEnd = onEnd;
        this._next = null;
    }

    next(dialog) {
        this._next = dialog;
        return this._next;
    }

    get next() {
        if (this._next === null && this.onEnd !== null) {
            this.onEnd();
        }
        return this._next;
    }
}

export default Conversation;