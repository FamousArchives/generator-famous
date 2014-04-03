# generator-famous

> [Yeoman](http://yeoman.io) generator


## Getting Started

### What is Yeoman?

Trick question. It's not a thing. It's this guy:

![](http://i.imgur.com/JHaAlBJ.png)

Basically, he wears a top hat, lives in your computer, and waits for you to tell him what kind of application you wish to create.

Not every new computer comes with a Yeoman pre-installed. He lives in the [npm](https://npmjs.org) package repository. You only have to ask for him once, then he packs up and moves into your hard drive. *Make sure you clean up, he likes new and shiny things.*

```
$ npm install -g yo
```

### Yeoman Generators

Yeoman travels light. He didn't pack any generators when he moved in. You can think of a generator like a plug-in. You get to choose what type of application you wish to create, such as a Backbone application or even a Chrome extension.

To install generator-famous from npm, clone this repo then link:

```
$ git clone git@github.com:Famous/generator-famous.git
$ cd generator-famous
$ npm link
```

Finally, initiate the generator in an empty directory that you would like to have your project in:

```
$ mkdir moobyApp
$ cd moobyApp
$ yo famous
```

### Getting To Know Yeoman

Yeoman has a heart of gold. He's a person with feelings and opinions, but he's very easy to work with. If you think he's too opinionated, he can be easily convinced.

If you'd like to get to know Yeoman better and meet some of his friends, [Grunt](http://gruntjs.com) and [Bower](http://bower.io), check out the complete [Getting Started Guide](https://github.com/yeoman/yeoman/wiki/Getting-Started).

###Be Aware of .yo-rc.json

When this generator scaffolds out a project it generates a .yo-rc.json file.  This file allows yo to run again in the same directory without prompting you for information.  This is particularly useful if you want to update your project to be based on the latest version of generator-famous.  This can be a problem though, as yo searches up the file tree to check if there is a version of .yo-rc.json.   So if you for example accidentally ran ```yo famous``` from a directory that was not empty, you might end up leaving the .yo-rc.json in the directory above where you would like to be.  The result will be then when running yo in an empty directory afterwards your files will never end up in the folder you are expecting them to.

PHEW

TLDR: If ```yo famous``` is putting things in parent directories check for an orphaned .yo-rc.json

## License

MPL V2.0