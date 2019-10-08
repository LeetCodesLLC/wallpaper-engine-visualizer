var VisualsManager = {
    visualizer: false,
    
    performanceHelper: false,
    
    init: function() {
        $("body").append(`<canvas class="visualizer" id="visualizer"></canvas>`);
        VisualsManager.visualizer = $("#visualizer").visualizer();
        VisualsManager.visualizer.settings = {"enableIdleState":false,"enableIdleAnimation":false,"idleTimeoutSeconds":10,"idleMovementSpeedMultiplier":1,"idleAnimationStrengthMultiplier":1,"idleAnimationIgnoresEffects":false,"enablePinkNoiseCorrection":true,"enabled":true,"enableGlow":false,"glowSize":10,"glowColor":"white","effectsEnabled":false,"blurOnBeatEnabled":false,"blurOnBeatStrengthMultiplier":1,"hilightOnBeatEnabled":false,"hilightOnBeatStrengthMultiplier":1,"bounceOnBeatEnabled":false,"bounceOnBeatStrengthMultiplier":1,"bassShakeEnabled":false,"bassShakeStrengthMultiplier":1,"bassShakeInvert":false,"hueEnabled":false,"hueOffset":0,"hueRotationEnabled":false,"hueRotationDuration":10000,"hueShiftTemporaryEnabled":false,"hueShiftTemporaryStrengthMultiplier":1,"hueShiftPermanentEnabled":false,"hueShiftPermanentStrengthMultiplier":1,"hueShiftPermanentReset":false,"hueShiftPermanentResetTimeout":1000,"hueShiftPermanentResetDuration":5000,"hueShiftBassReset":false,"hueShiftBassResetTimeout":1000,"hueShiftBassResetDuration":5000,"enableEqualizer":false,"equalizerMultiplier1":1,"equalizerMultiplier2":1,"equalizerMultiplier3":1,"equalizerMultiplier4":1,"equalizerMultiplier5":1,"equalizerMultiplier6":1,"equalizerMultiplier7":1,"equalizerMultiplier8":1};
        VisualsManager.visualizer.settings.effectsEnabled = Settings.get("settings.effectsEnabled");
        VisualsManager.visualizer.settings.bounceOnBeat = Settings.get("settings.bounceOnBeatEnabled");
        
        // Performance Tracker
        VisualsManager.performanceHelper = new PerformanceHelper();
        VisualsManager.performanceHelper.addVisualizer(VisualsManager.visualizer);
        VisualsManager.performanceHelper.Enable(true);

        return;

        if (window.wallpaperRegisterAudioListener) {
            window.wallpaperRegisterAudioListener(function (data) {
                VisualsManager.visualizer.setAudioData(data);
            });
        } else {
            // When opened in a browser ( or if wallpaperRegisterAudioListener is not available, generate stub data )
            VisualsManager.visualizer.generateFakeAudioData(true);
        }
    },
    
    scopes: [],
    
    getSorted: function() {
        var visuals = [];
        VisualsManager.scopes.forEach(function(v, index, arr) {
            var scopedVisuals = Settings.get(v.optionpath, {});            
            for (var k in scopedVisuals) {
                visuals.push({
                    scope: v,
                    visual: scopedVisuals[k],
                    scopedId: k
                });
            }            
        });
        
        visuals = visuals.sort(function(a, b) {
            zIndexA = "zIndex" in a.visual.properties ? a.visual.properties.zIndex : 0;
            zIndexB = "zIndex" in b.visual.properties ? b.visual.properties.zIndex : 0;
            
            return zIndexA - zIndexB;
        });
        
        return visuals;
    },
    
    addVisuals: function(opts) {
        onUpdate = typeof onUpdate == "undefined" ? false : onUpdate;
        
        VisualsManager.scopes.push(opts);
    },
    
    saveOrder: function(visuals) {
        // Accepts Array of objects with {scope, scopedId} and saves it in the order of the Array
        visuals.forEach(function(v, i, arr) {
            var path = v.scope + "." + v.scopedId + ".properties.zIndex";
            Settings.set(path, i);
        });
        VisualsManager.scopes.forEach(function(v, index, arr) {
            if (typeof v.onUpdate == "function") {
                v.onUpdate();
            }
        });
    }
};