;

var kvisual = (function($, createjs, document, kvisual, undefined) {
    console.log(kvisual);
    /**
     * KVisual Clock
     * 
     * @param {any} id 
     * @param {any} settings 
     * @returns 
     */
    kvisual.clock = function(id, settings) { 
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
            
            var tf = p.clock_time_format == "custom" ? p.clock_time_format_custom : p.clock_time_format;
            var df = p.clock_date_format == "custom" ? p.clock_date_format_custom : p.clock_date_format;
            var p = scope.settings;
            
            scope.gameObject.removeAllChildren();  
            var draw_container = new createjs.Container();
            
            var timeText = new createjs.Text(moment().format(tf), p.clock_size_time + "px " + p.clock_font_time, getColorString(p.clock_color_time));
            var dateText = new createjs.Text(moment().format(df), p.clock_size_date + "px " + p.clock_font_date, getColorString(p.clock_color_date));
            
            draw_container.addChild(timeText);
            draw_container.addChild(dateText);
            
            var tw = timeText.getBounds().width;
            var th = timeText.getBounds().height;
            
            var dw = dateText.getBounds().width;
            var dh = dateText.getBounds().height;
            
            var height = th + dh + p.clock_spacing;
            
                                    
            var ty = -(height / 2);
            var tx = -(tw / 2);
            
            var dy = ty + th + p.clock_spacing;
            var dx = -(dw / 2);
            
            timeText.x = tx;
            timeText.y = ty;
            dateText.x = dx;
            dateText.y = dy;
            
            var w = draw_container.getBounds().width;
            var h = draw_container.getBounds().height;
            
            var x = -(w / 2);
            var y = -(h / 2);
            
            scope.gameObject.x = (p.clock_offset_x / 200) * scope.canvas.width + (scope.canvas.width * 0.5);
            scope.gameObject.y = (p.clock_offset_y / 200) * scope.canvas.height + (scope.canvas.height / 2);
            
            scope.gameObject.addChild(draw_container);
        }

        _this.init();

        return scope;
    };
    
    return kvisual;
 
}( jQuery, createjs, document, kvisual || {} ));