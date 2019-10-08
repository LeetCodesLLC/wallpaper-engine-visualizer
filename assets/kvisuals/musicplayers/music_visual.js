;

var kvisual = (function($, createjs, document, kvisual, undefined) {
    /**
     * KVisual Music Player
     * 
     * @param {any} id 
     * @param {any} settings 
     * @returns 
     */
    kvisual.musicplayer = function(id, settings) { 
        // Declare a scope for Visualizer
        var scope = {};
        
        scope.id = id;
        scope.stage = null;
        scope.canvas = null;
        scope.parent = null;

        // Bind 'this'
        var _this = this;

        // Private variables for within the plugin only ( no user/ code interaction )
        _this.variables = {
            gameobject : null,
            analyser : null,
        }

        // The default values ( which can be overriden by supplied settings )
        var _DEFAULTS = {
            
        }

        scope.settings = $.extend(_DEFAULTS, settings);
        
        scope.gameObject = new createjs.Container();
        
        _this.init = function(){

            if(!createjs) { console.error("This visual requires CreateJS to operate!");}

            _this.bind();
        }

        _this.bind = function(){
        }

        scope.update = function(analyzer){
            _this.draw();
        }
        
        _this.draw = function() {
            var p = scope.settings;            
            
            scope.gameObject.removeAllChildren();
            
            var draw_container = new createjs.Container();
            
            switch (p.type) {
                case "spotify":
                    draw_container = _this.drawSpotify(p);
                    break;
                case "google":
                default:
                    draw_container = _this.drawUnsupported(p);
                    break;
            }
                                    
            scope.gameObject.x = (p.offset_x / 200) * scope.canvas.width + (scope.canvas.width * 0.5);
            scope.gameObject.y = (p.offset_y / 200) * scope.canvas.height + (scope.canvas.height / 2);
            
            //draw_container.x = -(draw_container.getBounds().width / 2);
            //draw_container.y = -(draw_container.getBounds().height / 2);
            
            scope.gameObject.addChild(draw_container);
        }
        
        _this.drawUnsupported = function(p) {
            var draw_container = new createjs.Container();
            var supportText = new createjs.Text("Unsupported Player type", "30px Arial", "#aaa");
            var typeText = new createjs.Text("Player Type " + p.type + " is not supported right now", "20px Arial", "#aaa");
            supportText.x = -supportText.getBounds().width / 2;
            typeText.x = -typeText.getBounds().width / 2;
            typeText.y = supportText.getBounds().height + 10;
            
            draw_container.addChild(supportText);
            draw_container.addChild(typeText);
            return draw_container;
        }        
        
        _this.drawSpotify = function(p) {
            //return _this.drawUnsupported(p);
            var draw_container = new createjs.Container();
            var bg = new createjs.Shape();
            bg.graphics.setStrokeStyle(1);
            bg.graphics.beginStroke("#1DB954"); // Spotify Color
            bg.graphics.beginFill("rgba(83,83,83,0.7)"); // Spotify Grey, 50% opacity
            bg.graphics.drawRoundRect(0,0, 400, 300, 10);
            bg.setBounds(0,0,400,300);
            bg.x = -200;
            bg.y = -150;
            
            draw_container.addChild(bg);
            
            if (KSpotify.authenticated) {
                var isplaying = KSpotify.state == null ? false : KSpotify.state.is_playing;
                
                var play_button = _this.cachedContainer("play_button", isplaying);                    
                if (!play_button.cached) {                                        
                    play_button.addEventListener("click", KSpotify.playPause);
                    
                    circ = new createjs.Shape();
                    circ.graphics.setStrokeStyle(1);
                    circ.graphics.beginStroke("rgba(83,83,83,0.8)");
                    circ.graphics.beginFill("rgba(83,83,83,0.8)");
                    circ.graphics.drawCircle(0,0,30);
                
                    if (isplaying) {
                        circ.graphics.beginStroke("#fff");
                        circ.graphics.beginFill("#fff");
                        circ.graphics.drawRect(-12, -15, 8, 30);
                        circ.graphics.drawRect(4, -15, 8, 30);
                    } else {
                        circ.graphics.beginStroke("#fff");
                        circ.graphics.beginFill("#fff");
                        circ.graphics.drawPolygon(0,0,-10, -15, 15, 0, -10, 15);
                    }
                    
                
                    play_button.addChild(circ);
                }
                play_button.x = 90;
                play_button.y = -50;
                    
                var next_button = _this.cachedContainer("next_button", true);
                var prev_button = _this.cachedContainer("prev_button", true);
                
                if (!next_button.cached) { 
                    circ = new createjs.Shape();
                    circ.graphics.setStrokeStyle(1);
                    circ.graphics.beginStroke("rgba(83,83,83,0.8)");
                    circ.graphics.beginFill("rgba(83,83,83,0.8)");
                    circ.graphics.drawCircle(0,0,20);
                    
                    circ.graphics.beginStroke("#fff");
                    circ.graphics.beginFill("#fff");
                    circ.graphics.drawRect(5, -10, 3, 20);
                    circ.graphics.drawPolygon(0,0, 5,0, -7, 10, -7, -10);
                    
                    next_button.addChild(circ);
                    
                    next_button.addEventListener("click", KSpotify.next);
                }
                    
                next_button.y = -50;
                next_button.x = 150;
                
                if (!prev_button.cached) { 
                    circ = new createjs.Shape();
                    circ.graphics.setStrokeStyle(1);
                    circ.graphics.beginStroke("rgba(83,83,83,0.8)");
                    circ.graphics.beginFill("rgba(83,83,83,0.8)");
                    circ.graphics.drawCircle(0,0,20);
                    
                    circ.graphics.beginStroke("#fff");
                    circ.graphics.beginFill("#fff");
                    circ.graphics.drawRect(-8, -10, 3, 20);
                    circ.graphics.drawPolygon(0,0, -5,0, 7, 10, 7, -10);                        
                    
                    prev_button.addChild(circ);
                    
                    prev_button.addEventListener("click", KSpotify.prev);
                }
                    
                prev_button.y = -50;
                prev_button.x = 30;
                
                if (KSpotify.state != null && KSpotify.state != "" && KSpotify.state.item != null) {
                    var track = KSpotify.state.item;
                    var artists = [];
                    for (var k in track.artists) {
                        artists.push(track.artists[k].name);
                    }
                                        
                    if (artists.length == 0) {
                        artists.push("Unknown Artist");
                    }
                    
                    var title = _this.scrollingText("trackname", 360, track.name, "20px Arial", "#fff");
                    var album = _this.scrollingText("albumname", 360, track.album.name, "12px Arial", "#fff");
                    var artist = _this.scrollingText("artistsnames", 360, artists.join(", "), "12px Arial", "#fff");
                    
                    draw_container.addChild(title);
                    draw_container.addChild(album);
                    draw_container.addChild(artist);                    
                    
                    title.y = 50;
                    album.y = title.y + 5 + title.getBounds().height;
                    artist.y = album.y + 5 + album.getBounds().height;
                    
                    title.x -= 180;
                    album.x -= 180;
                    artist.x -= 180;
                    
                    if (title.mask != null) {
                        title.mask.x -= 180;
                        title.mask.y = title.y;
                    }
                    if (album.mask != null) {
                        album.mask.x -= 180;
                        album.mask.y = album.y;
                    }
                    if (artist.mask != null) {
                        artist.mask.x -= 180;
                        artist.mask.y = artist.y;
                    }

                    
                    var imgs = track.album.images;
                    var iurl = "assets/img/defaultalbum";
                    var desiredWidth = 300;
                    for (var i of imgs) {
                        if (i.width >= desiredWidth) {
                            iurl = i.url;
                        }
                    }
                    
                    var bitmap = _this.cachedBitmap("album_cover", 150, 150, iurl);
                    bitmap.x = -180;
                    bitmap.y = -130;
                    draw_container.addChild(bitmap);
                    
                    
                    var msoffset =  (KSpotify.state.is_playing ? (Date.now() - KSpotify.lastUpdate) : 0);
                    
                    var l = track.duration_ms;
                    var d = KSpotify.state.progress_ms + msoffset;
                    var total = _this.formatDuration(moment.duration(l));
                    var progress = _this.formatDuration(moment.duration(d));
                    
                    var textProgress = new createjs.Text(progress, "12px Arial", "#aaa");
                    var textTotal = new createjs.Text(total, "12px Arial", "#aaa");
                    textProgress.x = -180;
                    textProgress.y = artist.y + artist.getBounds().height + 5;
                    textTotal.y = textProgress.y;
                    textTotal.x = 180 - textTotal.getBounds().width;
                    
                    
                    var progressContainer = _this.cachedContainer("progressBar", true);
                    if (!progressContainer.cached) {
                        progressContainer.addEventListener("click", function(e) {
                            var pt = progressContainer.globalToLocal(e.stageX, e.stageY);
                            var perc = pt.x / 360;
                            var seekPos = perc * KSpotify.state.item.duration_ms;
                            if (!seekPos) {
                                seekPos = 0;
                            }
                            KSpotify.seek(seekPos);
                        });
                        
                    
                        var progressBar = new createjs.Shape();
                        
                        progressContainer.progressBar = progressBar;
                        
                        progressContainer.addChild(progressBar);
                    
                        progressContainer.x = -180;
                        progressContainer.y = textTotal.y + textTotal.getBounds().height + 5;
                    }                    

                    progressContainer.progressBar.graphics.clear();
                    progressContainer.progressBar.graphics.beginFill("rgba(83,83,83,0.8)");
                    progressContainer.progressBar.graphics.drawRoundRect(0,0,360,4,2);
                    
                    progressPerc = 0;
                    if (l > 0) {
                        progressPerc = d / l;
                    }
                    
                    progressContainer.progressBar.graphics.beginFill("#fff");
                    progressContainer.progressBar.graphics.drawRoundRect(0,0,360 * progressPerc, 4, 2);                    
                    
                    draw_container.addChild(textProgress);
                    draw_container.addChild(textTotal);
                    draw_container.addChild(progressContainer);
                    
                    
                    
                    draw_container.addChild(play_button);
                    draw_container.addChild(next_button);
                    draw_container.addChild(prev_button);
                    
                    var device = KSpotify.getActiveDevice();
                    if (device) {
                        var deviceName = new createjs.Text(device.name, "15px Arial", "#1DB954");
                        deviceName.y = play_button.y + 50;
                        deviceName.x = play_button.x - (deviceName.getBounds().width / 2);
                        draw_container.addChild(deviceName);
                    }
                    
                } else {
                    var textA = new createjs.Text("Not Playing", "30px Arial", "#aaa");
                    var textB = new createjs.Text("No current Playback. Start Playback.", "15px Arial", "#aaa");
                    var h = 10 + textA.getBounds().height + textB.getBounds().height;
                    textA.x = -textA.getBounds().width / 2;
                    textA.y = (-h / 2) - 50;
                    textB.y = textA.y + textA.getBounds().height + 10;
                    textB.x = -textB.getBounds().width / 2;
                    draw_container.addChild(textA);
                    draw_container.addChild(textB);
                    
                    play_button.x = 0;
                    play_button.y = 50;
                    prev_button.x = -60;
                    prev_button.y = 50;
                    next_button.x = 60;
                    next_button.y = 50;
                    
                    var device = KSpotify.getActiveDevice();
                    
                    if (device) {                    
                        draw_container.addChild(play_button);
                        draw_container.addChild(next_button);
                        draw_container.addChild(prev_button);
                        
                        var deviceName = new createjs.Text(device.name, "20px Arial", "#1DB954");
                        deviceName.y = play_button.y + 50;
                        deviceName.x = - (deviceName.getBounds().width / 2);
                        draw_container.addChild(deviceName);
                    } else {
                        var deviceName = new createjs.Text("No available Devices", "20px Arial", "#888");
                        deviceName.y = textB.y + textB.getBounds().height + 10;
                        deviceName.x = - (deviceName.getBounds().width / 2);
                        draw_container.addChild(deviceName);
                    }
                }
            } else {
                var textA = new createjs.Text("Not logged in to Spotify", "30px Arial", "#aaa");
                var textB = new createjs.Text("Open the Control Panel and Login to Spotify", "15px Arial", "#aaa");
                var h = 10 + textA.getBounds().height + textB.getBounds().height;
                textA.x = -textA.getBounds().width / 2;
                textA.y = -h / 2;
                textB.y = textA.y + textA.getBounds().height + 10;
                textB.x = -textB.getBounds().width / 2;
                draw_container.addChild(textA);
                draw_container.addChild(textB);
            }
            
            
            
            return draw_container;            
        }
        
        _this.formatDuration = function(duration) {            
            var ret = "";
            if (duration.hours() > 0) {
                return moment.utc(duration.asMilliseconds()).format("HH:mm:ss");
            }
            return moment.utc(duration.asMilliseconds()).format("mm:ss");
        }
        
        _this.options = {};
        
        _this.cachedContainer = function(id, reloadvar) {
            new createjs.Container();
            if (!("container" in _this.options)) {
                _this.options.container = {};
            }
            
            if (!(id in _this.options.container)) {
                _this.options.container[id] = {
                    id: id,
                    reloadvar: reloadvar,
                    container: null
                };
            }
            
            var c = _this.options.container[id];
            
            if (c.container == null || c.reloadvar != reloadvar) {
                c.container = new createjs.Container();
                c.reloadvar = reloadvar;
                _this.options.container[id] = c;
                c.container.cached = false;
            } else {
                c.container.cached = true;
            }
            
            return c.container;
        }
        
        _this.cachedBitmap = function(id, width, height, url) {
            if (!("bitmap" in _this.options)) {
                _this.options.bitmap = {};
            }
            
            if (!(id in _this.options.bitmap)) {
                _this.options.bitmap[id] = {
                    id: id,
                    url: url,
                    width: width,
                    height: height,
                    bitmap: null,
                    img: null,
                    imgLoaded: false,
                    imgJustLoaded: false
                };
            }
            
            var b = _this.options.bitmap[id];
            if (!b.bitmap || url != b.url) {
                // New Bitmap
                b.img = null;
                b.img = new Image();
                b.img.onload = function() {
                    _this.options.bitmap[id].imgLoaded = true;
                    _this.options.bitmap[id].imgJustLoaded = true;
                };
                b.img.src = url;
                b.imgJustLoaded = false;
                b.imgLoaded = false;
                b.url = url;
                
                b.bitmap = new createjs.Bitmap(b.img);
                
                return b.bitmap;
            } else if (b.imgJustLoaded) {
                b.imgJustLoaded = false;
                
                var scale = width / b.bitmap.image.width;
                b.bitmap.scaleX = scale;
                b.bitmap.scaleY = b.bitmap.scaleX;
                
                _this.options.bitmap[id] = b;
                return b.bitmap;
            } else {
                // Reuse Bitmap
                return b.bitmap;
            }
        }
        
        _this.scrollingText = function(id, width, text, font, color) {
            if (!("scrolltext" in _this.options)) {
                _this.options.scrolltext = {};
            }
            
            const overscroll = 100;
            const moveMultiplier = 0.05;
            
            if (!(id in _this.options.scrolltext)) {
                _this.options.scrolltext[id] = {
                    id: id,
                    width: width,
                    text: false,
                    offset: -overscroll,
                    font: font,
                    color: color,
                    lastUpdate: 0
                };
            }
            
            var e = _this.options.scrolltext[id];
            
            if (e.text != text || e.font != font || e.width != width) {
                e.offset = -overscroll;
                e.text = text;
                e.font = font;
                e.width = width;
            } else {
                e.offset += (Date.now() - e.lastUpdate) * moveMultiplier;
            }
            
            var t = new createjs.Text(text, font, color);
            
            // Reset Offset?
            if (e.offset > t.getBounds().width - width + overscroll) {
                e.offset = -overscroll;
            }
            
            if (width > t.getBounds().width) {
                return t;
            }
            
            // Adjust mask offset (X) to be in the display range
            var maskX = e.offset;
            maskX = maskX < 0 ? 0 : (maskX > t.getBounds().width - width ? t.getBounds().width - width : maskX);
            
            
            var b = t.getBounds();
            t.mask = new createjs.Shape(new createjs.Graphics().dr(0, 0, width, t.getBounds().height + 10));            
            t.x = -maskX;      
            //t.setBounds(0,0,width,t.getBounds().height);
            
            
            e.lastUpdate = Date.now();
            
            _this.options.scrolltext[id] = e;            
            
            return t;
        }

        _this.init();

        return scope;
    };
    
    return kvisual;
 
}( jQuery, createjs, document, kvisual || {} ));