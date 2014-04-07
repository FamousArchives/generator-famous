# [famous](http://famo.us) generator

> Use this [yeoman](http://yeoman.io) generator to seed your next famous project... automation ftw!


## Getting Started

### What is Yeoman?

Trick question. It's not a thing. It's this guy:

![yeoman](http://i.imgur.com/JHaAlBJ.png)

Basically, he wears a top hat, lives in your computer, and waits for you to tell him what kind of application you wish to create.

Not every new computer comes with a Yeoman pre-installed. He lives in the [npm](https://npmjs.org) package repository. You only have to ask for him once, then he packs up and moves into your hard drive. *Make sure you clean up, he likes new and shiny things.*

```
$ npm install -g yo
```

### How to Install

To install ```generator-famous``` from npm simply run the command

```
$ npm install -g generator-famous
```

Make a directory to put your app into and hop in

```
$ mkdir moobyApp   # mkdir makes a new directory
$ cd moobyApp      # cd is short for change directory
$ yo famous        # Let's call the yeoman to make us famous
```

### Features

* Development server with live-reload
* Real time linting with eslint and jscs
* Automatically inject bower-installed vendor code into require.js
* 

### Generators

Available generators:

* [famous](#app) (a.k.a. [famous:app](#app))
* [famous:view](#view)

**These generators must be run from the root directory of you project**

###App

Description:
    Creates a default Famo.us app
    
Example:
    
yo famous
    
    This will create:
        README.md
        Gruntfile.js
        bower.json
        package.json
        
        .bowerrc
        .editorconfig
        .edlint.json
        .jscs.json
        
        app/index.html
        app/src/main.js
        app/src/requireConfig.js
        app/src/content/images/famous_symbol_transparent.png
        app/src/styles/app.css

###View

Description:
    Creates a new View
    
Example:
    
yo famous:view MyView
    
    This will create:
        app/src/views/MyView.js
        
    
yo famous:view Some/Path/OtherView
    
    This will create:
        app/src/views/Some/Path/OtherView.js

### Getting To Know Yeoman

If you'd like to get to know Yeoman better and meet some of his friends, [Grunt](http://gruntjs.com) and [Bower](http://bower.io), check out the complete [Getting Started Guide](https://github.com/yeoman/yeoman/wiki/Getting-Started).

###Be Aware of .yo-rc.json

When this generator scaffolds out a project it generates a .yo-rc.json file.  This file allows yo to run again in the same directory without prompting you for information.  This is particularly useful if you want to update your project to be based on the latest version of generator-famous.  This can be a problem though, as yo searches up the file tree to check if there is a version of .yo-rc.json.   So if you for example accidentally ran ```yo famous``` from a directory that was not empty, you might end up leaving the .yo-rc.json in the directory above where you would like to be.  The result will be then when running yo in an empty directory afterwards your files will never end up in the folder you are expecting them to.

PHEW

TLDR: If ```yo famous``` is putting things in parent directories check for an orphaned .yo-rc.json

### Shout outs

This generator could not have been made possible without the great work done on [generator-webapp](https://github.com/yeoman/generator-webapp), [generator-angular](https://github.com/yeoman/generator-angular/blob/master/readme.md), and [generator-assemble](https://github.com/assemble/generator-assemble)

## License

MPL V2.0