const MusicsForm = {
    "enable": {
        "order" : 20,
        "text" : "Enable Player",
        "type" : "bool",
        "value" : false
    },
    "name": {
        "order" : 20,
        "condition": "enable.value",
        "text" : "Player Name",
        "type" : "text"
    },
    "type": {
        "condition": "enable.value",
        "options": [
            {
                "label": "Spotify",
                "value": "spotify"
            },
            {
                "label": "Google Play Music",
                "value": "google"
            }
        ],
        "order": 22,
        "text": "Player Type",
        "type": "combo",
        "value": "spotify"
    },
    "offset_x": {
        "condition": "enable.value",
        "type": "slider",
        "min": -200,
        "max": 200,
        "value": 0,
        "text": "Horizontal Offset"
    },
    "offset_y": {
        "condition": "enable.value",
        "type": "slider",
        "min": -200,
        "max": 200,
        "value": 0,
        "text": "Vertical Offset"
    },
    
    
    "bassShakeEnabled": {
        "condition": "enable.value",
        "order": 140,
        "text": "Enable Bass Shake",
        "type": "bool",
        "value": false
    },
    "bassShakeStrength": {
        "condition": "enable.value && bassShakeEnabled.value",
        "text": "Shake Strength",
        "type": "slider",
        "min": 1,
        "max": 200,
        "value": 100
    },
    "bounceOnBeatEnabled": {
        "condition": "enable.value",
        "order": 140,
        "text": "Enable Music Bouncing",
        "type": "bool",
        "value": false
    },
    "bounceStrength": {
        "condition": "enable.value && bounceOnBeatEnabled.value",
        "text": "Bounce Strength",
        "type": "slider",
        "min": 1,
        "max": 200,
        "value": 100
    }
}