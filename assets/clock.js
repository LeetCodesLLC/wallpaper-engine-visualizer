const Clock = {
    defaultProps: {
        zIndex: 0,
        bounceStrength: 100,
        bassShakeStrength: 100,
        bassShakeEnabled: false,
        bounceOnBeatEnabled: false,
        clock_enable: true,
        clock_size_time: 20,
        clock_font_time: "segoe ui",
        clock_color_time: "#808080",
        clock_size_date: 18,
        clock_font_date: "segoe ui",
        clock_color_date: "#808080",
        clock_spacing: 10,
        clock_offset_x: 0,
        clock_offset_y: 0,
        clock_anchor: "center", // Or: "top left"
        clock_screen_anchor: "center", // Or: "top left",
        clock_time_format: "LT", // Localized Time
        clock_date_format: "LL",  // Localized Date,
        clock_time_format_custom: "HH:mm", // When clock_time_format == custom
        clock_date_format_custom: "dd.mm.YYYY" // When clock_date_format == custom
    },
    
    clocks: {},
    
    settingsChanged: function() {        
        var clocks = Settings.get("clocks", {});
        for (var c in clocks) {
            if (c in Clock.clocks) {
                Clock.clocks[c].properties = clocks[c].properties;
            } else {
                Clock.clocks[c] = clocks[c];
            }
        }
        
        Clock.update();
                        
        $(".clock").each(function() {
            var id = $(this).attr("id");
            if (!(id in Clock.clocks)) {
                $(this).remove();
            }
        });
    },
    
    update: function() {
        for (var id in Clock.clocks) {
            var c = Clock.clocks[id];
            var p = c.properties;            
            
            if (p.clock_enable) {
                if (!Clock.clocks[id].visualizer) {
                    console.log("Adding Clock Visual");
                    Clock.clocks[id].visualizer = new kvisual.clock(id, p);
                    VisualsManager.visualizer.addVisual(Clock.clocks[id].visualizer);
                    // Initial Settings have to be applied twice (wrong order)...
                    forceSecondUpdate = true;
                }
                
                Clock.clocks[id].visualizer.settings = p;
                Clock.clocks[id].visualizer.settings.enabled = p.clock_enable;
            } else {                
                console.log("Disabled " + id);
                if (Clock.clocks[id].visualizer) {                
                    console.log("Removing Clock " + id);
                    VisualsManager.visualizer.removeVisual(id);
                    Clock.clocks[id].visualizer = false;
                }
            }
        }
    },
    
    start: function() {
        Clock.settingsChanged();
        VisualsManager.addVisuals({
            optionpath: "clocks", 
            name: "Clock",
            onUpdate: Clock.updateAll,
            nameattr: "clock_name"
        });
    },
    
    updateAll: function() {
        Clock.settingsChanged();
        Clock.update();
    }
};