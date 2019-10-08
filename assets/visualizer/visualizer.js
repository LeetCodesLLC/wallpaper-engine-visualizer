;
(function($, createjs, document, undefined) {

    /**
     * jQuery module 'visualizer'.
     * Uses 'Visuals' to draw images on a canvas based on array of numbers ( sound data )
     * 
     * @param {any} settings 
     * @returns 
     */
    $.fn.visualizer = function(settings) {

        // Declare a scope for Visualizer
        var scope = {};

        // Bind 'this'
        var _this = this;

        // Private variables for within the plugin only ( no user/ code interaction )
        _this.variables = {
            container: null, // Container
            objects: {}, // Objects reference block
            cursorX: 0,
            cursorY: 0,
            visuals: [],
            idle: false,
        }

        // The default values
        var _DEFAULTS = {
            canvasId: "visualizer", // note : this must be an ID ( not a class! )

            targetFPS: 60, // Amount of frames per second -- lower this if you have issues with performance   
            enableFPSCounter: false,

            enableIdleState: false,
            idleTimeoutSeconds: 3,
            idleMovementSpeedMultiplier: 1,

            enablePinkNoiseCorrection: true,

            enabled: true,

            enableGlow: false,
            glowSize: 10,
            glowColor: "white"
        }

        scope.variables = _this.variables;

        scope.backgroundCanvas = null;
        scope.backgroundStage = null;

        scope.canvas = null;
        scope.stage = null;

        scope.settings = $.extend(_DEFAULTS, settings);

        /**
         * Init function. The constructor for the Visualizer. Will run some general checks, and setup the stages.
         * Creates the stage and is owner of all objects that should be added to draw onto the canvas.
         * 
         */
        _this.init = function() {

            if (!this[0].id) {
                console.error("The targeted canvas needs to have an id specified");
            }

            if (!createjs) {
                console.error("This plugin requires CreateJS to operate!");
            }

            scope.settings.canvasId = this[0].id;

            // The main stage for visuals            
            var stage = new createjs.Stage(scope.settings.canvasId);
            stage.snapToPixel = true;
            stage.snapToPixelEnabled = true;
            scope.stage = stage;
            scope.canvas = stage.canvas;
            //stage.enableMouseOver(0);
            
            stage.canvas.width = window.innerWidth;
            stage.canvas.height = window.innerHeight;

            // The game object of the visualizer itself ( FPS counter for example )            
            _this.variables.container = new createjs.Container();
            _this.variables.container.name = "Visualizer Core";
            stage.addChild(_this.variables.container);

            createjs.Ticker.addEventListener("tick", _this.update);
            createjs.Ticker.setFPS(scope.settings.targetFPS);
            // createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
            
            console.log("Init");

            _this.bind();

            _this.createFPS();
        }

        /**
         * Bind events
         * 
         */
        _this.bind = function() {
            document.addEventListener("mousemove", function(event) {
                _this.variables.cursorX = event.pageX || 1;
                _this.variables.cursorY = event.pageY || 1;
            });
        }

        /**
         * Private method to create an FPS counter on top of the screen.
         * 
         */
        _this.createFPS = function() {
            var container = new createjs.Container();
            container.name = "FPS Counter";

            var box_fps = new createjs.Shape();

            var txt_FPS_cur = new createjs.Text("--", "12px Verdana", "#000");
            txt_FPS_cur.textAlign = 'right';
            txt_FPS_cur.x = 40;
            txt_FPS_cur.y = 5;

            var txt_FPS_target = new createjs.Text("/ " + scope.settings.targetFPS + " FPS", "12px Verdana", "#222");
            txt_FPS_target.x = 45;
            txt_FPS_target.y = 10;

            container.addChild(box_fps, txt_FPS_cur, txt_FPS_target);

            container.x = scope.stage.canvas.width / 2;
            container.y = 25;
            container.regX = 55;
            container.regY = 15;

            // Create references for the draw method
            _this.variables.objects.FPS = {};
            _this.variables.objects.FPS.container = container;
            _this.variables.objects.FPS.box = box_fps;
            _this.variables.objects.FPS.current = txt_FPS_cur;
            _this.variables.objects.FPS.target = txt_FPS_target;
        }

        /**
         * Draws and updates the FPS counter accordingly ( does not create objects to improve performance )
         * Indicates : Green, Yellow, Red for performance.
         * 
         */
        _this.drawFPS = function() {

            if (!_this.variables.objects.FPS) {
                _this.createFPS();
            }

            // Get references to objects
            var container = _this.variables.objects.FPS.container;
            var box = _this.variables.objects.FPS.box;
            var current = _this.variables.objects.FPS.current;
            var target = _this.variables.objects.FPS.target;

            // Clear the graphics object from instructions
            box.graphics.clear();

            // Get variables            
            var fps = createjs.Ticker.getMeasuredFPS();
            var target_fps = scope.settings.targetFPS;

            // Caclulate the performance color ( green, orange, red )            
            if (fps >= target_fps * 0.95) {
                box.graphics.f("green").drawRoundRect(0, 0, 110, 30, 5); // When above or equal 95% FPS target, FPS is GREEN : yay!
            } else if (fps < target_fps * 0.95 && fps >= target_fps * 0.75) {
                box.graphics.f("orange").drawRoundRect(0, 0, 110, 30, 5); // When below 95% FPS target, FPS is ORANGE ( 57 / 60 || 137 / 144 )
            } else {
                box.graphics.f("red").drawRoundRect(0, 0, 110, 30, 5); // When below 75% FPS target, FPS is RED ( 45 / 60 || 108 / 144 )
            }

            // Set Text            
            current.text = fps.toFixed(1);
            target.text = "/ " + scope.settings.targetFPS + " FPS";

            // Add container to stage to drawing            
            scope.stage.addChild(container);
        }

        /**
         * Set the ticker to loop at the specified FPS ( Frames Per Second )
         * 
         * @param {any} fps 
         */
        scope.setFPS = function(fps) {
            scope.settings.targetFPS = fps;
            createjs.Ticker.setFPS(scope.settings.targetFPS);
        }

        /**
         * Enable or disable glow on the canvas of this visualizer ( targets all visuals included )
         * 
         * @param {any} enable 
         */
        scope.enableGlow = function(enable) {
            scope.settings.enableGlow = enable;
            if (enable) {
                scope.canvas.style.filter = "drop-shadow(0 0 " + scope.settings.glowSize + "px " + scope.settings.glowColor + ")";
            } else {
                scope.canvas.style.filter = null;
            }
        }

        /**
         * Add a new visual to the Visualizer
         * 
         * @param {any} visual 
         * @returns 
         */
        scope.addVisual = function(visual, background) {
            if (_this.variables.visuals[visual.id]) {
                console.error("This visual ID is already in use, please use an other one, or remove the existing one!");
                return;
            }

            _this.variables.visuals[visual.id] = visual;
            _this.variables.visuals.push(visual);

            visual.parent = scope;
            visual.stage = scope.stage;
            visual.canvas = scope.canvas;
        }

        /**
         * Remove a visual from the Visualizer by ID
         * 
         * @param {any} id 
         */
        scope.removeVisual = function(id) {
            delete _this.variables.visuals[id];

            $.each(_this.variables.visuals, function(i) {
                if (_this.variables.visuals[i].id === id) {
                    _this.variables.visuals.splice(i, 1);
                    return false;
                }
            });
        }

        /**
         * Private method to remove a GameObject from the hierarchy.
         * 
         * @param {any} obj 
         */
        _this.removeGameObject = function(obj) {
            obj.parent.removeChild(obj);
        }

        var generateFakeAudioDataInterval = null;

        /**
         * Start or stop generating fake audio data for the visualizer
         * 
         * @param {boolean} enable 
         */
        scope.generateFakeAudioData = function(enable) {
            if (enable) {
                generateFakeAudioDataInterval = setInterval(() => _this.generateFakeAudioData(), 50); //~ 20FPS
            } else {
                if (generateFakeAudioDataInterval) {
                    clearInterval(generateFakeAudioDataInterval);
                }
            }
        };

        /**
         * Generates an fake audio data array, similar to Wallpaper Engine's data set
         * 
         */
        _this.generateFakeAudioData = function() {
            var data = [];
            for (var x = 0; x < 128; x++) {
                data.push(Math.random() * 1.1);
            };

            scope.setAudioData(data);
        };

        var previousAudioData = [];
        var audioData = [];
        var fadedAudioData = [];

        var inactiveTimer = 0;
        var inactiveAudioData = [];

        /**
         * Recieve the Sound Data from an external source ( Wallpaper Engine in this case )
         * All data is 'Smoothed' from the previous set of data to the current, to be able
         * to draw at an higher frequency than the Audio Data is delivered.
         * Keeps track of Inactive timer.
         * 
         * @param {any} data 
         */
        scope.setAudioData = function(data) {

            // If pinknoise correction needs to be applied, do so
            if (scope.settings.enablePinkNoiseCorrection) {
                audioData = _this.correctAudioDataWithPinkNoiseResults(data);
            } else {
                audioData = data;
            }

            // Check if the audio data is below a certain value ( silent )
            if (audioData.average() < 0.01 && scope.settings.enableIdleState) {

                // If the visualizer is idle, generate sinus wave as audio data
                if (_this.variables.idle) {

                    inactiveAudioData = [];
                    for (var x = 0; x < 128; x++) {
                        inactiveAudioData.push(Math.sin(x / 5 + new Date().getTime() / 2000 * scope.settings.idleMovementSpeedMultiplier) + 1);
                    }
                    audioData = inactiveAudioData;

                    // TODO:: This is an ugly fix for a stupid problem :P
                    if (fadedAudioData.average() < 0.01) {
                        fadedAudioData = inactiveAudioData;
                    }

                    // Start the inactive timer if it wasn't started before
                } else if (!inactiveTimer) {
                    inactiveTimer = setTimeout(() => {
                        _this.variables.idle = true;
                    }, 1000 * scope.settings.idleTimeoutSeconds);
                }

                // Remove the inactive timer when sound is detected
            } else if (inactiveTimer) {
                clearTimeout(inactiveTimer);
                inactiveTimer = null;
            } else {
                _this.variables.idle = false;
            }

            // Tween the audio data from the last data set to the current
            if (previousAudioData.length == audioData.length) {
                createjs.Tween.get(fadedAudioData, {
                    override: true
                }).to(audioData, 75);
            } else {
                previousAudioData = audioData;
                fadedAudioData = audioData;
            }
        }

        // Pink Noise correction array 
        // All credit goes to 'Squee' :: http://steamcommunity.com/id/allgoodidsaretaken/
        var pinkNoise = [1.1760367470305, 0.85207379418243, 0.68842437227852, 0.63767902570829, 0.5452348949654, 0.50723325864167, 0.4677726234682, 0.44204182748767, 0.41956517802157, 0.41517375040002, 0.41312118577934, 0.40618363960446, 0.39913707474975, 0.38207008614508, 0.38329789106488, 0.37472136606245, 0.36586428412968, 0.37603017335105, 0.39762590761573, 0.39391828858591, 0.37930603769622, 0.39433365764563, 0.38511504613859, 0.39082579241834, 0.3811852720504, 0.40231453727161, 0.40244151133175, 0.39965366884521, 0.39761103827545, 0.51136400422212, 0.66151212038954, 0.66312205226679, 0.7416276690995, 0.74614971301133, 0.84797007577483, 0.8573583910469, 0.96382997811663, 0.99819377577185, 1.0628692615814, 1.1059083969751, 1.1819808497335, 1.257092297208, 1.3226521464753, 1.3735992532905, 1.4953223705889, 1.5310064942373, 1.6193923584808, 1.7094805527135, 1.7706604552218, 1.8491987941428, 1.9238418849406, 2.0141596921333, 2.0786429508827, 2.1575522518646, 2.2196355526005, 2.2660112509705, 2.320762171749, 2.3574848254513, 2.3986127976537, 2.4043566176474, 2.4280476777842, 2.3917477397336, 2.4032522546622, 2.3614180150678];

        /**
         * Correct the Audio Data with the pinkNoise correction array.
         * 
         * @param {any} data 
         * @returns 
         */
        _this.correctAudioDataWithPinkNoiseResults = function(data) {
            for (var i = 0; i < 64; i++) {
                data[i] /= pinkNoise[i];
                data[i + 64] /= pinkNoise[i];
            }
            return data;
        }

        /**
         * Update all visual states of the Visuals that have been added to this Visualizer
         * 
         * @param {any} data 
         */
        scope.updateVisuals = function(data) {
            // Magic starts here :D
            _this.variables.visuals.forEach(function(visual) {
                visual.update(data);

                // TODO: sort visuals by zIndex

                if (visual.gameObject) {
                    scope.stage.addChild(visual.gameObject);
                }
            });
        }

        /**
         * Checks for any active visuals
         * 
         * @returns 
         */
        _this.checkVisualsActive = function() {

            // If there are no visuals attached, return false;
            if (_this.variables.visuals.length < 1) {
                return false;
            }

            // Filter all active visuals from total list of visuals
            var activeVisuals = _this.variables.visuals.filter(function(visual) {
                return visual.settings.enabled;
            });

            // If there is at least one active visual, return true
            if (activeVisuals.length > 0) {
                return true;
            }

            // Default : return false
            return false;
        }

        /**
         * The update method fired by the Createjs.Ticker object.
         * The stage get cleared of any object, and is reconstructed by updating the Visuals.
         * 
         * @param {any} event 
         */
        _this.update = function(event) {

            // If Visualizer is disabled, don't update
            if (!scope.settings.enabled) {
                return;
            }

            // If no active visuals, don't update
            if (!_this.checkVisualsActive()) {
                return;
            }

            // Clear the stage            
            scope.stage.removeAllChildren();

            // clear local gameobject
            _this.variables.container.removeAllChildren();

            // Update visuals
            scope.updateVisuals(fadedAudioData);

            // If FPS enabled, add to top stage
            if (scope.settings.enableFPSCounter) {

                _this.drawFPS();
            }

            // Add the visualizer to the main stage            
            scope.stage.addChild(_this.variables.container);

            // Update the stage
            scope.stage.update();
        }

        /**
         * Enable or disable the visualizer
         * 
         * @param {any} enabled 
         */
        scope.Enable = function(enabled) {
            scope.settings.enabled = enabled;
        }

        _this.init();

        return scope;
    };

}(jQuery, createjs, document));

// Helper methods
Array.prototype.sum = Array.prototype.sum || function() {
    return this.reduce(function(sum, a) {
        return sum + Number(a)
    }, 0);
}

Array.prototype.take = Array.prototype.take || function(num) {
    return this.slice(0, num);
}

Array.prototype.average = Array.prototype.average || function() {
    return this.sum() / (this.length || 1);
}

Array.prototype.interpolate = Array.prototype.interpolate || function(newLength) {

    data = this;

    var linearInterpolate = function(before, after, atPoint) {
        return before + (after - before) * atPoint;
    };

    var newData = new Array();
    var springFactor = new Number((data.length - 1) / (newLength - 1));
    newData[0] = data[0]; // for new allocation
    for (var i = 1; i < newLength - 1; i++) {
        var tmp = i * springFactor;
        var before = new Number(Math.floor(tmp)).toFixed();
        var after = new Number(Math.ceil(tmp)).toFixed();
        var atPoint = tmp - before;
        newData[i] = linearInterpolate(data[before], data[after], atPoint);
    }
    newData[newLength - 1] = data[data.length - 1]; // for new allocation
    return newData;
};