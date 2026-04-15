class Conversation {
    constructor(text, talker, onEnd = null) {
        this.talker = talker;
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
        if (this._next === null && this.onEnd !== null && !this.ended) {
            this.ended = true;
            return this;
        }
        
        if (this.ended) {
            this.onEnd();
        }

        return this._next;
    }
}

export default Conversation;