const dialogueMap = {
    "placeholder": {
        "conversation": [
            {"speaker": "guy", "text": "hello"},
            {"speaker": "me", "text": "hi"},
            {"speaker": "me", "text": "this is the end"},
        ],
        "next": "placeholder2"
    },

    "placeholder2": {
        "conversation": [
            {"speaker": "guy", "text": "hello2"},
            {"speaker": "me", "text": "hi2"},
            {"speaker": "me", "text": "this is the end2"},
        ],
        "next": "placeholder2"
    },
};

export default dialogueMap;