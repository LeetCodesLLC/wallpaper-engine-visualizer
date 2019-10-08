$(function() {
    $("body").off("click", "#spotify-menu");
    $("body").off("click", "#spotify-menu-back");
    $("body").off("click", "#spotify_auth_check_access");
    $("body").off("click", "#spotify_auth_logout");
    $("body").off("click", "#spotify_auth_login");
    $("body").off("click", "#spotify_auth_cancel");
    $("body").off("click", "#spotify_auth_check_progress");
    $("body").on("click", "#spotify-menu", function() {
        SpotifyMenu.open();
    });
    
    $("body").on("click", "#spotify-menu-back", function() {        
        WindowManager.showControlPanel();
        WindowManager.close("spotify-menu");    
    });
    
    $("body").on("click", "#spotify_auth_login", function() {
        SpotifyMenu.startAuth();
    });
    
    $("body").on("click", "#spotify_auth_cancel", function() {
        SpotifyMenu.cancelAuth();
    });
    
    $("body").on("click", "#spotify_auth_check_progress", function() {
        SpotifyMenu.refreshAuthState();
    });
    
    $("body").on("click", "#spotify_auth_check_access", function() {
        SpotifyMenu.testAuth();
    });
    
    $("body").on("click", "#spotify_auth_logout", function() {
        SpotifyMenu.logout();
    });
    
    
    var s = Settings.get("spotify", {});
    if (s.code && s.timeIssued && s.timeIssued + 300 > (Date.now() / 1000)) {
        // Authentication happening -> auto open window
        SpotifyMenu.open(true);
    }
});

