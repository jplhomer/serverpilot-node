Node.JS Wrapper for the ServerPilot API
================

[![Build Status](https://travis-ci.org/jplhomer/serverpilot-node.svg?branch=master)](https://travis-ci.org/jplhomer/serverpilot-node)

This is a simple Node.JS wrapper to communicate with the [ServerPilot](http://serverpilot.io) API.

Check out the [official ServerPilot API documentation](https://github.com/ServerPilot/API) for more information on using the ServerPilot API.

## Installation

To start making calls to ServerPilot from Node.JS, install it with [NPM](http://npmjs.org):

```sh
$ npm install serverpilot --save
```

## Getting Started

Log into your [ServerPilot](http://serverpilot.io) account, navigate to the Account section, and click API. Generate an API Key.

Create the ServerPilot client as follows:

```js
var ServerPilot = require('../lib/serverpilot');
var sp = new ServerPilot({
    clientId: <YOUR CLIENT ID>,
    apiKey: <YOUR API KEY>
});
```

## Usage

### Servers

Servers are Ubuntu 12.04 or 14.04 machines that are managed by ServerPilot.

Every App, Database, and System User is related to a Server. By default, all
Servers will have a `serverpilot` System User.

[Learn more about what is involved in creating a server](https://github.com/ServerPilot/API#connect-a-new-server).

```js
// List servers
sp.getServers( function(err, data) {
    if ( err ) { console.log( err.message ); }

    // This is where you would do something with the data
    console.log(data.data);
});

// Get a single server
var serverId = '123456';
sp.getServers(serverId, function(err, data) {});

// Create a server
var serverName = 'newserver';
sp.createServer(serverName, function(err, data){});

// Update a server
sp.updateServer({
    serverId: serverId,
    firewall: firewall, // Boolean
    autoupdates: autoupdates // Boolean
},function(err, data) {});

// Delete a server
sp.deleteServer(serverId, function(err, data) {} );
```

### System Users

System Users are Linux user accounts that ServerPilot creates on your Server.
Every App belongs to and runs as one of these System Users. You can log in to
your Server as a System User via SSH to deploy an App or view an App's log
files.

By default, ServerPilot creates the `serverpilot` System User.

The home directory of each System User created by ServerPilot is

```
/srv/users/USERNAME
```

Under the System User's home directory are additional directories:

  * `apps` — each app has its own directory under here.
  * `log` — each app has its log files here.

**You must be a paid user** to add/edit system users. An error will be
thrown if you are on the free plan.

```js
// List system users
sp.getSysUsers(function(err, data) {});

// Get a single system user
var sysUserId = 'test123'
sp.getSysUser(sysUserId, function(err, data) {} );

// Create a system user
sp.createSysUser({
    serverid: serverId,
    name: name,
    password: password
}, function(err, data) {} );

// Update a system user's password
sp.updateSysUser({
    sysUserId: sysUserId,
    password: 'test45678' // Must be at least 8 characters
}, function(err, data) {});

// Delete a system user
sp.deleteSysUser(sysUserId, function(err, data) {});
```

### Apps

Apps are your web applications. Sometimes people call apps "websites".

ServerPilot currently supports PHP 5.4, 5.5 and 5.6 apps.

ServerPilot configures your servers with Nginx as the public-facing webserver.
Nginx serves static files and all other requests are proxied to Apache 2.4 so
that you can use .htaccess files. PHP is configured to run via FPM. Each app
can have multiple MySQL databases.

The web root directory for each app is:

```
/srv/users/serverpilot/apps/{APPNAME}/public
```

ServerPilot does not manage DNS for you. In order for you to access your apps
by their domain name, you must make the appropriate changes in your domain's
DNS zone so that your domain name resolves to your server's IP address. You can
do this where you currently manage DNS for your domain.

```js
// List apps
sp.getApps(function(err, data) {});

// Get a single app
var appId = 'test123';
sp.getApp(appId, function(err, data) {});

// Create an app
sp.createApp({
  name: 'testapp',
  sysuserid: 'abc123',
  runtime: 'php5.5',
  domains: ['testapp.com','www.testapp.com']
}, function(err, data) {});

// Update an app's runtime or domains
sp.updateApp({
  appId: appId,
  runtime: 'php5.6',
  domains: ['mail.google.com','google.com']
}, function(err, data) {});

// Delete an app
sp.deleteApp(appId, function(err, data) {});

// Add SSL to an app
sp.addSSL({
    appId: appId,
    key: sslKey, // Text version of your key
    cert: sslCert, // Text version of your cert
    cacerts: null // Any CA Certs. Null is OK.
}, function(err, data) {});

// Delete SSL from an app
sp.deleteSSL(appId, function(err, data) {});
```

### Databases

Databases are MySQL databases. Each Database is associated with an App.

There is only one Database User for each Database.

```js
// List databases
sp.getDatabases(function(err, data) {});

// Get a single database
var databaseId = 'test1234';
sp.getDatabase(databaseId, function(err, data) {});

// Create a database
sp.createDatabase({
    appid: appId,
    name: databaseName,
    user: {
        name: databaseUserName,
        password: databaseUserPass
    }
}, function(err, data) {});

// Update a database user's password
sp.updateDatabase({
    databaseId: databaseId,
    user: {
        id: databaseUserId,
        password: 'mynewpassword'
    }
}, function(err, data) {});

// Delete a database
sp.deleteDatabase(databaseId, function(err, data) {});
```

### Actions

Actions are a record of work done on ServerPilot resources. These can be things
like the creation of an App, deploying SSL, deleting an old Database, etc.

All methods that modify a resource will have an `actionid` top-level key in the
JSON response. The `actionid` can be used to track the `status` of the Action.

**Possible values of Action `status`**

| Status    | Description
| --------- | -----------
| `success` | Action was completed successfully.
| `open`    | Action has not completed yet.
| `error`   | Action has completed but there were errors.

```js
var actionId = 'test1234';
sp.getActionStatus(actionId, function(err, data) {});
```


## Unit Tests

To run tests, ensure you have Mocha installed on your system.

```sh
$ npm install -g mocha
```

Next, set your environmental variables like this:

```sh
$ export SP_CLIENT_ID=YOURCLIENTID SP_API_KEY=YOURAPIKEY
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
