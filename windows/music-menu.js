$(function() {
    $("body").off("click", "#musics-menu");
    $("body").off("click", "#musics-menu-back");
    $("body").off("click", "#musics-add-spotify");
    $("body").off("click", "#musics-delete");
    $("body").off("click", "#musics-apply");
    $("body").on("click", "#musics-menu", function() {
        var props = {
            headerTitle: "Music Players",
            width: 350,
            height: 700,
            content: `
                <div style="padding: 5px;">
                    <div class="btn-flat waves-effect waves-red" id="musics-menu-back">
                        <i class="material-icons">chevron_left</i>
                    </div>
                    <br />
                    <div id="musics-dynamic">
                        <div id="musics-list">
                            
                        </div>
                        <br />
                        <div class="right-align">
                            <div id="musics-add-spotify" class="btn-floating red darken-4 waves-effect tooltipped" data-tooltip="Add Spotify">
                                <i class="material-icons">add</i>
                            </div>
                        </div>
                        <br />
                        <br />
                        <div id="musics-settings">
                            
                        </div>
                    </div>
                </div>
             `
        };
        WindowManager.open("musics-menu", props);
        WindowManager.close("control-panel");        
        MusicsMenu.updateList();
    });
    
    $("body").on("click", "#musics-menu-back", function() {        
        WindowManager.showControlPanel();
        WindowManager.close("musics-menu");    
    });
    
    $("body").on("click", "#musics-add-spotify", function() {        
        MusicsMenu.createSpotify();
    });
    
    $("body").on("click", "#musics-delete", function() {        
        MusicsMenu.removeMusic();
    });
    
    $("body").on("click", "#musics-apply", function() {        
        MusicsMenu.updateList(MusicsMenu.selected);
    });
    
    $("body").on("change", "#musics-select", function() {        
        MusicsMenu.updateSettings($(this).find("option:selected").val());
    });
});

var MusicsMenu = {
    selected: false,
    
    updateList: function(selectid) {
        var musics = Settings.get("musics", {});
        var win = WindowManager.get("musics-menu");
        
        var players = [];
        
        for (var k in musics) {
            var name = k;
            var selected = "";
            var v = musics[k];
            if (v.properties.clock_name) {
                name = v.properties.clock_name;
            }
            if (selectid == k) {
                selected = "selected";
            }
            players.push(`<option value="${k}" ${selected}>${name}</option>`);
        }        
        
        var title = "Choose a Music Player to Edit";
        if (players.length == 0) {
            title = "Create a Music Player to Edit it here";
        }
        
        $(win).find("#musics-list").html(`
            <div class="input-field">
                <select id="musics-select">
                  <option value="" disabled>No Players</option>
                  ${players.join("")}
                </select>
                <label>${title}</label>
            </div>
        `);
        $('select').formSelect();
        
        var selected = $("#musics-select option:selected").val();
        MusicsMenu.updateSettings(selected);
    },
    
    updateSettings: function(id) {
        var win = WindowManager.get("musics-menu");
        if (id == "" || typeof id == "undefined") {
            MusicsMenu.selected = false;
            $(win).find("#musics-settings").html(`
                <span class="blue-text text-darken-2">
                    <i class="material-icons left" style="font-size: 1.5em;">info</i>
                    Choose a Music Player to change its Settings.
                </span>
            `);
        } else {
            MusicsMenu.selected = id;
            var c = Settings.get("musics." + id, false);
            if (!c) {
                $(win).find("#musics-settings").html(`
                    <span class="red-text text-darken-4">
                        <i class="material-icons left" style="font-size: 1.5em;">error</i>
                        The selected Music Player could not be loaded.
                    </span>
                `);
                return;
            }
            var p = c.properties;
            if (!p.name) {
                p.name = id;
            }
            
            var form = FormEditor.makeForm(MusicsForm, p);
            
            
            $(win).find("#musics-settings").html(`
                <p class="blue-text text-darken-2">
                    <b>Editing Player <i>${p.name}</i></b>
                </p>
                <div class="right-align">
                    <div class="btn-small green darken-4 btn-flat waves-effect" id="musics-apply">
                        <i class="material-icons white-text">done</i>
                    </div>
                    <div class="btn-small red darken-4 btn-flat waves-effect" id="musics-delete">
                        <i class="material-icons white-text">delete</i>
                    </div>
                </div>
                <div id="musics-settings-panel">                    
                    ${form}
                </div>
            `);
            
            FormEditor.setupHooks("#musics-settings-panel > form", function() {
                Settings.set("musics." + id + ".properties", FormEditor.toObject("#musics-settings-panel > form"));
                MusicPlayer.settingsChanged();
            });
            FormEditor.applyConditions("#musics-settings-panel > form");
        }
    },
    
    createSpotify: function() {
        var nextId = Settings.get("musics-id", 1);
        var id = "player-" + nextId;
        Settings.set("player-id", nextId + 1);
        
        var props = $.extend({}, MusicPlayer.defaultProps, {player_type: "spotify"});
        
        var player = {
            properties: props
        };
        
        Settings.set("musics." + id, player);
        MusicsMenu.updateList(id);
        
        MusicPlayer.settingsChanged();
    },
    
    removePlayer: function() {
        if (!MusicsMenu.selected) {
            return false;
        }
        
        var v = Settings.get("musics", {});
        delete v[MusicsMenu.selected];
        Settings.set("musics", v);
        
        MusicsMenu.updateList();
        
        MusicPlayer.settingsChanged();
    }
};
