import dialogueMap from "./dialogue_map.js";
import ConversationText from "./conversationText.js";

class Conversation {
    constructor(text, speaker, onEnd = null, next = null) {
        this.speaker = speaker;
        this.text = text;
        
        this.onEnd = onEnd === null ? () => null : onEnd;
        this._nextPiece = null;
        this._next = next;
        this._ignoreNext = false;
        this.ended = false;
        this._autoskip = false;
        this._sound = true;
    }

    load(convKey, onEnd = null, ignoreNext = false, index = 0, root = null) {
        const json = dialogueMap[convKey];
        //console.log(json, index)

        const conversation = json.conversation;
        const entry = conversation[index];

        if (entry.autoskip !== undefined) {
            this._autoskip = entry.autoskip;
        }
        if (entry.sound !== undefined) {
            this._sound = entry.sound;
        }

        this.speaker = entry.speaker;
        this.text = this.loadText(entry.text);
        this._ignoreNext = ignoreNext;
        
        if (index >= conversation.length - 1) {
            this.onEnd = onEnd === null ? () => null : onEnd;

            if (!ignoreNext && json.next !== undefined) {
                //console.log(convKey, json.next);
                
                if (json.next === convKey) { // Repeating conversation
                    this._next = root === null ? this : root;
                } else {
                    this._next = new Conversation().load(json.next);
                }
            }

            return this;
        }

        this._nextPiece = new Conversation().load(convKey, onEnd, ignoreNext, index + 1, root === null ? this : root);

        return this;
    }

    loadText(text) {
        const conversationText = new ConversationText();
        if (Array.isArray(text)) {
            text.forEach(part => conversationText.addPart(part));
        } else {
            conversationText.addPart(text);
        }
        return conversationText;
    }

    get nextval() {
        if (this._nextPiece === null) {
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

    isAutoSkip() {
        return this._autoskip;
    }

    hasSound() {
        return this._sound;
    }
}

export default Conversation;