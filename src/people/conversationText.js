class ConversationText {
    constructor() {
        this._parts = [];
    }

    addPart(part) {
        if (typeof part === 'string') {
            this._parts.push({ text: part, delay: null });
        } else if (typeof part === 'object' && part !== null) {
            this._parts.push({
                text: part.text || "",
                delay: part.delay !== undefined ? part.delay : null
            });
        }

        return this;
    }

    get parts() {
        return this._parts;
    }

    get fullText() {
        return this._parts.map(p => p.text).join('');
    }
}

export default ConversationText;
