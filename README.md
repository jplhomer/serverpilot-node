Node.JS Wrapper for the ServerPilot API
================

This is a simple Node.JS wrapper to communicate with the [ServerPilot](http://serverpilot.io) API.

Check out the [official ServerPilot API documentation](https://github.com/ServerPilot/API) for more information on using the ServerPilot API.

## Installation

To start making calls to ServerPilot from Node.JS, install it with [NPM](http://npmjs.org):

```sh
$ npm install serverpilot --save
```

## Getting Started

Log into your [ServerPilot](http://serverpilot.io) account, navigate to the Account section, and click API. Generate an API Key.

### Example: List all of your servers

See the below example to list all of your servers.

```js
var ServerPilot = require('../lib/serverpilot');
var sp = new ServerPilot({
    clientId: <YOUR CLIENT ID>,
    apiKey: <YOUR API KEY>
});

// List out servers
var servers = sp.getServers( function(err, data) {
    if ( err ) { console.log( err.message ); }

    // This is where you would do something with the data
    console.log(data.data);
});
```

See the examples folder for more.

## Unit Tests

To run tests, ensure you have Mocha installed on your system.

```sh
$ npm install -g mocha
```

Then run all the tests using this handy shortcut:

```sh
$ npm test
```

Or run an individual test like this:

```sh
$ mocha test/apps.test.js -t 15000
```

## License

MIT. See the License file for more info.