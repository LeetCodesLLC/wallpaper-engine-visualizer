$(function() {
    $("body").off("click", "#credits-menu");
    $("body").on("click", "#credits-menu", function() {
        var props = {
            headerTitle: "Credits",
            content: `
                <div class="container">
                    <h3>&copy 2019 - Lennart Bader</h3>
                    <p>
                        This Wallpaper has been created by Lennart Bader.
                    </p>
                    <p>
                        Used Libraries:
                        <ul class="browser-default">
                            <li>jQuery</li>
                            <li>ParticlesJS</li>
                            <li>Moment JS</li>
                            <li>Create JS</li>
                            <li>Tweenlite</li>
                            <li>Smooth JS</li>
                            <li>Materialize</li>
                            <li>Google Material Icons</li>
                            <li>Arthesian Library</li>
                            <li>jsPanel</li>
                        </ul>
                    </p>
                </div>
             `
        };
        WindowManager.open("credits-menu", props);
    });
});