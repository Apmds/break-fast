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
                {"text": "Umm... ", delay: 0.2},
                {"text": "hi.", delay: 0.2},
                " Can I help you?"
            ]},
            { "speaker": "Me", "text": [
                {"text": "(he has a hard hat so he must be with the construction crew)", delay: 0.2},
            ], sound: false},
            { "speaker": "Me", "text": [
                {"text": "Do you know where I could find your boss?", delay: 0.2},
            ]},
            { "speaker": "Construction Worker", "text": [
                {"text": "I'm my own boss", delay: 0.2},
                {"text": ", thank you very much.", delay: 0.2},
            ]},
            { "speaker": "The Boss", "text": [
                {"text": "Oh", delay: 0.2},
                {"text": ", you mean the boss of the construction crew?", delay: 0.2},
                {"text": " That's also me.", delay: 0.2},
                {"text": " My name is The Boss", delay: 0.2},
                {"text": ", don't forget the \"The\".", delay: 0.2},
                {"text": " Most people forget my first name for some reason.", delay: 0.2},
            ]},
            { "speaker": "Me", "text": [
                {"text": "I finally found you", delay: 0.2},
                {"text": ", thank god!", delay: 0.2},
            ]},
            { "speaker": "Me", "text": [
                {"text": "Now, ", delay: 0.2},
                {"text": "WHERE ", delay: 0.2},
                {"text": "WERE ", delay: 0.2},
                {"text": "YOU??", delay: 0.2},
            ]},
            { "speaker": "Me", "text": [
                {"text": "DO YOU KNOW HOW MUCH TIME I'VE BEEN WAITING FOR A BREAK?", delay: 0.2},
                {"text": " IT'S PROBABLY BEEN"},
            ], autoskip: true, speed: 60},
            { "speaker": "The Boss", "text": [
                {"text": "WOW", delay: 0.75},
                {"text": ", calm down man.", delay: 0.3},
                {"text": " I'm on my lunch break", delay: 0.2},
                {"text": ", can't you see?", delay: 0.3},
            ], speed: 20},
            { "speaker": "The Boss", "text": [
                {"text": "Besides", delay: 0.2},
                {"text": ", why are you rushing me to get back anyway?", delay: 0.2},
                {"text": " The construction does not end until-"},
            ], autoskip: true, speed: 20},
            { "speaker": "Me", "text": [
                {"text": "It ends today.", delay: 0.5},
                {"text": " The construction ends today.", delay: 0.4},
                {"text": " Your guys are just waiting for you to leave.", delay: 0.2},
            ]},
            { "speaker": "Me", "text": [
                {"text": "And I'M also waiting for you.", delay: 0.2},
                {"text": " Do you know how much I worked to be able to have this bre-"},
            ], autoskip: true, spped: 45},
            { "speaker": "The Boss", "text": [
                {"text": "Wait", delay: 0.2},
                {"text": ", WHAT?", delay: 0.2},
                {"text": " I have to get back", delay: 0.2},
                {"text": ", QUICK!", delay: 0.2},
            ], animation: "scare"},
        ]
    },

    "boss_end": {
        "conversation": [
            { "speaker": "The Boss", "text": [
                {"text": "H-hey sorry guys", delay: 0.2},
                {"text": ", I completely forgot that the contruction ended today.", delay: 0.2}
            ]},
            { "speaker": "Construction Worker", "text": [
                {"text": "It's weird that you didn't know", delay: 0.2},
                {"text": ", since you're our boss and all...", delay: 0.2}
            ]},
            { "speaker": "The Boss", "text": [
                {"text": "I usually have Pi to remind me of this kinds of stuff", delay: 0.2},
                {"text": ", but he's been missing since yesterday.", delay: 0.2}
            ]},
            { "speaker": "Construction Worker", "text": [
                {"text": "Oh", delay: 0.2},
                {"text": ", so that's why we didn't recieve the usual welcome message today.", delay: 0.2}
            ]},
            { "speaker": "Me", "text": [
                {"text": "So your pet pigeon is named Pi?"},
            ]},
            { "speaker": "The Boss", "text": [
                {"text": "Yes", delay: 0.2},
                {"text": ", Pi G. Eon", delay: 0.2},
                {"text": ", he usually never strays too far off from where I am so he's probably around here somewhere.", delay: 0.2},
                {"text": " Good thing this town is small so I can go look for him later.", delay: 0.2}
            ]},
            { "speaker": "The Boss", "text": [
                {"text": "That doesn't matter now", delay: 0.2},
                {"text": ", you did good in finding me.", delay: 0.2},
                {"text": " I would repay you", delay: 0.2},
                {"text": ", but I waste all my money on DcMonalds and pigeon food.", delay: 0.2}
            ]},
            { "speaker": "Me", "text": [
                {"text": "(he really is that guy huh)"},
            ], sound: false},
            { "speaker": "The Boss", "text": [
                {"text": "You can go on your vacation or whatever.", delay: 0.2},
                {"text": " Get in your car and get out of here.", delay: 0.2},
                {"text": " You are becoming noise pollution.", delay: 0.2}
            ]},
        ]
    },

    
};

export default dialogueMap;