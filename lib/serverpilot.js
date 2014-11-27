var rest = require('restler');
var pkg = require('../package.json');

function isEmptyObject(obj) {
    return !Object.keys(obj).length;
}

var ServerPilot = function( options ) {
    if ( ! options || isEmptyObject(options) ) {
        throw new Error('You must send an options object');
    }

    if ( ! options.clientId.length || ! options.apiKey.length ) {
        throw new Error('You must define a Client ID and API Key');
    }

    this.VERSION = pkg.version;
    this.options = options;
    this.baseURL = 'https://api.serverpilot.io/v1';
}

module.exports = ServerPilot;

/**
 * Utility GET function
 * @param  {string}   url      URL endpoint to hit
 * @param  {Function} callback Callback
 * @return {void}
 */
ServerPilot.prototype.get = function( url, callback ) {

    if ( typeof callback !== 'function' ) {
        throw new Error('Valid callback function required');
    }

    if ( url.charAt(0) == '/' ) {
        url = this.baseURL + url;
    }

    rest.get( url, {
        username: this.options.clientId,
        password: this.options.apiKey
    }).on('success', function(result, response) {
        callback(null, result);
    }).on('fail', function(err, response) {
        var error = new Error(err.error.message);
        callback(error, null);
    });
}

/**
 * Utility POST function
 * @param  {string}   url      URL endpoint to hit
 * @param  {Function} callback Callback
 * @return {void}
 */
ServerPilot.prototype.post = function( url, data, callback ) {

    if ( typeof callback !== 'function' ) {
        throw new Error('Valid callback function required');
    }

    if ( url.charAt(0) == '/' ) {
        url = this.baseURL + url;
    }

    console.log(JSON.stringify(data));

    rest.post( url, {
        username: this.options.clientId,
        password: this.options.apiKey,
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(data)
    }).on('success', function(result, response) {
        callback(null, result);
    }).on('fail', function(err, response) {
        var error = new Error(err.error.message);
        callback(error, null);
    });
}

/**
 * Create a server
 * @param  {string}   name     Name of the server
 * @param  {Function} callback Callback
 * @return {void}
 */
ServerPilot.prototype.createServer = function( name, callback ) {
    if ( ! name || ! name.length ) {
        throw new Error('You must specify a name for the server');
    }

    // TODO: Validate name of server
    // The nickname of the Server. Length must be between 1 and 255 characters. Characters can be of lowercase ascii letters, digits, a period, or a dash ('abcdefghijklmnopqrstuvwxyz0123456789-'), but must start with a lowercase ascii letter and end with either a lowercase ascii letter or digit. www.store2 is a valid name, while .org.company nor www.blog- are.

    this.post('/servers', {
        name: name
    }, function(err, response) {
        if ( err ) {
            callback(err, null);
        } else {
            callback(null, response);
        }
    })
}

/**
 * Get a single app
 * @param  {string}   id       Server ID
 * @param  {Function} callback Callback
 * @return {void}
 */
ServerPilot.prototype.getApp = function( id, callback ) {
    this.get('/apps/' + id, function(err, response) {
        if ( err ) {
            callback(err, null);
        } else {
            callback(null, response);
        }
    });
};

/**
 * Get all apps
 * @param  {Function} callback Callback
 * @return {void}
 */
ServerPilot.prototype.getApps = function( callback ) {
    this.get('/apps', function(err, response) {
        if ( err ) {
            callback(err, null);
        } else {
            callback(null, response);
        }
    });
};

/**
 * Get a single server
 * @param  {string}   id       Server ID
 * @param  {Function} callback Callback
 * @return {void}
 */
ServerPilot.prototype.getServer = function( id, callback ) {
    this.get('/servers/' + id, function(err, response) {
        if ( err ) {
            callback(err, null);
        } else {
            callback(null, response);
        }
    });
};

/**
 * Get all servers
 * @param  {Function} callback Callback
 * @return {void}
 */
ServerPilot.prototype.getServers = function( callback ) {
    this.get('/servers', function(err, response) {
        if ( err ) {
            callback(err, null);
        } else {
            callback(null, response);
        }
    });
};
