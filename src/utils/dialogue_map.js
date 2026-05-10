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
                " You can't pass.",
            ]},
            {"speaker": "Me", "text": [
                {"text": "Why?", delay: 0.2},
                " Wasn't the it supposed to end today?",
            ]},
            {"speaker": "Construction Worker", "text": [
                {"text": "Yes", delay: 0.2},
                {"text": ", and we actually just ended the job", delay: 0.2},
                ", but the boss still needs to give the final aproval before the bridge is usable again.",
            ]},
            {"speaker": "Me", "text": [
                {"text": "Phew", delay: 0.2},
                {"text": ", that's a relief...", delay: 0.4},
                "For a second I thought my vacation time was being wasted.",
            ]},
            {"speaker": "Me", "text": [
                {"text": "Where is the boss then?", delay: 0.2},
                " Tell him to hurry up.",
            ]},
            {"speaker": "Construction Worker", "text": [
                {"text": "We can't find him right now", delay: 0.1},
                ", he's somewhere else.",
            ]},
            {"speaker": "Me", "text": [
                {"text": ".", delay: 0.5},
                {"text": ".", delay: 0.5},
                {"text": "."},                
            ], sound: false},
            {"speaker": "Me", "text": "WHAT?"},
            {"speaker": "Me", "text": "WHAT DO YOU MEAN YOU DON'T KNOW WHERE HE IS?"},
            {"speaker": "Me", "text": "ISN'T HE SUPPOSED TO BE MANAGING THIS ALL??"},
            {"speaker": "Me", "text": "DO YOU KNOW HOW MUCH TIME I'VE BEEN WAITING FOR THIS VACATION???"},
            {"speaker": "Construction Worker", "text": [
                {"text": "Calm down bro", delay: 0.2},
                ", yelling isn't going to fix anything."
            ]},
            {"speaker": "Construction Worker", "text": [
                {"text": "He's probably out there in the city.", delay: 0.2},
                " If you're in such a hurry to leave, go find him.",
            ]},
            {"speaker": "Me", "text": [
                {"text": "Can't you call his phone?", delay: 0.4},
                {"text": " Surely he has one-", delay: 0.1},
            ], autoskip: true},
            {"speaker": "Construction Worker", "text": [
                {"text": "He doesn't have a phone.", delay: 0.2},
                " He insists on communicating by carrier pigeon.",
            ]},
            {"speaker": "Me", "text": "You have to be kidding."},
            {"speaker": "Construction Worker", "text": [
                {"text": "No,", delay: 0.2},
                " he is just that guy.",
            ]},
            {"speaker": "Construction Worker", "text": [
                {"text": "Now go away,", delay: 0.2},
                " you are becoming noise pollution.",
            ]},
        ],
    },

    "boss_restaurant": {
        "conversation": [
            { "speaker": "Construction Worker", "text": [
                "Umm... hi. Can I help you?"
            ]},
            { "speaker": "Me", "text": [
                "(he has a hard hat, so he must be with the construction crew)",
            ], sound: false},
            { "speaker": "Me", "text": [
                "Do you know where I could find your boss?",
            ]},
            { "speaker": "Construction Worker", "text": [
                "I'm my own boss, that you very much.",
            ]},
            { "speaker": "The Boss", "text": [
                "Oh, you mean the boss of the construction crew? That's also me. My name is The Boss, don't forget the \"The\". Most people forget my first name for some reason.",
            ]},
            { "speaker": "Me", "text": [
                "I finally found you, thank god!",
            ]},
            { "speaker": "Me", "text": [
                "Now, WHERE WERE YOU??",
            ]},
            { "speaker": "Me", "text": [
                "DO YOU KNOW HOW MUCH TIME I'VE BEEN WAITING FOR A BREAK? IT'S PROBABLY BEEN",
            ], autoskip: true, speed: 60},
            { "speaker": "The Boss", "text": [
                "WOW, calm down man. I'm on my lunch break, can't you see?",
            ], speed: 20},
            { "speaker": "The Boss", "text": [
                "Besides, why are you rushing me to get back anyway? The construction does not end until-",
            ], autoskip: true, speed: 20},
            { "speaker": "Me", "text": [
                "It ends today. The construction ends today. Your guys are just waiting for you to leave.",
            ]},
            { "speaker": "Me", "text": [
                "And I'M also waiting for you. Do you know how much I worked to be able to have this bre-",
            ], autoskip: true},
            { "speaker": "The Boss", "text": [
                "Wait, WHAT? I have to get back, QUICK!",
            ], animation: "scare"},
        ]
    },

    "boss_end": {
        "conversation": [
            { "speaker": "The Boss", "text": [
                "you won bro"
            ]}
        ]
    },
};

export default dialogueMap;