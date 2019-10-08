var Settings = {
    get: function(key, def) {
        if (typeof def === "undefined") {
            def = false;
        }
        
        subkeys = key.split(".");
        var pkey = subkeys[0];
        
        if (window.localStorage[pkey]) {
            var obj = JSON.parse(window.localStorage[pkey]);
            if (subkeys.length == 1) {
                return obj;
            }
            subkeys.shift();
            return Settings.getSub(obj, subkeys, def);
        }
        
        return def;
    },
    
    set: function(key, obj) {            
        var subkeys = key.split(".");
        if (subkeys.length > 1) {
            var primKey = subkeys.shift();
            var startObj = typeof window.localStorage[primKey] === "undefined" ? {} : JSON.parse(window.localStorage[primKey]);
            var res = Settings.setSub(startObj, subkeys, obj);
            window.localStorage[primKey] = JSON.stringify(res);
        } else {
            window.localStorage[key] = JSON.stringify(obj);
        }
    },
    
    import: function(json) {        
        window.localStorage = JSON.parse(json);
    },
    
    export: function() {
        return JSON.stringify(window.localStorage);
    },
    
    getSub: function(obj, subkeys, def) {
        if (subkeys.length == 0) {   
            console.log("No subkeys");
            return def;
        }
        if (typeof obj[subkeys[0]] !== "undefined") {
            if (subkeys.length == 1) {        
                return obj[subkeys[0]];                
            } else {
                var subobj = obj[subkeys[0]];
                subkeys.shift();
                return Settings.getSub(subobj, subkeys, def);
            }
        }
        return def;
    },
    
    setSub: function(obj, subkeys, val) {
        if (subkeys.length == 0) {        
            console.log("Empty Keys");
            return obj;
        }
        
        if (typeof obj === "undefined") {    
            console.log("Undefined Object");
            return obj;
        }
        
        if (subkeys.length == 1) {
            obj[subkeys[0]] = val;
            return obj;
        }
        
        if (typeof obj[subkeys[0]] === "undefined") {
            obj[subkeys[0]] = {};
        }
        
        var subobj = obj[subkeys[0]];
        if (typeof subobj === "object") {
            var tkey = subkeys.shift();
            obj[tkey] = Settings.setSub(subobj, subkeys, val);
            return obj;
        } else {
            return obj;
        }               
        return obj;
    }
};