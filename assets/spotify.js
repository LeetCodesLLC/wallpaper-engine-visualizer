const KSpotify = {
    authenticated: false,
    
    api: null,
    
    accessToken: null,
    
    ready: false,
    
    active: false,
    
    state: null,
    device_id: {},
    
    timer: null,
    
    anyPlayers: false,
    
    lastUpdate: 0,
    lastDeviceUpdate: 0,
    
    init: function() {
        KSpotify.ready = true;
        SpotifyMenu.refreshAuthState();
        setInterval(KSpotify.tokenRefresh, 60);
    },
    
    update: function() {
        if (!KSpotify.ready) {  
            return;
        }
        
        if (KSpotify.authenticated) {
            if (!KSpotify.api) {
                KSpotify.api = new SpotifyWebApi();                
                                
                KSpotify.active = true;            
                
                KSpotify.timer = setInterval(KSpotify.query, 2000);
            }
            KSpotify.api.setAccessToken(KSpotify.accessToken);
        } else {
            if (KSpotify.api != null) {
                KSpotify.api = null;
                KSpotify.active = false;
                KSpotify.state = null;
                clearInterval(KSpotify.timer);
            }
        }
    },
    
    tokenRefresh: function() {
        if (!KSpotify.authenticated) {
            return;            
        }
        
        var timeout = Math.min(KSpotify.accessTokenTimeout, KSpotify.accessTokenTimeoutLocal) - Date.now();
        
        if (timeout <= 300000) {
            SpotifyMenu.refreshAuthState();
        }
    },
    
    query: async function() {
        if (!KSpotify.api || !KSpotify.anyPlayers) {
            return;
        }
        
        KSpotify.state = await KSpotify.api.getMyCurrentPlaybackState();
        KSpotify.lastUpdate = Date.now();
        if (Date.now() - KSpotify.lastDeviceUpdate > 10000) {
            // Device Refresh every 10 seconds
            KSpotify.devices = await KSpotify.api.getMyDevices();
            KSpotify.lastDeviceUpdate = Date.now();
        }
    },
    
    getActiveDevice: function() {
        if (!KSpotify.devices || KSpotify.devices.devices.length == 0) {
            return false;
        }
        
        for (var d of KSpotify.devices.devices) {
            if (d.is_active) {
                return d;
            }
        }
        
        return KSpotify.devices.devices[0];
    },
    
    playPause: function() {
        if (!KSpotify.api || !KSpotify.anyPlayers) {
            return;
        }
        
        if (KSpotify.state.is_playing) {
            KSpotify.api.pause();
            KSpotify.state.is_playing = false;
        } else {
            var opts = {};
            if (!KSpotify.state.item) {
                var d = KSpotify.getActiveDevice();
                if (!d) {
                    return;
                }
                opts = {
                    device_id: d.id
                }
            }
            KSpotify.api.play(opts);
            KSpotify.state.is_playing = true;
        }
    },
    
    next: function() {
        if (!KSpotify.api || !KSpotify.anyPlayers) {
            return;        
        }
        
        KSpotify.api.skipToNext();
    },
    
    prev: function() {
        if (!KSpotify.api || !KSpotify.anyPlayers) {
            return;        
        }
        
        KSpotify.api.skipToPrevious();        
    },
    
    seek: function(ms) {
        if (!KSpotify.api || !KSpotify.anyPlayers) {
            return;        
        }
        
        KSpotify.api.seek(Math.floor(ms));           
    }
};