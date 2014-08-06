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
    var template;
    var filepath;

    grunt.registerMultiTask('file2json', 'Parses file names of a specific format into a  JSON file', function() {
        src = this.data.src;
        dest = this.data.dest;
        priority = this.data.priority;
        template = this.data.template.split("-");
        filepath = this.data.filepath;
        var writtenCount = 0;
        var filenames = [], hpfilenames = [], fnSubs = [], hpfnSubs = [];
        var JSONstring;
        var index = src.indexOf('/');
        var relative = src.substring(index, src.length);

        grunt.file.recurse(src, function(abspath, rootdir, subdir, filename){
            var suffix = filename.substring(filename.length - 3, filename.length);
            if(suffix === ".md"){
                if(subdir === priority){
                    hpfilenames.push(filename);
                    hpfnSubs.push(subdir);
                }else {
                    filenames.push(filename);
                    fnSubs.push(subdir);
                }
            }
        });

        for(var i = 0; i < template.length; i++){
            template[i] = '\t"' + template[i] + '": "';
        }

        JSONstring = "[\n{\n";
        for(var i = 0; i < filenames.length; i++){
            var templateCopy = [];
            for(var j = 0; j < template.length; j++){
                templateCopy[j] = template[j];
            }
            var parts = filenames[i].split("-");
            for(var j = 0; j < templateCopy.length; j++){
                if(parts.length == templateCopy.length){
                    if(j >= templateCopy.length - 1){
                      parts[j] = parts[j].substr(0,parts[j].length - 3);
                    }
                    if(parts[j].indexOf('+') != -1){
                        var plusHandler = parts[j].split('+');
                        templateCopy[j] += toTitleCase(plusHandler[0].replace(/([.])/g,' ')) + " - " + plusHandler[1] + '",\n';
                    } else {
                        templateCopy[j] += toTitleCase(parts[j].replace(/([.])/g,' ')) + '",\n';
                    }
                    JSONstring += templateCopy[j];
                    
                }
            }
            if(parts.length == templateCopy.length){
                if(filepath){
                    JSONstring += '\t"filepath": "'  + relative + "/" + fnSubs[i] + "/" + filenames[i] + '"\n';
                }

                writtenCount++;
                JSONstring +=  '}';
                if(i != filenames.length - 1){
                    JSONstring += ",\n{";
                }else {
                    JSONstring += "\n";
                }
            }
        }



        if(hpfilenames.length > 1){
          JSONstring += ",\n{";
        }
        for(var i = 0; i < hpfilenames.length; i++){
            var templateCopy = [];
            for(var j = 0; j < template.length; j++){
                templateCopy[j] = template[j];
            }
            var parts = hpfilenames[i].split("-");
            for(var j = 0; j < templateCopy.length; j++){
                if(parts.length == templateCopy.length){
                    if(j >= templateCopy.length - 1){
                      parts[j] = parts[j].substr(0,parts[j].length - 3);
                    }
                    if(parts[j].indexOf('+') != -1){
                        var plusHandler = parts[j].split('+');
                        templateCopy[j] += toTitleCase(plusHandler[0].replace(/([.])/g,' ')) + " - " + plusHandler[1] + '",\n';
                    } else {
                        templateCopy[j] += toTitleCase(parts[j].replace(/([.])/g,' ')) + '",\n';
                    }
                    JSONstring += templateCopy[j];
                    
                }
            }
            if(parts.length == templateCopy.length){
                JSONstring += '\t"priority": true,\n';
                if(filepath){
                    JSONstring += '\t"filepath": "'  + relative + "/" + hpfnSubs[i] + "/" + hpfilenames[i] + '"\n';
                }
                
                writtenCount++;
                JSONstring +=  '}';
                if(i != hpfilenames.length - 1){
                    JSONstring += ",\n{";
                }else {
                    JSONstring += "\n";
                }
            }
        }

        JSONstring += "]";
        if(writtenCount == 0){
            JSONstring = "";
        }else if(writtenCount == 1){
            JSONstring = JSONstring.substr(0, JSONstring.length - 4);
            JSONstring += "\n]";
        }
        grunt.file.write(dest, JSONstring);

        //Helper function that formats names to proper first character after space upper case
        function toTitleCase(str) {
            return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        }

    });

};