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
        throw "FAIL: INVALID CALLBACK.";
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
        callback(err, null);
    });
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
