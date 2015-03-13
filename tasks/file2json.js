/*
 * grunt-file2json
 * https://github.com/LevelStudios/file2json
 *
 * Copyright (c) 2014 Level Studios
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {


    var toTitleCase = function(str){
        var converted = str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
            converted = converted.replace(/Ios\s/g, 'iOS ');
            converted = converted.replace(/Ux\s/g, 'UX ');
            converted = converted.replace(/Ui\s/g, 'UI ');
            converted = converted.replace(/Qa\s/g, 'QA ');
            converted = converted.replace(/Gp\s/g, 'GP ');
            converted = converted.replace(/Pd\s/g, 'PD ');
            converted = converted.replace(/Iphone/g, 'iPhone ');
            converted = converted.replace(/IPad/g, 'iPad ');

        return converted;
    };

    grunt.registerMultiTask('file2json', 'Parses file names of a specific format into a JSON file', function() {

        var JSONstring      = [];
        var isFilepath      = this.data.filepath || false;
        var isSlug          = this.data.slug || false;
        var priority        = this.data.priority;
        var dest            = this.data.dest;
        var template        = this.data.template.split("-");
        var newPath         = this.data.newpath;

        this.files.map( function ( fileArray ) {
            var src = fileArray.src;

            src.map(function( file ){

                // Is this a priority?
                var directory       = file.substring(0, file.indexOf('/'));
                var isPriority      = (directory.toLowerCase() === priority.toLowerCase());

                var fileName        = file.substring(file.indexOf('/')+1).replace('.md', '');
                var fileParts       = fileName.split("-");
                var slug            = fileName.replace(/([\-])/g,'_').replace(/(\.)/g, '-');

                var JSONfragment    = {};

                if (isFilepath) JSONfragment['filepath']    = newPath + file;
                if (isSlug)     JSONfragment['slug']        = slug;
                if (isPriority) JSONfragment['priority']    = isPriority;

                for (var i = 0; i < template.length; i++) {
                   JSONfragment[ template[i] ] = toTitleCase(fileParts[i].replace(/(\.)/g, ' '));
                }

                JSONstring.push(JSONfragment);
            });
        });

        grunt.file.write(dest, JSON.stringify(JSONstring));
    });

};
