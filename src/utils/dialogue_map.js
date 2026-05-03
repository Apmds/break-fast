const dialogueMap = {
    "placeholder": {
        "conversation": [
            {"speaker": "guy", "text": "hello"},
            {"speaker": "me", "text": "hi"},
            {"speaker": "me", "text": "this is the end"},
        ],
        "next": "placeholder"
    },

    "bridge_start": {
        "conversation": [
            {"speaker": "Construction Worker", "text": [
                {"text": "Hey, ", delay: 0.1},
                {"text": " the bridge is still under maintenance.", delay: 0.2},
                " You can't pass."
            ]},
            {"speaker": "Me", "text": [
                {"text": "Why?", delay: 0.2},
                " Wasn't the it supposed to end today?"
            ]},
            {"speaker": "Construction Worker", "text": "Yes, and we actually just ended the job, but the boss still needs to give the final aproval before the bridge is usable again."},
            {"speaker": "Me", "text": "Phew, that's a relief... For a second I thought my vacation time was being wasted."},
            {"speaker": "Me", "text": "Where is the boss then? Tell him to hurry up."},
            {"speaker": "Construction Worker", "text": "We can't find him right now, he's somewhere else."},
            {"speaker": "Me", "text": "...", sound: false},
            {"speaker": "Me", "text": "WHAT?"},
            {"speaker": "Me", "text": "WHAT DO YOU MEAN YOU DON'T KNOW WHERE HE IS?"},
            {"speaker": "Me", "text": "ISN'T HE SUPPOSED TO BE MANAGING THIS ALL??"},
            {"speaker": "Me", "text": "DO YOU KNOW HOW MUCH TIME I'VE BEEN WAITING FOR THIS VACATION???"},
            {"speaker": "Construction Worker", "text": [
                {"text": "Calm down bro", delay: 0.1},
                ", yelling isn't going to fix anything."
            ]},
            {"speaker": "Construction Worker", "text": "He's probably out there in the city. If you're in such a hurry to leave, go find him."},
            {"speaker": "Me", "text": "Can't you call his phone? Surely he has one-", autoskip: true},
            {"speaker": "Construction Worker", "text": "He doesn't have a phone. He insists on communicating by carrier pigeon."},
            {"speaker": "Me", "text": "You have to be kidding."},
            {"speaker": "Construction Worker", "text": "No, he is just that guy."},
            {"speaker": "Construction Worker", "text": "Now go away, you are becoming noise pollution."},
        ],
    }
};

export default dialogueMap;