const ClockForm = {
    "clock_enable": {
        "order" : 20,
        "text" : "Enable Clock",
        "type" : "bool",
        "value" : false
    },
    "clock_name": {
        "order" : 20,
        "condition": "clock_enable.value",
        "text" : "Clock Name",
        "type" : "text"
    },
    "clock_time_format": {
        "condition": "clock_enable.value",
        "options": [
            {
                "label": "Localized Time (no seconds)",
                "value": "LT"
            },
            {
                "label": "Localized Time (with seconds)",
                "value": "LTS"
            },
            {
                "label": "24 Hours (e.g 20:20)",
                "value": "HH:mm"
            },
            {
                "label": "12 Hour (e.g 08:20 pm)",
                "value": "hh:mm A"
            },
            {
                "label": "24 Hours with fractional seconds",
                "value": "HH:mm:ss.SSS"
            },
            {
                "label": "Custom (Use Text field)",
                "value": "custom"
            }
        ],
        "order": 22,
        "text": "Clock Time Format",
        "type": "combo",
        "value": "LT"
    },
    "clock_time_format_custom": {
        "condition": "clock_enable.value && clock_time_format.value == custom",
        "type": "text",
        "text": "Custom Time Format",
        "value": "LT"
    },
    "clock_time_format_help": {
        "condition": "clock_enable.value && clock_time_format.value == custom",
        "type": "button",
        "text": "Time Format Help",
        "icon": "help",
        "class": "red darken-4",
        "fontclass": "white-text"
    },
    
    "clock_date_format": {
        "condition": "clock_enable.value",
        "options": [
            {
                "label": "Localized Date",
                "value": "L"
            },
            {
                "label": "Month Name, Day, Year (localized)",
                "value": "LL"
            },
            {
                "label": "d.m.Y (e.g. 22.09.2019)",
                "value": "DD.MM.YYYY"
            },
            {
                "label": "Custom (Use Text field)",
                "value": "custom"
            }
        ],
        "order": 22,
        "text": "Clock Time Format",
        "type": "combo",
        "value": "L"
    },
    "clock_date_format_custom": {
        "condition": "clock_enable.value && clock_date_format.value == custom",
        "type": "text",
        "text": "Custom Time Format",
        "value": "LT"
    },
    "clock_date_format_help": {
        "condition": "clock_enable.value && clock_date_format.value == custom",
        "type": "button",
        "text": "Time Format Help",
        "icon": "help",
        "class": "red darken-4",
        "fontclass": "white-text"
    },
    
    "clock_spacing": {
        "condition": "clock_enable.value",
        "type": "slider",
        "min": -400,
        "max": 400,
        "value": 10,
        "text": "Vertical Spacing (Time <-> Date)"
    },
    
    "clock_font_time": {
        "condition": "clock_enable.value",
        "options": [
            {
                "label": "Digital",
                "value": "digital"
            },
            {
                "label": "Calibri",
                "value": "calibri"
            },
            {
                "label": "Corsiva",
                "value": "corsiva"
            },
            {
                "label": "Script MT",
                "value": "script mt"
            },
            {
                "label": "Segoe UI",
                "value": "segoe ui"
            },
            {
                "label": "Courier",
                "value": "courier"
            },
            {
                "label": "Impact",
                "value": "impact"
            }
        ],
        "order": 22,
        "text": "Clock Font",
        "type": "combo",
        "value": "segoe ui"
    },
    "clock_color_time" : 
    {
        "condition": "clock_enable.value",
        "order" : 23,
        "text" : "Clock Color",
        "type" : "color",
        "value" : "#808080"
    },
    "clock_size_time" : 
    {
        "condition": "clock_enable.value",
        "order" : 24,
        "text" : "Clock Size",
        "type" : "slider",
        "value" : "30",
        "min": 5,
        "max": 200,
        "editable": true
    },
    
    
    
    "clock_font_date": {
        "condition": "clock_enable.value",
        "options": [
            {
                "label": "Digital",
                "value": "digital"
            },
            {
                "label": "Calibri",
                "value": "calibri"
            },
            {
                "label": "Corsiva",
                "value": "corsiva"
            },
            {
                "label": "Script MT",
                "value": "script mt"
            },
            {
                "label": "Segoe UI",
                "value": "segoe ui"
            },
            {
                "label": "Courier",
                "value": "courier"
            },
            {
                "label": "Impact",
                "value": "impact"
            }
        ],
        "order": 22,
        "text": "Clock Font",
        "type": "combo",
        "value": "segoe ui"
    },
    "clock_color_date" : 
    {
        "condition": "clock_enable.value",
        "order" : 23,
        "text" : "Clock Color",
        "type" : "color",
        "value" : "#808080"
    },
    "clock_size_date" : 
    {
        "condition": "clock_enable.value",
        "order" : 24,
        "text" : "Clock Size",
        "type" : "slider",
        "value" : "30",
        "min": 5,
        "max": 200,
        "editable": true
    },
    
        
    "bassShakeEnabled": {
        "condition": "clock_enable.value",
        "order": 140,
        "text": "Enable Bass Shake",
        "type": "bool",
        "value": false
    },
    "bassShakeStrength": {
        "condition": "clock_enable.value && bassShakeEnabled.value",
        "text": "Shake Strength",
        "type": "slider",
        "min": 1,
        "max": 200,
        "value": 100
    },
    "bounceOnBeatEnabled": {
        "condition": "clock_enable.value",
        "order": 140,
        "text": "Enable Music Bouncing",
        "type": "bool",
        "value": false
    },
    "bounceStrength": {
        "condition": "clock_enable.value && bounceOnBeatEnabled.value",
        "text": "Bounce Strength",
        "type": "slider",
        "min": 1,
        "max": 200,
        "value": 100
    },
    "blurOnBeatEnabled": {
        "condition": "clock_enable.value",
        "order": 140,
        "text": "Enable Beat Blur",
        "type": "bool",
        "value": false
    },
    "beatBlurStrength": {
        "condition": "clock_enable.value && blurOnBeatEnabled.value",
        "text": "Blur Strength",
        "type": "slider",
        "min": 1,
        "max": 200,
        "value": 100
    },
    
    "clock_offset_x" : 
    {
        "condition": "clock_enable.value",
        "order" : 30,
        "text" : "Clock Position X (%)",
        "type" : "slider",
        "value" : "0",
        "min": -105,
        "max": 105,
        "editable": true
    },
    "clock_offset_y" : 
    {
        "condition": "clock_enable.value",
        "order" : 31,
        "text" : "Clock Position Y (%)",
        "type" : "slider",
        "value" : "0",
        "min": -105,
        "max": 105,
        "editable": true
    },
    "clock_anchor": {
        "condition": "clock_enable.value",
        "options": [
            {
                "label": "Clock Center",
                "value": "center"
            },
            {
                "label": "Clock Top Left",
                "value": "top left"
            }
        ],
        "order": 32,
        "text": "Clock Anchor",
        "type": "combo",
        "value": "center"
    },
    "clock_screen_anchor": {
        "condition": "clock_enable.value",
        "options": [
            {
                "label": "Screen(s) Center",
                "value": "center"
            },
            {
                "label": "Screen(s) Top Left",
                "value": "top left"
            }
        ],
        "order": 33,
        "text": "Clock Screen Anchor",
        "type": "combo",
        "value": "center"
    }
}