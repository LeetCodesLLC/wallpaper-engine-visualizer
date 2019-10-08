$(function() {
    $("body").off("click", "#layers-menu");
    $("body").off("click", "#layers-menu-back");
    $("body").off("click", ".layers-order-button");
    $("body").on("click", "#layers-menu", function() {
        var props = {
            headerTitle: "Visual Layers",
            content: `
                <div style="padding: 5px;">
                    <div class="btn-flat waves-effect waves-red" id="layers-menu-back">
                        <i class="material-icons">chevron_left</i>
                    </div>
                    <br />
                    <p>
                        Order the visuals vertically (zIndex), i.e., decide which should be displayed in the background relative to another.<br />
                        New Visuals will be inserted on top of the highest Visual of the same type.
                    </p>
                    <div id="layers-dynamic">
                    </div>
                </div>
             `
        };
        WindowManager.open("layers-menu", props);
        WindowManager.close("control-panel");        
        LayersMenu.updateSettings();
    });
    
    $("body").on("click", "#layers-menu-back", function() {        
        WindowManager.showControlPanel();
        WindowManager.close("layers-menu");    
    });
    
    $("body").on("click", ".layer-order-button", function() {
        var li = $(this).parent();
        var action = $(this).data("action");
        if (action == "up") {
            // need predecessor
            if ($(li).prev().length) {
                $(li).insertBefore($(li).prev());
                LayersMenu.applySettings();
            }
        } else {
            // need successor
            if ($(li).next().length) {
                $(li).insertAfter($(li).next());
                LayersMenu.applySettings();
            }            
        }
    });
});

var LayersMenu = {        
    updateSettings: function() {
        var win = WindowManager.get("layers-menu");        
        
        var elements = [];
        
        var visuals = VisualsManager.getSorted();
        for (var v of visuals) {
            var visualName = v.scopedId;
            if ("nameattr" in v.scope) {
                var n = v.scope.nameattr;
                if (n in v.visual.properties) {
                    visualName = v.visual.properties[n];
                }
            }
            
            elements.push(`
                <li class="collection-item layer-item flex-container flex-row" data-scope="${v.scope.optionpath}" data-scopedid="${v.scopedId}">
                    <span class="red-text text-darken-4" style="marginRight: 20px; width: 200px; line-height: 33px;">
                        ${v.scope.name}
                    </span>
                    <span class="flex-1 spaceleft" style="line-height: 33px;">
                        ${visualName}
                    </span>
                    <button class="btn-flat btn-small waves-effect red darken-4 spaceleft white-text layer-order-button" data-action="up">
                        <i class="material-icons">keyboard_arrow_up</i>
                    </button>
                    <button class="btn-flat btn-small waves-effect red darken-4 spaceleft white-text layer-order-button" data-action="down">
                        <i class="material-icons">keyboard_arrow_down</i>
                    </button>
                </li>
            `);
        }
        
        $(win).find("#layers-dynamic").html(`           
            <ul class="collection" id="layers_collection">
                ${elements.join("\n")}
            </ul>
        `);
    },
    
    applySettings: function() {
        var layers = [];
        $("#layers-dynamic").find(".layer-item").each(function() {
            layers.push({
                "scope": $(this).data("scope"),
                "scopedId": $(this).data("scopedid")
            });
        });
        VisualsManager.saveOrder(layers);
    }
};
