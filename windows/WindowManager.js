'use strict';

var WindowManager = {
    open: function(id, properties) {        
        id = "window-" + id;
        if (!WindowManager.windows[id]) {
            /*
            JSPanel Settings
            var defaults = {
                onclosed: function() {},
                callback: function() {},
                headerControls: "closeonly",                
                headerTitle: "Untitled Window",
                position: "center center",
                contentSize: "811px 600px",
                resizeit: false
            };            */
            
            var defaults = {
                height: 600,
                width: 811,
                resizable: false,
                title: "Untitled Window",
                content: "",
                close: function(event, ui) {
                    var id = $(event.target).attr("id");
                    $(event.target).dialog("destroy");
                    $(event.target).find(".tooltipped").tooltip("destroy");
                    $(event.target).remove();
                    WindowManager.windows[id] = null;
                    delete(WindowManager.windows[id]);
                    event = null;
                }
            }
            
            var winid = id;
            if ("headerTitle" in properties) {
                properties["title"] = properties["headerTitle"];
            }
            
            var props = $.extend({}, defaults, properties);
            /*var originalProps = $.extend({}, props);
            props.callback = function() {
                $('.tooltipped').tooltip();
                originalProps.callback();
            };
            props.onclosed = function() {
                WindowManager.windows[id] = null;
                originalProps.onclosed();
            };*/
                        
            WindowManager.windows[id] = "#"+winid;
            $("body").append(`
                <div class="windowmanager" id="${winid}">
                    ${props.content}
                </div>
            `);
            $("#" + winid).dialog(props);
            $(".tooltipped").tooltip();
            
            return WindowManager.windows[id];
        } else {
            // WindowManager.windows[id].front();
            $(WindowManager.windows[id]).dialog("moveToTop");
            return WindowManager.windows[id];
        }
    },
    
    close: function(id) {    
        id = "window-" + id;
        if (WindowManager.windows[id]) {
            // Unbind all Event Handlers on Close
            $(WindowManager.windows[id]).dialog("close");
        }
    },
    
    get: function(id) {    
        id = "window-" + id;
        if (WindowManager.windows[id]) {
            return WindowManager.windows[id];
        }
        return false;
    },
    
    windows: {},
    
    showControlPanel: function() {
        var props = {
            headerTitle: "Control Panel",
            content: `
                <div class="btn-flat waves-effect menu-tile tooltipped" data-tooltip="General Settings" id="settings-menu">
                    <i class="material-icons">settings</i>
                </div> 
                <div class="btn-flat waves-effect menu-tile tooltipped" data-tooltip="Visual Layers" id="layers-menu">
                    <i class="material-icons">layers</i>
                </div>
                <div class="btn-flat waves-effect menu-tile tooltipped" data-tooltip="Clocks" id="clocks-menu">
                    <i class="material-icons">access_time</i>
                </div>                        
                <div class="btn-flat waves-effect menu-tile tooltipped" data-tooltip="Music Visualizers" id="visuals-menu">
                    <i class="material-icons">graphic_eq</i>
                </div>                      
                <div class="btn-flat waves-effect menu-tile tooltipped" data-tooltip="Particles" id="particles-menu">
                    <i class="material-icons">device_hub</i>
                </div>                       
                <div class="btn-flat waves-effect menu-tile tooltipped" data-tooltip="Music Players" id="musics-menu">
                    <i class="material-icons">music_note</i>
                </div>                     
                <div class="btn-flat waves-effect menu-tile tooltipped" data-tooltip="Spotify Integration" id="spotify-menu">
                    <img src="assets/img/spotify-icon.png" style="width: 70%; margin-top: 15%;"/>
                </div>               
                <div class="btn-flat waves-effect menu-tile tooltipped" data-tooltip="Storage Information" id="storage-menu">
                    <i class="material-icons">storage</i>
                </div>
                <div class="btn-flat waves-effect menu-tile tooltipped" data-tooltip="Configuration Export / Import" id="config-menu">
                    <i class="material-icons">import_export</i>
                </div>
                <div class="btn-flat waves-effect menu-tile tooltipped" data-tooltip="Credits" id="credits-menu">
                    <i class="material-icons">info_outline</i>
                </div>
                <div class="btn-flat waves-effect menu-tile tooltipped" data-tooltip="Refresh Wallpaper" id="restart-menu">
                    <i class="material-icons">refresh</i>
                </div>
                <br />
                <br />
                <div class="valign-wrapper">
                    <i class="material-icons large blue-text text-darken-2" style="display: inline-block; margin-right: 30px;">info</i>
                    <span>After changing settings, it is recommended to Refresh the Wallpaper to fix FPS issues.</span>
                </div>
             `
        };
        WindowManager.open("control-panel", props);
    }
};

$(function() {
    $("body").off("click", "#show-menu");
    $("body").on("click", "#show-menu", function() {
        WindowManager.showControlPanel();
    });
    
    $("body").off("click", "#restart-menu");
    $("body").on("click", "#restart-menu", function() {
        window.location.reload();
    });
});