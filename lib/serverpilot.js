'use strict';

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
};

module.exports = ServerPilot;

/**
 * UTILITIES
 */

/**
 * Utility delete function
 * @param  {string}   url      URL
 * @param  {Function} callback Callback
 * @return {void}
 */
ServerPilot.prototype._del = function( url, callback ) {
    if ( typeof callback !== 'function' ) {
        throw new Error('Valid callback function required');
    }

    if ( url.charAt(0) == '/' ) {
        url = this.baseURL + url;
    }

    rest.del( url, {
        username: this.options.clientId,
        password: this.options.apiKey
    }).on('success', function(result, response) {
        callback(null, result);
    }).on('fail', function(err, response) {
        var error = new Error(err.error.message);
        callback(error, null);
    });
};

/**
 * Utility GET function
 * @param  {string}   url      URL endpoint to hit
 * @param  {Function} callback Callback
 * @return {void}
 */
ServerPilot.prototype._get = function( url, callback ) {

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
};

/**
 * Utility function to handle responses
 * @param  {mixed}   err       Possible error object
 * @param  {mixed}   response  Possible response
 * @param  {Function} callback Callback
 * @return {void}
 */
ServerPilot.prototype._handleResponse = function( err, response, callback ) {
    if ( err ) {
        callback(err, null);
    } else {
        callback(null, response);
    }
};

/**
 * Utility POST function
 * @param  {string}   url      URL endpoint to hit
 * @param  {Function} callback Callback
 * @return {void}
 */
ServerPilot.prototype._post = function( url, data, callback ) {

    if ( typeof callback !== 'function' ) {
        throw new Error('Valid callback function required');
    }

    if ( url.charAt(0) == '/' ) {
        url = this.baseURL + url;
    }

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
};

/**
 * APPS
 */

/**
 * Create an app
 * @param  {object}   options  Options
 * @param  {Function} callback Callback
 * @return {void}
 */
ServerPilot.prototype.createApp = function( options, callback ) {
    if ( ! options || isEmptyObject(options) ) {
        throw new Error('You must pass options for: name, runtime, sysuserid');
    }

    if ( ! ('name' in options)
        || ! ('sysuserid' in options)
        || ! ('runtime' in options) ) {
        throw new Error('You must pass options for: name, runtime, sysuserid');
    }

    this._post('/apps', options, function(err, response) {
        this._handleResponse(err, response, callback);
    }.bind(this));
};

/**
 * Delete an app
 * @param  {string}   id       App ID
 * @param  {Function} callback Callback
 * @return {void}
 */
ServerPilot.prototype.deleteApp = function( id, callback ) {
    if ( ! id || ! id.length ) {
        throw new Error('You must pass an app id');
    }

    this._del('/apps/' + id, function(err, response) {
        this._handleResponse(err, response, callback);
    }.bind(this));
};

/**
 * Get a single app
 * @param  {string}   id       Server ID
 * @param  {Function} callback Callback
 * @return {void}
 */
ServerPilot.prototype.getApp = function( id, callback ) {
    this._get('/apps/' + id, function(err, response) {
        this._handleResponse(err, response, callback);
    }.bind(this));
};

/**
 * Get all apps
 * @param  {Function} callback Callback
 * @return {void}
 */
ServerPilot.prototype.getApps = function( callback ) {
    this._get('/apps', function(err, response) {
        this._handleResponse(err, response, callback);
    }.bind(this));
};

/**
 * SERVERS
 */

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

    this._post('/servers', {
        name: name
    }, function(err, response) {
        this._handleResponse(err, response, callback);
    }.bind(this));
};

/**
 * Detete a server
 * @param  {string}   id       Server ID
 * @param  {Function} callback Callback
 * @return {void}
 */
ServerPilot.prototype.deleteServer = function( id, callback ) {
    if ( ! id || ! id.length ) {
        throw new Error('You must pass a valid Server ID');
    }

    this._del('/servers/' + id, function(err, response) {
        this._handleResponse(err, response, callback);
    }.bind(this));
};

/**
 * Get a single server
 * @param  {string}   id       Server ID
 * @param  {Function} callback Callback
 * @return {void}
 */
ServerPilot.prototype.getServer = function( id, callback ) {
    this._get('/servers/' + id, function(err, response) {
        this._handleResponse(err, response, callback);
    }.bind(this));
};

/**
 * Get all servers
 * @param  {Function} callback Callback
 * @return {void}
 */
ServerPilot.prototype.getServers = function( callback ) {
    this._get('/servers', function(err, response) {
        this._handleResponse(err, response, callback);
    }.bind(this));
};

/**
 * Update a server
 * @param  {object}   options  Options object
 * @param  {Function} callback Callback
 * @return {void}
 */
ServerPilot.prototype.updateServer = function( options, callback ) {
    if ( ! options || isEmptyObject(options) ) {
        throw new Error('You must pass a Server ID and one of: autoupdates, firewall');
    }

    if ( ! ('serverId' in options) || ! options.serverId.length ) {
        throw new Error('You must pass a valid Server ID');
    }

    if ( ! ('autoupdates' in options) && ! ('firewall' in options) ) {
        throw new Error('You must pass in arguments for at least autoupdates or firewall');
    }

    if ( ! ( ('autoupdates' in options) && typeof options.autoupdates === 'boolean' )
        && ! ( ('firewall' in options) && typeof options.firewall === 'boolean' ) ) {
        throw new Error('Arguments for autoupdates and firewall must be boolean');
    }

    var serverId = options.serverId;
    delete(options.serverId);

    this._post('/servers/' + serverId, options, function(err, response) {
        this._handleResponse(err, response, callback);
    }.bind(this));
};

/**
 * SYSUSERS
 */

ServerPilot.prototype.getSysUsers = function( callback ) {
    this._get('/sysusers', function(err, response) {
        this._handleResponse(err, response, callback);
    }.bind(this));
};