$(function() {
    $("body").off("click", "#clocks-menu");
    $("body").off("click", "#clocks-menu-back");
    $("body").off("click", "#clocks-add");
    $("body").off("click", "#clocks-delete");
    $("body").off("click", "#clocks-apply");
    $("body").off("click", "#clock_time_format_help, #clock_date_format_help");
    $("body").on("click", "#clocks-menu", function() {
        var props = {
            headerTitle: "Clocks",
            width: 350,
            height: 700,
            content: `
                <div style="padding: 5px;">
                    <div class="btn-flat waves-effect waves-red" id="clocks-menu-back">
                        <i class="material-icons">chevron_left</i>
                    </div>
                    <br />
                    <div id="clocks-dynamic">
                        <div id="clocks-list">
                            
                        </div>
                        <br />
                        <div class="right-align">
                            <div id="clocks-add" class="btn-floating red darken-4 waves-effect tooltipped" data-tooltip="Add Clock">
                                <i class="material-icons">add</i>
                            </div>
                        </div>
                        <br />
                        <br />
                        <div id="clocks-settings">
                            
                        </div>
                    </div>
                </div>
             `
        };
        WindowManager.open("clocks-menu", props);
        WindowManager.close("control-panel");        
        ClocksMenu.updateList();
    });
    
    $("body").on("click", "#clocks-menu-back", function() {        
        WindowManager.showControlPanel();
        WindowManager.close("clocks-menu");    
    });
    
    $("body").on("click", "#clocks-add", function() {        
        ClocksMenu.createClock();
    });
    
    $("body").on("click", "#clocks-delete", function() {        
        ClocksMenu.removeClock();
    });
    
    $("body").on("click", "#clocks-apply", function() {        
        ClocksMenu.updateList(ClocksMenu.selected);
    });
    
    $("body").on("change", "#clocks-select", function() {        
        ClocksMenu.updateSettings($(this).find("option:selected").val());
    });
    
    $("body").on("click", "#clock_time_format_help, #clock_date_format_help", function() {
        WebWindow.open("momentjs-help", "https://momentjs.com/docs/#/parsing/string-format/");
    });
});

var ClocksMenu = {
    selected: false,
    
    updateList: function(selectid) {
        var clocks = Settings.get("clocks", {});
        var win = WindowManager.get("clocks-menu");
        
        var clk = [];
        
        for (var k in clocks) {
            var name = k;
            var selected = "";
            var v = clocks[k];
            if (v.properties.clock_name) {
                name = v.properties.clock_name;
            }
            if (selectid == k) {
                selected = "selected";
            }
            clk.push(`<option value="${k}" ${selected}>${name}</option>`);
        }        
        
        var title = "Choose a Clock to Edit";
        if (clk.length == 0) {
            title = "Create a Clock to Edit it here";
        }
        
        $(win).find("#clocks-list").html(`
            <div class="input-field">
                <select id="clocks-select">
                  <option value="" disabled>No Clock</option>
                  ${clk.join("")}
                </select>
                <label>${title}</label>
            </div>
        `);
        $('select').formSelect();
        
        var selected = $("#clocks-select option:selected").val();
        ClocksMenu.updateSettings(selected);
    },
    
    updateSettings: function(id) {
        var win = WindowManager.get("clocks-menu");
        if (id == "" || typeof id == "undefined") {
            ClocksMenu.selected = false;
            $(win).find("#clocks-settings").html(`
                <span class="blue-text text-darken-2">
                    <i class="material-icons left" style="font-size: 1.5em;">info</i>
                    Choose a Clock to change its Settings.
                </span>
            `);
        } else {
            ClocksMenu.selected = id;
            var c = Settings.get("clocks." + id, false);
            if (!c) {
                $(win).find("#clocks-settings").html(`
                    <span class="red-text text-darken-4">
                        <i class="material-icons left" style="font-size: 1.5em;">error</i>
                        The selected Clock could not be loaded.
                    </span>
                `);
                return;
            }
            var p = c.properties;
            if (!p.clock_name) {
                p.clock_name = id;
            }
            
            var form = FormEditor.makeForm(ClockForm, p);
            
            
            $(win).find("#clocks-settings").html(`
                <p class="blue-text text-darken-2">
                    <b>Editing Clock <i>${p.clock_name}</i></b>
                </p>
                <div class="right-align">
                    <div class="btn-small green darken-4 btn-flat waves-effect" id="clocks-apply">
                        <i class="material-icons white-text">done</i>
                    </div>
                    <div class="btn-small red darken-4 btn-flat waves-effect" id="clocks-delete">
                        <i class="material-icons white-text">delete</i>
                    </div>
                </div>
                <div id="clocks-settings-panel">                    
                    ${form}
                </div>
            `);
            
            FormEditor.setupHooks("#clocks-settings-panel > form", function() {
                Settings.set("clocks." + id + ".properties", FormEditor.toObject("#clocks-settings-panel > form"));
                Clock.settingsChanged();
            });
            FormEditor.applyConditions("#clocks-settings-panel > form");
        }
    },
    
    createClock: function() {
        var nextId = Settings.get("clocks-id", 1);
        var id = "clock-" + nextId;
        Settings.set("clocks-id", nextId + 1);
        
        var clock = {
            properties: Clock.defaultProps
        };
        
        Settings.set("clocks." + id, clock);
        ClocksMenu.updateList(id);
        
        Clock.settingsChanged();
    },
    
    removeClock: function() {
        if (!ClocksMenu.selected) {
            return false;
        }
        
        var v = Settings.get("clocks", {});
        delete v[ClocksMenu.selected];
        Settings.set("clocks", v);
        
        ClocksMenu.updateList();
        
        Clock.settingsChanged();
    }
};