var SpotifyMenu = {
    open: function(forceUpdate) {
        var props = {
            headerTitle: "Spotify Integration",
            content: `
                <div style="padding: 5px;">
                    <div class="btn-flat waves-effect waves-red" id="spotify-menu-back">
                        <i class="material-icons">chevron_left</i>
                    </div>
                    <br />
                    <div class="center-align">
                        <img src="assets/img/spotify.png" width="300"/>
                    </div>
                    <p>
                        Connect your Wallpaper to Spotify. <br />
                        <small>Note that this stores an Access Token on a Server to proxy your requests.</small>
                    </p>                    
                    <br />
                    <br />
                    <br />
                    <div id="spotify-dynamic">
                        <div id="spotify-settings">
                            
                        </div>
                    </div>                                   
                </div>
             `
        };
        WindowManager.open("spotify-menu", props);
        WindowManager.close("control-panel");        
        SpotifyMenu.updateSettings();
        if (forceUpdate) {
            SpotifyMenu.refreshAuthState();
        }
    },
    
    checkInterval: false,
    
    startAuth: async function() {      
        $("#spotify_auth_login").prop("disabled", true);
        
        var result;
        try {
            result = await $.ajax({
                "url": "https://w.lbader.de/api/spotify/auth/init"
            });
        } catch (e) {
            $("#spotify_auth_login").prop("disabled", false);
            WindowManager.open("spotify-login-error", {
                content: 'Could not start Spotify Login. Are you connected to the Internet?'
            });
            return;
        }
        
        $("#spotify_auth_login").prop("disabled", false);
        
        Settings.set("spotify", {
            code: result.code,
            token: result.token,
            timeIssued: Date.now(),
            state: "init"
        });
        
        
        SpotifyMenu.updateSettings();
        SpotifyMenu.refreshAuthState();
    },
    refreshToken: function() {
        
    },    
    cancelAuth: function() {
        Settings.set("spotify", {});
        SpotifyMenu.updateSettings();
    },
    logout: async function() {
        var result;
        var s = Settings.get("spotify", {});
        if (!s.token) {
            Settings.set("spotify", {});
            SpotifyMenu.updateSettings();
            return;
        }
        
        try {
            result = await $.ajax({
                "url": "https://w.lbader.de/api/spotify/auth/logout",
                data: {
                    token: s.token
                }
            });
        } catch (e) {
            
        }
        Settings.set("spotify", {});
        SpotifyMenu.updateSettings();
        SpotifyMenu.refreshAuthState();
    },
    
    refreshAuthState: async function() {
        $("#spotify_auth_check_progress").prop("disabled", true);     
        var s = Settings.get("spotify", {});
        if (!s.token) {
            return;
        }
        
        var result;
        try {
            result = await $.ajax({
                "url": "https://w.lbader.de/api/spotify/auth/check",
                data: {
                    token: s.token
                }
            });
        } catch (e) {
            $("#spotify_auth_check_progress").prop("disabled", false);
            WindowManager.open("spotify-refresh-error", {
                content: 'Could not check the Authentication Progress.'
            });
            return;
        }
        
        Settings.set("spotify.state", result.auth_status);
        SpotifyMenu.updateSettings();
        
        if (result.auth_status != "init") {
            Settings.set("spotify.code", null);
        }
        
        if (result.auth_status == "init" || result.auth_status == "await_oauth") {
            if (!SpotifyMenu.checkInterval) {
                SpotifyMenu.checkInterval = setInterval(SpotifyMenu.refreshAuthState, 10000);
            }
        } else {
            clearInterval(SpotifyMenu.checkInterval);
            SpotifyMenu.checkInterval = false;
        }
        
        KSpotify.authenticated = result.auth_status == "authenticated";
        console.log(result);
        if (KSpotify.authenticated) {
            KSpotify.accessToken = result.accessToken;
            KSpotify.accessTokenTimeout = result.tokenTimeoutUnix * 1000;
            KSpotify.accessTokenTimeoutLocal = Date.now() + result.tokenTimeoutSeconds * 1000;
        }
        KSpotify.update();
        
        SpotifyMenu.updateSettings();
    },
    testAuth: function() {
        // TODO: Test connection with Server   
        SpotifyMenu.updateSettings();     
    },
    
    updateSettings: async function() {
        var win = WindowManager.get("spotify-menu");        
        var s = Settings.get("spotify", {});
        
        if (s.token && s.state == "authenticated") {        
            $(win).find("#spotify-settings").html(`           
                <div id="spotify-spotify-panel">                    
                    Connected to Spotify.<br />
                    <br />
                    <br />
                    <br />
                    <div class="center-align">
                        <div class="btn-flat green darken-2 white-text waves-effect" id="spotify_auth_check_access">
                            <i class="material-icons left">send</i>
                            Check Access
                        </div>
                        <div class="btn-flat red darken-2 white-text waves-effect" id="spotify_auth_logout">
                            <i class="material-icons left">logout</i>
                            Logout
                        </div>
                    </div>
                </div>
            `);            
        } else if (s.code && s.timeIssued && s.timeIssued + 900 > (Date.now() / 1000) && s.state == "init") {
            // Login seems to be started. 15 Minutes time.
            var checksum = await sha256(s.token);
            checksum = checksum.substr(-8);
            
            
            $(win).find("#spotify-settings").html(`           
                <div id="spotify-spotify-panel">                    
                    Authentication initialized. Please open your Browser and navigate to
                    <p style="font-size: 1.3rem" align="center" class="blue-text">
                        w.lbader.de
                    </p>
                    and click on <i>Spotify Login</i>. Enter the following Code:
                    
                    <p style="font-size: 3rem;" align="center">
                        ${s.code}
                    </p>
                    and click on <i>Start</i>.
                    Verify that the following token and / or checksum is displayed:
                    
                    <h5>Token</h5>
                    <p style="font-size: 1.3rem;" class="blue-text">
                        ${s.token}
                    </p>
                    <br />
                    <h5>Checksum</h5>
                    <p style="font-size: 1.3rem;" class="blue-text">
                        ${checksum}
                    </p>
                    
                    <br />
                    <br />
                    <br />
                    <div class="center-align">
                        <div class="btn-flat green darken-2 white-text waves-effect" id="spotify_auth_check_progress">
                            <i class="material-icons left">update</i>
                            Check Progress
                        </div>
                        <div class="btn-flat red darken-2 white-text waves-effect" id="spotify_auth_cancel">
                            <i class="material-icons left">undo</i>
                            Cancel Progress
                        </div>
                    </div>
                </div>
            `);            
        } else if (s.state == "await_oauth") {
            $(win).find("#spotify-settings").html(`           
                <div id="spotify-spotify-panel">                      
                    Awaiting Spotify OAuth Process to finish.
                    <br />
                    <br />
                    <br />
                    <br />
                    <div class="center-align">
                        <div class="btn-flat green darken-2 white-text waves-effect" id="spotify_auth_check_progress">
                            <i class="material-icons left">update</i>
                            Check Progress
                        </div>
                        <div class="btn-flat red darken-2 white-text waves-effect" id="spotify_auth_cancel">
                            <i class="material-icons left">undo</i>
                            Cancel Progress
                        </div>
                    </div>
                </div>
            `);
        } else {
            $(win).find("#spotify-settings").html(`           
                <div id="spotify-spotify-panel">         
                    No Spotify Authentication. Click below to start authentication process.         
                    <br />
                    <br />
                    <br />
                    <br />
                    <div class="center-align">
                        <div class="btn-flat green darken-2 white-text waves-effect" id="spotify_auth_login">
                            <i class="material-icons left">lock_open</i>
                            Login to Spotify
                        </div>
                    </div>
                </div>
            `);
        }
    }
};
