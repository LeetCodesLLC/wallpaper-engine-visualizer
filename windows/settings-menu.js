$(function() {
    $("body").off("click", "#settings-menu");
    $("body").off("click", "#settings-menu-back");
    $("body").on("click", "#settings-menu", function() {
        var props = {
            headerTitle: "General Settings",
            content: `
                <div style="padding: 5px;">
                    <div class="btn-flat waves-effect waves-red" id="settings-menu-back">
                        <i class="material-icons">chevron_left</i>
                    </div>
                    <br />
                    <p>
                        Change settings that affect different modules of this Wallpaper.
                    </p>
                    <div id="settings-dynamic">
                        <div id="settings-settings">
                            
                        </div>
                    </div>
                </div>
             `
        };
        WindowManager.open("settings-menu", props);
        WindowManager.close("control-panel");        
        SettingsMenu.updateSettings();
    });
    
    $("body").on("click", "#settings-menu-back", function() {        
        WindowManager.showControlPanel();
        WindowManager.close("settings-menu");    
    });
});

var SettingsMenu = {        
    updateSettings: function() {
        var win = WindowManager.get("settings-menu");        
        var c = Settings.get("settings", {});
        
                   
        var form = FormEditor.makeForm(SettingsForm, c);
        
        
        $(win).find("#settings-settings").html(`           
            <div id="settings-settings-panel">                    
                ${form}
            </div>
        `);
            
        FormEditor.setupHooks("#settings-settings-panel > form", function() {
            var s = FormEditor.toObject("#settings-settings-panel > form");
            
            Settings.set("settings", s);
            
            SettingsMenu.applySettings();            
        });
        FormEditor.applyConditions("#settings-settings-panel > form");
    },
    
    applySettings: function() {
        var s = Settings.get("settings", {});
        var b = Settings.get("background", "");
        
        if (s.locale) {
            moment.locale(s.locale);
        } else {                
            moment.locale("en");
        }
        
        if (b != "") {
            var imgPath = "file:///" + b;
            $("body").css({"background-image": "url('" + imgPath + "')"});            
        } else {
            $("body").css({"background-image": ""});
        }
        
        if ("fps" in s) {
            createjs.Ticker.setFPS(s.fps);
        }
        
        if ("showfps" in s && VisualsManager.performanceHelper) {            
            VisualsManager.performanceHelper.Enable(s.showfps);
        }
        
        if ("showparticles" in s && s.showparticles) {
            Particles.start();
        } else {
            Particles.stop();
        }
        
        VisualsManager.visualizer.settings.bounceOnBeatEnabled = s.bounceOnBeat;
        VisualsManager.visualizer.settings.effectsEnabled = s.effectsEnabled;
    }
};
