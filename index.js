function searchDir(dir) {
    return ["test_module"]
}

module.exports = {
    list: function(directoryArray) {
        var modules = []
        for(var i = 0; i < directoryArray.length; i++) {
            modules = modules.concat(searchDir(directoryArray[i]));
        }        
        return modules;
    }
}
