var rest = require('restler');
var pkg = require('../package.json');

var ServerPilot = function( options ) {
    // TODO: Check to make sure options are there.

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
    }).on('complete', function(data) {
        callback(data);
    });
}

/**
 * Get all apps
 * @param  {Function} callback Callback
 * @return {void}
 */
ServerPilot.prototype.getApps = function( callback ) {
    this.get('/apps', function(response) {
        callback(response);
    });
};

/**
 * Get a single server
 * @param  {string}   id       Server ID
 * @param  {Function} callback Callback
 * @return {void}
 */
ServerPilot.prototype.getServer = function( id, callback ) {
    this.get('/servers/' + id, function(response) {
        callback(response);
    });
};

/**
 * Get all servers
 * @param  {Function} callback Callback
 * @return {void}
 */
ServerPilot.prototype.getServers = function( callback ) {
    this.get('/servers', function(response) {
        callback(response);
    });
};
