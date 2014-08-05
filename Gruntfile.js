module.exports = function(grunt) {
  var src;
  var JSONfinal;
  var JSONstring;

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    shell: {                                // Task
        listFolders: {                      // Target
            options: {                      // Options
                stderr: false
            },
            command: function () {
              src = grunt.option("src");
//              return 'ls ' + src + '/Client&#160;Services/' +' >> .fileNames.txt';
              return 'ls ' + src + '/"Client Services"/' +' >> .fileNames.txt && ls ' + src + '/Creative/' +' >> .fileNames.txt && ls ' + src + '/Technology/' +' >> .fileNames.txt && ls ' + src + '/"High Priority"/' +' >> .fileNamesHP.txt';
            }
        },
    },
    "file-creator": {
      "basic": {
        "careers.json": function(fs, fd, done) {
          fs.writeSync(fd, JSONfinal);
          done();
        }
      }
    },
    remove: {
      default_options: {
          fileList: ['.fileNamesHP.txt', '.fileNames.txt'],
      }
    }
  });


  grunt.registerTask('lineparse',function () {
    JSONstring = "[\n{\n";
    var fileNames = (grunt.file.read('.fileNames.txt')).split("\n");
//    console.log(src);
//    console.log(fileNames[3]);
    for(var i = 0; i < fileNames.length - 1; i++){
      var division = '\t"division": "', title = '\t"title": "', locale = '\t"locale": "', filename = '\t"filename": "';
      var parts = fileNames[i].split("-");

      division += toTitleCase(parts[0].replace(/([.])/g,' ')) + '",\n';
//      console.log(division);
      if(parts[1].indexOf('+') != -1){
        var plusHandler = parts[1].split('+');
        title += toTitleCase(plusHandler[0].replace(/([.])/g,' ')) + " - " + plusHandler[1] + '",\n';
      } else {
        title += toTitleCase(parts[1].replace(/([.])/g,' ')) + '",\n';
      }

      locale += toTitleCase(parts[2].replace(/([.])/g,' ').substr(0,parts[2].length - 3)) + '",\n';
      filename += src + "/" + fileNames[i] + '"\n';
      //Put it all together
      JSONstring += division + title + locale + filename + '}';
      if(i != fileNames.length - 2){
        JSONstring += ",\n{";
      }else {

        JSONstring += "\n";
      }
    }
    
    function toTitleCase(str) {
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }
  });

grunt.registerTask('lineparseHP',function () {
    
    var fileNames = (grunt.file.read('.fileNamesHP.txt')).split("\n");
//    console.log(src);
//    console.log(fileNames[3]);
    if(fileNames.length > 1){
      JSONstring += ",\n{";
    }
    for(var i = 0; i < fileNames.length - 1; i++){

      var division = '\t"division": "', title = '\t"title": "', locale = '\t"locale": "', filename = '\t"filename": "', priority = '\t"priority": "true"\n';
      var parts = fileNames[i].split("-");

      division += toTitleCase(parts[0].replace(/([.])/g,' ')) + '",\n';
//      console.log(division);
      if(parts[1].indexOf('+') != -1){
        var plusHandler = parts[1].split('+');
        title += toTitleCase(plusHandler[0].replace(/([.])/g,' ')) + " - " + plusHandler[1] + '",\n';
      } else {
        title += toTitleCase(parts[1].replace(/([.])/g,' ')) + '",\n';
      }

      locale += toTitleCase(parts[2].replace(/([.])/g,' ').substr(0,parts[2].length - 3)) + '",\n';
      filename += src + "/" + fileNames[i] + '",\n';
      //Put it all together
      JSONstring += division + title + locale + filename + priority + '}';
      if(i != fileNames.length - 2){
        JSONstring += ",\n{";
      }else {

        JSONstring += "\n";
      }
    }
    JSONstring += "]";

    JSONfinal = JSONstring;
    function toTitleCase(str) {
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }
  });


//  grunt.registerTask('default', ['shell', 'remove']);
//  grunt.registerTask('default', ['shell']);

  grunt.registerTask('default', ['shell', 'lineparse', 'lineparseHP', 'file-creator', 'remove']);
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-file-creator');
  grunt.loadNpmTasks('grunt-remove');
};