$(function() {
    $("body").off("click", "#credits-menu");
    $("body").on("click", "#credits-menu", function() {
        var props = {
            headerTitle: "Credits",
            content: `
                <div class="container">
                    <h3>&copy 2019 - Kryptur</h3>
                    <p>
                        This Wallpaper has been created by Lennart Bader.
                    </p>
                    <p>
                        Used Libraries:
                        <ul class="browser-default">
                            <li>jQuery</li>
                            <li>jQuery UI</li>
                            <li>Arthesian Library</li>
                            <li>ParticlesJS</li>
                            <li>Moment JS</li>
                            <li>Create JS</li>
                            <li>Tweenlite / Greensock</li>
                            <li>Smooth JS</li>
                            <li>Materialize</li>
                            <li>Google Material Icons</li>
                            <li>PickR</li>
                            <li>Spotify-Web-API</li>
                            <li>Keyboard JS</li>
                        </ul>
                    </p>
                </div>
             `
        };
        WindowManager.open("credits-menu", props);
    });
});