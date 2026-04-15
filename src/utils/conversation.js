class Conversation {
    constructor(text, speaker, onEnd = null) {
        this.speaker = speaker;
        this.text = text;

        this.onEnd = onEnd;
        this._next = null;
        this.ended = false;
    }

    next(dialog) {
        this._next = dialog;
        return this;
    }

    get nextval() {
        if (this._next === null && this.onEnd !== null) {
            if (!this.ended) {
                this.ended = true;
                return this;
            }

            this.ended = false;
            return this.onEnd();
        }

        return this._next;
    }
}

export default Conversation;