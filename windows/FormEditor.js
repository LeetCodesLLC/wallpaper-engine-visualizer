'use strict';

var FormEditor = {
    nextId: 0,
    
    forms: [],
    
    makeForm: function(config, values) {
        var fields = [];
        
        for (var name in config) {
            var preval = null;
            if (name in values) {
                preval = values[name];
            }
            
            fields.push(FormEditor.makeField(name, config[name], preval));
        }
        
        var id = FormEditor.nextId;
        FormEditor.nextId = FormEditor.nextId + 1;
        
        FormEditor.forms.push("#formeditor-"+id);
        
        return `
            <form id="formeditor-${id}">
                ${fields.join("\n")}
            </form>`;
    },
    
    setupHooks: function(cont, callback) {
        // Clean-up old hooks
        for (var f in FormEditor.forms) {
            if (!$(f).length) {
                $("body").off("change", f + " input");
                $("body").off("change", f + " select");
            }
        }
        
        $('select').formSelect();
        M.updateTextFields();
        
        $("body").off("change", cont + " input");
        $("body").off("change", cont + " select");
        $("body").on("change", cont + " input", function() {
            callback();
            FormEditor.applyConditions(cont);
        });
        $("body").on("change", cont + " select", function() {
            callback();
            FormEditor.applyConditions(cont);
        });
        $("input[type=text], input[type=password]").filter(function() {
            return typeof $(this).attr("name") !== "undefined";
        }).each(function() {
            var k = $(this).getkeyboard();
            if (typeof k !== "undefined") {
                k.destroy();
            }
            $(this).keyboard({
                "layout": "qwerty",
                autoAccept: true
            });
        });
    },
    
    toObject: function(elem) {
        var obj = {};
        $(elem).find("input, select").each(function() {
            var name = $(this).attr("name");
            if (typeof name !== "undefined") {
                obj[name] = FormEditor.getValue(elem, name);
            }
        });
        return obj;
    },
    
    makeField: function(name, config, val) {
        var cond = "";
        if (config.condition) {
            cond = 'data-condition="'+config.condition+'"';
        }
        val = (val === null ? ("value" in config ? config.value : null) : val);        
        switch (config.type) {
            case "text":
            case "hidden":
            case "password":
                val = val === null ? "" : val;
                return `
                    <div class="input-field form-element" ${cond}>
                      <input id="${name}" name="${name}" type="${config.type}" class="validate" value="${val}">
                      <label for="${name}">${config.text}</label>
                    </div>
                `;
                break;
            case "bool":
                val = val === null ? false : val;
                return `
                    <p class="form-element" ${cond}>
                      <label>
                        <input type="checkbox" class="filled-in" name="${name}" ${val ? "checked" : ""} />
                        <span>${config.text}</span>
                      </label>
                    </p>`;
                break;
            case "slider":
                val = val === null ? 0 : val;
                return `
                    <div class="input-field form-element" ${cond}>
                      <input id="${name}" name="${name}" type="number" min="${config.min}" max="${config.max}" class="validate" value="${val}">
                      <label for="${name}">${config.text}</label>
                    </div>
                `;
                break;
            case "button":                
                return `
                    <div class="form-element right-align" ${cond}>
                        <button class="${config.class} btn-flat waves-effect" id="${name}">
                            <i class="material-icons left ${config.fontclass}">${config.icon}</i>
                            <span class="${config.fontclass}">${config.text}</span>
                        </button>
                    </div>
                `;
                break;
            case "combo":
                var opts = [];
                for (var o of config.options) {          
                    var selected = o.value == val ? "selected" : "";
                    opts.push(`<option value="${o.value}" ${selected}>${o.label}</option>`)
                }
                return `
                    <div class="form-element" ${cond}>
                        <label>${config.text}</label>
                        <select name="${name}">
                          ${opts.join("")}
                        </select>
                    </div>
                `;
                break;
            case "color":
                val = !val ? "#000000" : val;
                return `
                    <div class="form-element" ${cond}>
                      <label>${config.text}</label>
                      <input id="${name}" name="${name}" type="color" style="display: none;" class="validate" value="${val}">
                      <div id="${name}-picker"></div>
                    </div>
                    <script>
                        Pickr.create({
                            el: "#${name}-picker",
                            theme: "nano",
                            default: "${val}",
                            components: {
                                preview: true,
                                opacity: true,
                                hue: true
                            }
                        }).on("change", function(color, instance) {
                            instance.applyColor(true);
                            $("#${name}").val(color.toHEXA().toString());
                            $("#${name}").trigger("change");
                        });
                    </script>`;
                break;
            default:
                console.log("Unknown Input Type: " + config.type);
                break;
        }
    },
    
    applyConditions: function(elem) {        
        $(elem).find(".form-element").each(function() {
            var cond = $(this).data("condition");
            if (typeof cond === "undefined") {
                $(this).show();
                return;
            }
                        
            if (FormEditor.evalCondition(elem, cond, false)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    },
    
    evalCondition: function(elem, cond, debug) {
        if (cond.indexOf("&&") >= 0) {
            var parts = cond.split("&&");
            var result = true;
            var subresults = [];
            for (var p of parts) {
                var subres = FormEditor.evalCondition(elem, p, debug);
                subresults.push({
                    "query": p,
                    "result": subres
                });
                result = result && subres;
            }
            if (debug) {
                console.log({
                    "query": cond,
                    "subresults": subresults,
                    "totalResult": result
                });
            }
            return result;
        } else if (cond.indexOf("||") >= 0) {
            var parts = cond.split("||");
            var result = false;
            var subresults = [];
            for (var p of parts) {
                var subres = FormEditor.evalCondition(elem, p, debug);
                subresults.push({
                    "query": p,
                    "result": subres
                });
                result = result || subres;
            }
            if (debug) {
                console.log({
                    "query": cond,
                    "subresults": subresults,
                    "totalResult": result
                });
            }
            return result;
        } else if (cond.indexOf("==") >= 0) {
            var parts = cond.split("==");
            if (parts.length == 2) {
                var l = FormEditor.evalCondition(elem, parts[0], debug);
                var r = FormEditor.evalCondition(elem, parts[1], debug);
                if (debug) {
                    console.log({
                        "evalstep": "==",
                        "leftQuery": parts[0],
                        "leftResult": l,
                        "rightQuery": parts[1],
                        "rightResult": r,
                        "totalResult": l == r
                    });
                }
                return l == r;
            }
            return false;
        } else if (cond.indexOf(".value") >= 0) {
            var c = cond.trim();
            var invert = false;
            if (c.indexOf("!") === 0) {
                invert = true;
                c = c.substr(1);
            }
            var val = null;
            
            var names = c.split(".");
            var name = names[0];
            
            if ($(elem).find("[name='"+name+"']").length) {
                val = FormEditor.getValue(elem, name);
            }
            if (val != null) {
                return invert ? !val : val;
            }
            
            return false;
        } else {
            var c = cond.trim();
            if (c == "true") {
                return true;
            } else if (c == "false") {
                return false;
            }
            return c;
        }
    },
    
    getValue: function(elem, name) {
        if (!$(elem).find("[name='"+name+"']").length) {
            return false;
        }
        var type = $(elem).find("[name='"+name+"']").attr("type");
        if (typeof type === "undefined") {
            type = $(elem).find("[name='"+name+"']").prop('nodeName').toLowerCase();
        }
        var val = false;
        switch (type) {
            case "text":
            case "password":
            case "color":   
            case "number":                       
                val = testNum($(elem).find("[name='"+name+"']").val());                        
                break;                                          
                break;
            case "checkbox":
                val = $(elem).find("[name='"+name+"']").is(":checked");
                break;
            case "select":
                //var val = ($("[name='"+name+"']").formSelect("getSelectedValues"))[0];
                val = testNum($("[name='"+name+"']").find("option:selected").val());
                break;
            default:
                console.log("Unknown Input type " + type);
                break;
        }
        return val;
    }
};