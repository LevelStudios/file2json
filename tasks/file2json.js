/*
 * grunt-file2json
 * https://github.com/LevelStudios/file2json
 *
 * Copyright (c) 2014 Level Studios
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
    var src;
    var dest;
    var priority;


    grunt.registerMultiTask('file2json', 'Parses file names of a specific format into a  JSON file', function() {
        src = this.data.src;
        dest = this.data.dest;
        priority = this.data.priority;
        var filenames = [], hpfilenames = [];
        var JSONstring;

        grunt.file.recurse(src, function(abspath, rootdir, subdir, filename){
            var suffix = filename.substring(filename.length - 3, filename.length);
            if(suffix === ".md"){
                if(subdir === priority){
                    hpfilenames.push(filename);
                }else {
                    filenames.push(filename);
                }

            }

        });

        JSONstring = "[\n{\n";
        for(var i = 0; i < filenames.length - 1; i++){
            var division = '\t"division": "', title = '\t"title": "', locale = '\t"locale": "', filename = '\t"filename": "';
            var parts = filenames[i].split("-");

            division += toTitleCase(parts[0].replace(/([.])/g,' ')) + '",\n';
            //      console.log(division);
            if(parts[1].indexOf('+') != -1){
            var plusHandler = parts[1].split('+');
            title += toTitleCase(plusHandler[0].replace(/([.])/g,' ')) + " - " + plusHandler[1] + '",\n';
            } else {
            title += toTitleCase(parts[1].replace(/([.])/g,' ')) + '",\n';
            }

            locale += toTitleCase(parts[2].replace(/([.])/g,' ').substr(0,parts[2].length - 3)) + '",\n';
            filename += src + "/" + filenames[i] + '"\n';
            //Put it all together
            JSONstring += division + title + locale + filename + '}';
            if(i != filenames.length - 2){
                JSONstring += ",\n{";
            }else {
                JSONstring += "\n";
            }
        }
        if(hpfilenames.length > 1){
          JSONstring += ",\n{";
        }
        for(var i = 0; i < hpfilenames.length ; i++){

          var division = '\t"division": "', title = '\t"title": "', locale = '\t"locale": "', filename = '\t"filename": "', priority = '\t"priority": "true"\n';
          var parts = hpfilenames[i].split("-");

          division += toTitleCase(parts[0].replace(/([.])/g,' ')) + '",\n';
    //      console.log(division);
          if(parts[1].indexOf('+') != -1){
            var plusHandler = parts[1].split('+');
            title += toTitleCase(plusHandler[0].replace(/([.])/g,' ')) + " - " + plusHandler[1] + '",\n';
          } else {
            title += toTitleCase(parts[1].replace(/([.])/g,' ')) + '",\n';
          }

          locale += toTitleCase(parts[2].replace(/([.])/g,' ').substr(0,parts[2].length - 3)) + '",\n';
          filename += src + "/" + hpfilenames[i] + '",\n';
          //Put it all together
          JSONstring += division + title + locale + filename + priority + '}';
          if(i != hpfilenames.length - 1){
            JSONstring += ",\n{";
          }else {

            JSONstring += "\n";
          }
        }
        JSONstring += "]";

        grunt.file.write(dest, JSONstring);

        //Helper function that formats names to proper first character after space upper case
        function toTitleCase(str) {
            return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        }

    });

};
