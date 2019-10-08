var WebWindow = {
    open: function(name, url, title) {
        var props = {
            headerTitle: title ? title : "Web View",
            content: `
                <iframe border="0" width="100%" height="100%" src="${url}"></iframe>
             `
        };
        WindowManager.open(name, props);
    }
}