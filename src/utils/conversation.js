class Conversation {
    constructor(text, speaker, onEnd = null, next = null) {
        this.speaker = speaker;
        this.text = text;

        this.onEnd = onEnd;
        this._nextPiece = null;
        this._next = next;
        this._ignoreNext = false;
        this.ended = false;
    }

    load(json, onEnd = null, ignoreNext = false) {
        const conversation = json.conversation;
        const firstEntry = conversation[0];

        this.speaker = firstEntry.speaker;
        this.text = firstEntry.text;
        this._ignoreNext = ignoreNext;
        
        if (conversation.length === 1) {
            this.onEnd = onEnd;

            if (!ignoreNext && json.next !== undefined) {
                this._next = json.next;
            }

            return this;
        }

        const nextjson = conversation.slice(1);
        const nextPayload = { conversation: nextjson, next: json.next };

        this._nextPiece = new Conversation().load(nextPayload, onEnd, ignoreNext);

        return this;
    }

    get nextval() {
        if (this._nextPiece === null && this.onEnd !== null) {
            if (!this.ended) {
                this.ended = true;
                return this;
            }
            
            this.ended = false;
            if (this._ignoreNext) {
                this._next = this.onEnd();
            } else {
                this.onEnd();
            }

            return this._next;
        }

        return this._nextPiece;
    }
}

export default Conversation;