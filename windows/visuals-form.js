const VisualForm = {
    "visual_enable" : {
        "order" : 100,
        "text" : "Enable Visualizer",
        "type" : "bool",
        "value" : false
    },
    "visual_name" : {
        "order" : 101,
        "text" : "Name of the Visualizer",
        "type" : "text",
        "value" : ""
    },
    
    "visual_numberbars": {
        "condition": "visual_enable.value",
        "editable": true,
        "max": 128,
        "min": 1,
        "order": 105,
        "text": "Number of Bars",
        "type": "slider",
        "value": 64
    },
    "visual_channel": {
        "condition": "visual_enable.value",
        "options": [
            {
                "label": "Both",
                "value": "STEREO"
            },
            {
                "label": "Left",
                "value": "LEFT"
            },
            {
                "label": "Right",
                "value": "RIGHT"
            }
        ],
        "order": 106,
        "text": "Audio Channels",
        "type": "combo",
        "value": "STEREO"
    },
    "visual_channel_option": {
        "condition": "visual_enable.value",
        "options": [
            {
                "label": "Normal",
                "value": 0
            },
            {
                "label": "Mirrored",
                "value": 1
            },
            {
                "label": "Repeat",
                "value": 2
            }
        ],
        "order": 107,
        "text": "Channel Option",
        "type": "combo",
        "value": 0
    },
    "visual_channel_mirror": {
        "condition": "visual_enable.value",
        "order": 108,
        "text": "Reverse Channel Data",
        "type": "bool",
        "value": false
    },
    "visual_strength": {
        "condition": "visual_enable.value",
        "editable": true,
        "max": 500,
        "min": 10,
        "order": 110,
        "text": "Visual Scaling",
        "type": "slider",
        "value": 100
    },
    "visual_barwidth": {
        "condition": "visual_enable.value",
        "editable": true,
        "max": 50,
        "min": 0,
        "order": 120,
        "text": "Bar Width",
        "type": "slider",
        "value": 5
    },  
    "visual_bargap": {
        "condition": "visual_enable.value",
        "editable": true,
        "max": 70,
        "min": 0,
        "order": 130,
        "text": "Bar Gap Size",
        "type": "slider",
        "value": 20
    },
    
    "bassShakeEnabled": {
        "condition": "visual_enable.value",
        "order": 140,
        "text": "Enable Bass Shake",
        "type": "bool",
        "value": false
    },
    "bassShakeStrength": {
        "condition": "visual_enable.value && bassShakeEnabled.value",
        "text": "Shake Strength",
        "type": "slider",
        "min": 1,
        "max": 200,
        "value": 100
    },
    "bounceOnBeatEnabled": {
        "condition": "visual_enable.value",
        "order": 140,
        "text": "Enable Music Bouncing",
        "type": "bool",
        "value": false
    },
    "bounceStrength": {
        "condition": "visual_enable.value && bounceOnBeatEnabled.value",
        "text": "Bounce Strength",
        "type": "slider",
        "min": 1,
        "max": 200,
        "value": 100
    },
    "blurOnBeatEnabled": {
        "condition": "visual_enable.value",
        "order": 140,
        "text": "Enable Beat Blur",
        "type": "bool",
        "value": false
    },
    "beatBlurStrength": {
        "condition": "visual_enable.value && blurOnBeatEnabled.value",
        "text": "Blur Strength",
        "type": "slider",
        "min": 1,
        "max": 200,
        "value": 100
    },
    
    "visual_enablecolor": {
        "condition": "visual_enable.value",
        "order": 140,
        "text": "Use Custom Color",
        "type": "bool",
        "value": false
    },
    "visual_color": {
        "condition": "visual_enablecolor.value && visual_enable.value",
        "order": 142,
        "text": "Choose Custom Color",
        "type": "color",
        "value": "#ff0000"
    },
    "visual_reverserainbow": {
        "condition": "!visual_enablecolor.value && visual_enable.value",
        "order": 145,
        "text": "Reverse Rainbow",
        "type": "bool",
        "value": false
    },
    "visual_rotatecolor": {
        "condition": "!visual_enablecolor.value && visual_enable.value",
        "order": 146,
        "text": "Rotate Rainbow",
        "type": "bool",
        "value": false
    },
    "visual_rotatecolorl2r": {
        "condition": "!visual_enablecolor.value && visual_rotatecolor.value && visual_enable.value",
        "order": 147,
        "text": "Rotate Colors in Reverse",
        "type": "bool",
        "value": false
    },
    
    "visual_rotatecolorspeed": {
        "condition": "!visual_enablecolor.value && visual_rotatecolor.value && visual_enable.value",
        "editable": true,
        "max": 30,
        "min": 1,
        "order": 148,
        "text": "Color Rotation Speed",
        "type": "slider",
        "value": 10
    },
    
    "visual_alpha": {
        "condition": "visual_enable.value",
        "editable": true,
        "max": 100,
        "min": 10,
        "order": 155,
        "text": "Opacity",
        "type": "slider",
        "value": 100
    },
    
    "visual_horizontalposition": {
        "condition": "visual_enable.value",
        "editable": true,
        "max": 100,
        "min": -100,
        "order": 170,
        "text": "Horizontal Offset (%)",
        "type": "slider",
        "value": 0
    },            
    "visual_verticalposition": {
        "condition": "visual_enable.value",
        "editable": true,
        "max": 100,
        "min": -100,
        "order": 160,
        "text": "Vertical Offset (%)",
        "type": "slider",
        "value": 0
    },
    
    "visual_hideinactive": {
        "condition": "visual_enable.value",
        "order": 180,
        "text": "Hide when no Sound",
        "type": "bool",
        "value": true
    },
    "visual_bar_hideinactivetimeout": {
        "condition": "visual_hideinactive.value && visual_enable.value",
        "editable": true,
        "max": 10,
        "min": 0,
        "order": 185,
        "text": "Hiding Waiting Time (s)",
        "type": "slider",
        "value": 1
    },
    "visual_hideinactivefadeduration": {
        "condition": "visual_hideinactive.value && visual_enable.value",
        "editable": true,
        "max": 10,
        "min": 0,
        "order": 186,
        "text": "Fade Duration (Hiding, s)",
        "type": "slider",
        "value": 2
    },
    
    "visual_rotation": {
        "condition": "visual_enable.value",
        "editable": true,
        "max": 360,
        "min": 0,
        "order": 190,
        "text": "Rotation (degrees)",
        "type": "slider",
        "value": 0
    },
    "visual_heightlimit": {
        "condition": "visual_enable.value",
        "editable": true,
        "max": 500,
        "min": 0,
        "order": 200,
        "text": "Height Limit",
        "type": "slider",
        "value": 0
    },            
    "visual_verticalgrowthoffset": {
        "condition": "visual_enable.value",
        "editable": true,
        "max": 200,
        "min": 0,
        "order": 210,
        "text": "Vertical Growth Offset",
        "type": "slider",
        "value": 0
    },
    
    "visual_horizontalsplit": {
        "condition": "visual_enable.value",
        "order": 220,
        "text": "Horizontal Split",
        "type": "bool",
        "value": false
    },
    "visual_horizontalsplitalpha": {
        "condition": "visual_enable.value && visual_horizontalsplit.value",
        "editable": false,
        "max": 100,
        "min": 0,
        "order": 230,
        "text": "Split Opacity (%)",
        "type": "slider",
        "value": 50
    },  
    
    
    "visual_circlemode": {
        "condition": "visual_enable.value",
        "options": [
            {
                "label": "Normal",
                "value": 0
            },
            {
                "label": "Circle",
                "value": 1
            }
        ],
        "order": 270,
        "text": "Visual Mode",
        "type": "combo",
        "value": 1
    },
    "visual_type": {
        "condition": "visual_enable.value",
        "options": [
            {
                "label": "Bars",
                "value": 0
            },
            {
                "label": "Spline",
                "value": 1
            }
        ],
        "order": 271,
        "text": "Draw type",
        "type": "combo",
        "value": 0
    },
    
    "visual_circlesize": {
        "condition": "visual_circlemode.value == 1 && visual_enable.value",
        "editable": true,
        "max": 700,
        "min": 0,
        "order": 280,
        "text": "Circle Size",
        "type": "slider",
        "value": 200
    },
    "visual_circle_arc": {
        "condition": "visual_circlemode.value == 1 && visual_enable.value",
        "editable": true,
        "min": 0,
        "max": 360,
        "order": 281,
        "text": "Arc degrees",
        "type": "slider",
        "value": 360
    },     
    
    "visual_enablerotation": {
        "condition": "visual_enable.value",
        "order": 290,
        "text": "Enable Rotation",
        "type": "bool",
        "value": true
    },      
    "visual_rotationccw": {
        "condition": "visual_enable.value && visual_enablerotation.value",
        "order": 295,
        "text": "Rotate Counter-Clockwise",
        "type": "bool",
        "value": false
    },
    "visual_rotationspeed": {
        "condition": "visual_enable.value && visual_enablerotation.value",
        "editable": true,
        "max": 60,
        "min": 10,
        "order": 300,
        "text": "Rotation Speed (s)",
        "type": "slider",
        "value": 30
    },
    
    
    "visual_enableborder": {
        "condition": "visual_enable.value && false",
        "order": 310,
        "text": "Enable Border",
        "type": "bool",
        "value": false
    },
    "visual_borderalpha": {
        "condition": "visual_enableborder.value && visual_enable.value",
        "max": 100,
        "min": 0,
        "order": 330,
        "text": "Border Alpha",
        "type": "slider",
        "value": 100
    },
    "visual_bordercolor": {
        "condition": "visual_enableborder.value && visual_enable.value",
        "order": 340,
        "text": "Border Color",
        "type": "color",
        "value": "#aaaaaa"
    },
    "visual_borderwidth": {
        "condition": "visual_enableborder.value && visual_enable.value",
        "editable": true,
        "max": 10,
        "min": 1,
        "order": 320,
        "text": "Border Width",
        "type": "slider",
        "value": 5
    },
    
    "visual_capstype": {
        "condition": "visual_enable.value",
        "options": [
            {
                "label": "None",
                "value": 0
            },
            {
                "label": "Round",
                "value": 1
            },
            {
                "label": "Edge",
                "value": 2
            }
        ],
        "order": 350,
        "text": "Bar Cap Type",
        "type": "combo",
        "value": 1
    },
    
    "visual_spline_layers": {
        "condition": "visual_enable.value && visual_type.value == 1",
        "order": 272,
        "options": [
            {
                "label": "1",
                "value": 1
            },
            {
                "label": "2",
                "value": 2
            },
            {
                "label": "3",
                "value": 3
            },
            {
                "label": "4",
                "value": 4
            },
            {
                "label": "5",
                "value": 5
            }
        ],
        "text": "# Layers",
        "type": "combo",
        "value": 1
    },
    "visual_spline_empty_endpoints": {
        "condition": "visual_enable.value && visual_type.value == 1",
        "order": 273,
        "text": "Add endpoints",
        "type": "bool",
        "value": false
    },
    "visual_spline_fill_alpha": {
        "condition": "visual_enable.value && visual_type.value == 1",
        "order": 274,
        "max": 100,
        "min": 0,
        "text": "Alpha",
        "type": "slider",
        "value": 0
    }
};