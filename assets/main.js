function getColorString(color) {
    return color;
    var c = color.split(' ').map(function(c) {
        return Math.ceil(c * 255)
    });
    return 'rgb(' + c + ')'; // Solid color    
}

function getColorRGBString(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    var rgb = result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : {r: 0, g: 0, b: 0};
    
    return `rgb(${rgb.r},${rgb.g},${rgb.b})`;
    
}

async function sha256(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hash = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hash));  
    console.log(hashArray);
    const hashStr = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    console.log(hashStr);
    return hashStr;
}

function isNum(str) {
    return /^-?\d+$/.test(str);
}

function testNum(str) {
    if (isNum(str)) {
        return parseInt(str);
    }
    return str;
}

function Log(str) {
    $("#log").append(str + "\n");
    $("#log").scrollTop($("#log").height());
}

function updateProperties(properties) {
    if (properties.background) {
        if (properties.background.value) {
            Settings.set("background", properties.background.value)
        } else {
            Settings.set("background", "");            
        }
        SettingsMenu.applySettings();
    }
    
    
    if (properties.show_menu_fab) {
        if (properties.show_menu_fab.value) {            
            $("#show-menu").show();
        } else {
            $("#show-menu").hide();
        }
    }      
            $("#show-menu").show();
    
    return;
    
    if (properties.locale) {
        if (properties.locale.value) {
            moment.locale(properties.locale.value);
        } else {                
            moment.locale("en");
        }
    }    
    
    if (properties.clock_enable) {
        Clock.properties.clock_enable = properties.clock_enable.value;
        Clock.update();
    }
    
    if (properties.clock_font) {
        Clock.properties.clock_font = properties.clock_font.value;
        Clock.update();
    }
    
    if (properties.clock_size) {
        Clock.properties.clock_size = properties.clock_size.value;
        Clock.update();
    }
    
    if (properties.clock_color) {
        Clock.properties.clock_color = properties.clock_color.value;
        Clock.update();
    }
    
    if (properties.clock_offset_x) {
        Clock.properties.clock_offset_x = properties.clock_offset_x.value;
        Clock.update();
    }
    
    if (properties.clock_offset_y) {
        Clock.properties.clock_offset_y = properties.clock_offset_y.value;
        Clock.update();
    }
    
    if (properties.clock_anchor) {
        Clock.properties.clock_anchor = properties.clock_anchor.value;
        Clock.update();
    }
    
    if (properties.clock_screen_anchor) {
        Clock.properties.clock_screen_anchor = properties.clock_screen_anchor.value;
        Clock.update();
    }
}


// Read changes made by users
window.wallpaperPropertyListener = {
    applyUserProperties: updateProperties,
    applyGeneralProperties: updateProperties
};

$(function() {
    $("body").on("submit", "form", function(e) {
        e.preventDefault();
        return true;
    });
    
    $("body").on("contextmenu", function(e) {
        e.preventDefault();
        return true;
    });
    
    SettingsMenu.applySettings();
});