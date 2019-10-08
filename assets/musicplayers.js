const MusicPlayer = {
    defaultProps: {
        zIndex: 0,
        type: "undefined",        
        enable: true,
        enabled: true,
        offset_x: 0,
        offset_y: 0,
        bassShakeEnabled: false,
        bassShakeStrength: 1,
        bounceOnBeatEnabled: false,
        bounceStrength: 1
    },
    
    players: {},
    
    settingsChanged: function() {
        var players = Settings.get("musics", {});
        for (var c in players) {
            if (c in MusicPlayer.players) {        
                MusicPlayer.players[c].properties = players[c].properties;
            } else {
                MusicPlayer.players[c] = players[c];
            }
        }
        
        MusicPlayer.update();
    },
    
    update: function() {
        var playerCount = {
            "spotify": 0,
            "google": 0
        };
        
        for (var id in MusicPlayer.players) {
            var c = MusicPlayer.players[id];
            var p = c.properties;            
            
            if (p.enable) {
                playerCount[p.type] += 1;
                if (!MusicPlayer.players[id].visualizer) {
                    console.log("Adding Player Visual");
                    MusicPlayer.players[id].visualizer = new kvisual.musicplayer(id, p);
                    VisualsManager.visualizer.addVisual(MusicPlayer.players[id].visualizer);
                }
                
                MusicPlayer.players[id].visualizer.settings = p;
                MusicPlayer.players[id].visualizer.settings.enabled = p.enable;
            } else {                
                if (MusicPlayer.players[id].visualizer) {                
                    console.log("Removing Player " + id);
                    VisualsManager.visualizer.removeVisual(id);
                    MusicPlayer.players[id].visualizer = false;
                }
            }
        }
        
        if (playerCount["spotify"] > 0) {
            KSpotify.anyPlayers = true;
        } else {            
            KSpotify.anyPlayers = false;
        }
    },
    
    start: function() {
        MusicPlayer.settingsChanged();
        VisualsManager.addVisuals({
            optionpath: "musics", 
            name: "Player",
            onUpdate: MusicPlayer.updateAll,
            nameattr: "name"
        });
    },
    
    updateAll: function() {
        Clock.settingsChanged();
        Clock.update();
    }
}