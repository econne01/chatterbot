chatterbot
==========

A simple chat bot attempt

Installation
==========
Clone git project

Running
==========
1. Get Setup
```
npm build
npm install
```
2. Run Chatterbot
```
npm start
```

Troubleshooting:
* If you see this error while trying `npm start`
```
Error: EACCES: permission denied, open '~/.config/configstore/update-notifier-nodemon.json'
```
Follow steps from [nodemon issue](https://github.com/remy/nodemon/issues/254) and chown of that directory.

To combine all js files (ie, to build single js file)
`./node_modules/grunt-cli/bin/grunt concat`
