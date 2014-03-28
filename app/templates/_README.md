______                               ______                
|  ___|                              | ___ \               
| |_ __ _ _ __ ___   ___  _   _ ___  | |_/ / __ _ ___  ___ 
|  _/ _` | '_ ` _ \ / _ \| | | / __| | ___ \/ _` / __|/ _ \
| || (_| | | | | | | (_) | |_| \\__ \ | |_/ / (_| \\__ \  __/
\\_| \\__,_|_| |_| |_|\\___(_)__,_|___/ \\____/ \\__,_|___/\\___|
                                                           
                                                           
Welcome to the Famous Base

##Dependencies
It is actually quite simple really

First make sure you have node.js and grunt-cli installed

```
brew install node
npm install -g grunt-cli
```

If you are installing node for the fist time you will most likely need to add npm to your path

```
$ expot PATH="/usr/localshare/npm/bin:$PATH"
```

You will probably want to add that to you .bash_profile.  I'll assume if you are using any other shell that you know what you are doing already :P

##Getting Started

```
npm install
```

That's it!!!

##Running the Development Server

Simply run ```grunt serve``` and you will start a local development server and open a browser.  Watch tasks will be running, and your browser will be automatically refreshed whenever a file in the repo changes.