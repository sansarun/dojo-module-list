var glob = require("glob");
var fs = require("fs");
var cheerio = require("cheerio");
var amdetective = require("amdetective");

function searchDir(dir) {
    var modules = [];

    //search in html files
    var htmlFiles = glob.sync(dir + "/**/*.html");
    for(var i=0; i < htmlFiles.length; i++) {
        modules = modules.concat(searchHtmlFile(htmlFiles[i]));
    }

    //TODO search in js files

    return modules;
}

function searchHtmlFile(file) {
    var modules = [];

    $ = cheerio.load(fs.readFileSync(file).toString());

    //search javscript in script tags
    var scriptTags = $("script");
    for(var i=0; i < scriptTags.length; i++) {
        var scriptText = $(scriptTags[i]).html();
        modules = modules.concat(amdetective(scriptText, {'findNestedDependencies': true}));
    }

    //search widget declaration by looking for data-dojo-type attribute 
    var widgetTags = $("[data-dojo-type]");
    for(var i=0; i < widgetTags.length; i++) {
        modules.push($(widgetTags[i]).attr("data-dojo-type").replace(/\./g, "/"));

        //check if widget has any mixin
        var mixinsAttr = $(widgetTags[i]).attr("data-dojo-mixins");
        if(mixinsAttr !== undefined) {
            modules = modules.concat(mixinsAttr.split(",").map(function(m){return m.trim()}));
        }
    }

    return modules;
}

module.exports = {
    list: function(directoryArray) {
        var modules = [];
        for(var i = 0; i < directoryArray.length; i++) {
            modules = modules.concat(searchDir(directoryArray[i]));
        }        
        return modules;
    }
}
