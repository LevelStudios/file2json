# grunt-file2json

> Parses file names of a specific format into a  JSON file

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```
npm install grunt-file2json --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```
grunt.loadNpmTasks('grunt-file2json');
```


##API
    newpath:  Basepath you want to use in the filepath
    dest:     String: A path/to/filename that describes the destination of the JSON file,
    src:      String: A path/to/markdownDirectory that describes the source of the markdown directory,
    priority: String: name of the appropraite subdirectory that will be marked in the JSON file with a "priority": "true" attribute,
    template: String: templates how the JSON structure will come out,
    filepath: Boolean: if true, an addition filepath attribute will be appended to each JSON object.


###Sample Option

    file2json: {
      target: {
        cwd:'source/files/foo',
        newpath: 'files/foo/',
        dest:'foo/bar.json',
        src:'baz/bar/foo',
        priority:'subdirectory2',
        template:'foo-bar-baz',
        filepath: true
      }
    }

This would grab all the markdown files from the subdirectories in the directory 'baz/bar/foo', and create a JSON file in 'foo/bar.json'. The JSON would look something like this:

    [
    ...
    {
        "foo": "subdirectory1",
        "bar": "blah",
        "baz": "blah",
        "filepath": "/baz/bar/foo/subdirectory1/foo.Name-bar.Name-baz.Name.md",
        "slug":"foo-Name_bar-Name_baz-Name"
    },
    {
        "foo": "subdirectory2",
        "bar": "blah",
        "baz": "blah",
        "filepath": "/baz/bar/foo/subdirectory2/fooName-barName-bazName2.md",
        "priority": "true",
        "slug":"foo-Name_bar-Name_baz-Name2"
    },
    ...
    ]
