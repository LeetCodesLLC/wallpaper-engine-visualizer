const SettingsForm = {
    "locale": {
        "order" : 1,
        "text" : "Locale",
        "type" : "combo",
        "options": [
            {
                "label": "English (en)",
                "value": "en"
            },
            {
                "label": "German (de)",
                "value": "de"
            },
            {
                "label": "French (fr)",
                "value": "fr"
            }
        ],
        "value" : "en"
    },
    
    "fps": {
        "text": "Target FPS",
        "type": "slider",
        "min": 5,
        "max": 120,
        "value": 20
    },
    
    "showfps": {
        "text": "Show FPS",
        "type": "bool",
        "value": false
    },
    
    "showparticles": {
        "text": "Show Particles Background",
        "type": "bool",
        "value": false
    }
}