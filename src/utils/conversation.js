class Conversation {
    constructor(text, speaker, onEnd = null) {
        this.speaker = speaker;
        this.text = text;

        this.onEnd = onEnd;
        this._next = null;
        this.ended = false;
    }

    load(json, onEnd = null) {
        this.speaker = json[0][0];
        this.text = json[0][1];
        
        if (json.length == 1) {
            this.onEnd = onEnd;
            return this;
        }

        const nextjson = json.slice(1);
        this.next(new Conversation().load(nextjson, onEnd));

        return this;
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