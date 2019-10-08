'use strict';

$(function() {
    $("body").off("click", "#visuals-menu");
    $("body").off("click", "#visuals-menu-back");
    $("body").off("click", "#visuals-add");
    $("body").off("click", "#visuals-delete");
    $("body").off("click", "#visuals-apply");
    $("body").on("click", "#visuals-menu", function() {
        var props = {
            headerTitle: "Music Visualizers",
            width: 350,
            height: 700,
            content: `
                <div style="padding: 5px;">
                    <div class="btn-flat waves-effect waves-red" id="visuals-menu-back">
                        <i class="material-icons">chevron_left</i>
                    </div>
                    <br />
                    <div id="visuals-dynamic">
                        <div id="visuals-list">
                            
                        </div>
                        <br />
                        <div class="right-align">
                            <div id="visuals-add" class="btn-floating red darken-4 waves-effect tooltipped" data-tooltip="Add Visualizer">
                                <i class="material-icons">add</i>
                            </div>
                        </div>
                        <br />
                        <br />
                        <div id="visuals-settings">
                            
                        </div>
                    </div>
                </div>
             `
        };
        WindowManager.open("visuals-menu", props);
        WindowManager.close("control-panel");        
        VisualsMenu.updateList();
    });
    
    $("body").on("click", "#visuals-menu-back", function() {        
        WindowManager.showControlPanel();
        WindowManager.close("visuals-menu");    
    });
    
    $("body").on("click", "#visuals-add", function() {        
        VisualsMenu.createVisual();
    });
    
    $("body").on("click", "#visuals-delete", function() {        
        VisualsMenu.removeVisual();
    });
    
    $("body").on("click", "#visuals-apply", function() {        
        VisualsMenu.updateList(VisualsMenu.selected);
    });
    
    $("body").on("change", "#visuals-select", function() {        
        VisualsMenu.updateSettings($(this).find("option:selected").val());
    });
});

var VisualsMenu = {
    selected: false,
    
    updateList: function(selectid) {
        var visualizers = Settings.get("visualizers", {});
        var win = WindowManager.get("visuals-menu");
        if (!win) {
            return;
        }
        
        var vis = [];
        
        for (var k in visualizers) {
            var name = k;
            var selected = "";
            var v = visualizers[k];
            if (v.properties.visual_name) {
                name = v.properties.visual_name;
            }
            if (selectid == k) {
                selected = "selected";
            }
            vis.push(`<option value="${k}" ${selected}>${name}</option>`);
        }        
        
        var title = "Choose a Visualizer to Edit";
        if (vis.length == 0) {
            title = "Create a Visualizer to Edit it here";
        }
        
        $(win).find("#visuals-list").html(`
            <div class="">
                <label>${title}</label>
                <select id="visuals-select">
                  <option value="" disabled>No Visualizer</option>
                  ${vis.join("")}
                </select>
            </div>
        `);
        $('select').formSelect();
        win = null;
        
        var selected = $("#visuals-select option:selected").val();
        VisualsMenu.updateSettings(selected);
    },
    
    updateSettings: function(id) {
        var win = WindowManager.get("visuals-menu");
        if (!win) {
            return;
        }
        if (id == "" || typeof id == "undefined") {
            VisualsMenu.selected = false;
            $(win).find("#visuals-settings").html(`
                <span class="blue-text text-darken-2"><i class="material-icons left" style="font-size: 1.5em;">info</i> Choose a Visualizer to change its Settings.</span>
            `);
        } else {
            VisualsMenu.selected = id;
            var v = Settings.get("visualizers." + id, false);
            if (!v) {
                $(win).find("#visuals-settings").html(`
                    <span class="red-text text-darken-4">
                        <i class="material-icons left" style="font-size: 1.5em;">error</i>
                        The selected Visualizer could not be loaded.
                    </span>
                `);
                win = null;
                return;
            }
            var p = v.properties;
            if (!p.visual_name) {
                p.visual_name = id;
            }
            
            var form = FormEditor.makeForm(VisualForm, p);
            
            $(win).find("#visuals-settings").children().off();
            $(win).find("#visuals-settings").html(`
                <p class="blue-text text-darken-2">
                    <b>Editing Visualizer <i>${p.visual_name}</i></b>
                </p>
                <div class="right-align">
                    <div class="btn-small green darken-4 btn-flat waves-effect" id="visuals-apply">
                        <i class="material-icons white-text">done</i>
                    </div>
                    <div class="btn-small red darken-4 btn-flat waves-effect" id="visuals-delete">
                        <i class="material-icons white-text">delete</i>
                    </div>
                </div>
                <div id="visuals-settings-panel">                    
                    ${form}
                </div>
            `);
            win = null;
            
            FormEditor.setupHooks("#visuals-settings-panel > form", function() {
                Settings.set("visualizers." + id + ".properties", FormEditor.toObject("#visuals-settings-panel > form"));
                Visuals.update(id);
            });
            FormEditor.applyConditions("#visuals-settings-panel > form");
        }
    },
    
    createVisual: function() {
        var nextId = Settings.get("visuals-id", 1);
        var id = "visual-" + nextId;
        Settings.set("visuals-id", nextId + 1);
        
        var vis = {
            properties: Visuals.defaultProps
        };
        
        Settings.set("visualizers." + id, vis);
        VisualsMenu.updateList(id);
        Visuals.update(id);
    },
    
    removeVisual: function() {
        if (!VisualsMenu.selected) {
            return false;
        }
        
        var v = Settings.get("visualizers", {});
        delete v[VisualsMenu.selected];
        Settings.set("visualizers", v);
        
        Visuals.update(VisualsMenu.selected);
        
        VisualsMenu.updateList();
    }
};
