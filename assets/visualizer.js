'use strict';

const Visuals = {    
    defaultProps: {
        zIndex: 0,
        
        visual_enable: true,
        
        bounceStrength: 100,
        bassShakeStrength: 100,
        bassShakeEnabled: false,
        bounceOnBeatEnabled: false,
        
        visual_offset_x: 0,
        visual_offset_y: 0,
        visual_type: "bar",
        visual_numberbars: 64,
        visual_channel: "STEREO",
        visual_channel_option: 0,
        visual_channel_mirror: false,
        visual_rotatecolor: false,
        visual_barwidth: 5,
        visual_bargap: 15,
        visual_strength: 100,
        visual_color: "",
        visual_alpha: 100,
        visual_verticalposition: 0,
        visual_horizontalposition: 0,
        visual_rotation: 0,
        visual_heightlimit: 0,
        visual_verticalgrowthoffset: 0,
        visual_horizontalsplit: false,
        visual_horizontalsplitalpha: 50,
        visual_rotatecolor: false,
        visual_rotatecolorspeed: 1,
        visual_rotatecolorl2r: false,
        
        visual_circlemode: 0,
        visual_circlesize: 200,
        visual_circle_arc: 360,
        
        visual_enablerotation: false,
        visual_rotationccw: false,
        visual_rotationspeed: 30,
        
        visual_enableborder: false,
        visual_borderwidth: 1,
        visual_borderalpha: 50,
        visual_bordercolor: "",
        
        visual_capstype: 0,
        
        visual_reverserainbow: false,
        visual_hideinactive: false,
        visual_hideinactivetimeout: 1,
        visual_hideinactivefadeduration: 2,
        
        visual_type: 0,
        visual_spline_layers: 2,
        visual_spline_empty_endpoints: false,
        visual_spline_fill_alpha: 70
    },
    
    vis_count: 3,    
    
    visualizers: [],
    
    visualizer: false,

    init: function() {
        VisualsManager.addVisuals({
            optionpath: "visualizers", 
            name: "Audio Visualizer",
            onUpdate: Visuals.updateAll,
            nameattr: "visual_name"
        });     
        /*for (var i = 0; i < Visuals.vis_count; i++) {
            Visuals.visualizers[i] = {
                visualizer: false,
                properties: Visuals.defaultProps
            };
        }*/       
        
        Visuals.updateAll();
    },
    
    update: function(id, forceSecondUpdate) {
        forceSecondUpdate = typeof forceSecondUpdate == "undefined" ? false : forceSecondUpdate;
        var vis = Settings.get("visualizers." + id, false);
        if (!vis) {
            if (Visuals.visualizers[id] && Visuals.visualizers[id].visualizer) {
                Visuals.visualizers[id].visualizer = false;
                VisualsManager.visualizer.removeVisual(id);
            }
            return;
        }
        if (!Visuals.visualizers[id]) {
            Visuals.visualizers[id] = {};
        }
        
        Visuals.visualizers[id].properties = vis.properties;
        
        console.log("Updating " + id);
        
        
        if (Visuals.visualizers[id].properties.visual_enable) {
            if (!Visuals.visualizers[id].visualizer) {
                console.log("Adding Audio Visualizer");
                Visuals.visualizers[id].visualizer = new visualisations.bar.rainbow(id);
                VisualsManager.visualizer.addVisual(Visuals.visualizers[id].visualizer);
                // Initial Settings have to be applied twice (wrong order)...
                forceSecondUpdate = true;
            }
            var v = Visuals.visualizers[id].visualizer;
            var p = Visuals.visualizers[id].properties;
            
            v.setPrecision(p.visual_numberbars);
            v.enableRotateColours(p.visual_rotatecolor);
            v.settings.strengthMultiplier = p.visual_strength;
            v.settings.barWidth = p.visual_barwidth;
            v.settings.barGap = p.visual_bargap;
            v.settings.channel = p.visual_channel;
            v.settings.channel_render = p.visual_channel_option;
            v.settings.channel_reverse = p.visual_channel_mirror;
            if (p.visual_color !== "" && p.visual_enablecolor) {
                v.settings.color = getColorRGBString(p.visual_color);
            }
            if (!p.visual_enablecolor) {
                v.settings.color = null;
            }
            
            v.settings.alpha = p.visual_alpha / 100;
            v.settings.barsVerticalPosition = p.visual_verticalposition;
            v.settings.barsHorizontalPosition = p.visual_horizontalposition;
            
            v.settings.rotation = p.visual_rotation;
            
            v.settings.heightLimit = p.visual_heightlimit;
            v.settings.verticalGrowthOffset = p.visual_verticalgrowthoffset;
            
            v.settings.enableSplit = p.visual_horizontalsplit;
            v.settings.splitAlpha = p.visual_horizontalsplitalpha / 100 ;
            
            v.settings.rotateColoursDuration = p.visual_rotatecolorspeed * 1000;
            v.settings.rotateColoursL2R = p.visual_rotatecolorl2r;
            
            v.settings.circleMode = p.visual_circlemode;
            v.settings.circleSize = p.visual_circlesize;
            v.settings.arc_degrees = p.visual_circle_arc;
            
            v.enableRotation(p.visual_enablerotation, p.visual_rotationccw);
            v.settings.rotationDuration = p.visual_rotationspeed * 1000;
            
            v.settings.enableBorder = p.visual_enableborder;
            v.settings.borderWidth = p.visual_borderwidth;
            v.settings.borderAlpha= p.visual_borderalpha / 100;
            if (p.visual_bordercolor !== "") {
                v.settings.borderColor = getColorRGBString(p.visual_bordercolor);
            }
            
            v.settings.lineCapsType = p.visual_capstype;
            v.settings.reverseRainbow = p.visual_reverserainbow;
            
            v.settings.hideNoSound = p.visual_hideinactive;
            v.settings.hideNoSoundDelay = p.visual_hideinactivetimeout * 1000;
            v.settings.hideNoSoundFadeDuration = p.visual_hideinactivefadeduration * 1000;
            
            v.settings.drawMode = p.visual_type == 1 ? "spline": "bar";
            v.settings.spline_layers = p.visual_spline_layers;
            v.settings.spline_empty_endpoints = p.visual_spline_empty_endpoints;
            v.settings.spline_fill_alpha = p.visual_spline_fill_alpha;
            
            v.settings.bassShakeEnabled = p.bassShakeEnabled;
            v.settings.bounceOnBeatEnabled = p.bounceOnBeatEnabled;
            v.settings.bounceStrength = p.bounceStrength;
            v.settings.bassShakeStrength = p.bassShakeStrength;
            
            v.settings.zIndex = p.zIndex;
        } else {
            console.log("Disabled " + id);
            if (Visuals.visualizers[id].visualizer) {                
                console.log("Removing Visualizer " + id);
                Visuals.visualizers[id].visualizer = false;
                VisualsManager.visualizer.removeVisual(id);
            }
        }
        
        if (forceSecondUpdate) {
            Visuals.update(id);
        }
    },
    
    updateAll: function() {
        var visualizers = Settings.get("visualizers", {});
        for (var v in visualizers) {
            Visuals.update(v);
        }
    }
}