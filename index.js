var glob = require("glob");
var fs = require("fs");
var cheerio = require("cheerio");

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

    //TODO search script tag

    var widgetTags = $("[data-dojo-type]");
    for(var i=0; i < widgetTags.length; i++) {
        modules.push($(widgetTags[i]).attr("data-dojo-type").replace(/\./g, "/"));
    }

    //TODO search mixins

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
