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

    if ( ! options.clientId || ! options.apiKey ) {
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
 * ACTIONS
 */

/**
 * Get the status of an action, like a database create or app create
 * @param  {string}   id       ID of the action
 * @param  {Function} callback Callback
 * @return {void}
 */
ServerPilot.prototype.getActionStatus = function( id, callback ) {
    if ( ! id ) {
        throw new Error('You must provide an ID for the action');
    }

    this._get('/actions/' + id, function(err, response) {
        this._handleResponse(err, response, callback);
    }.bind(this));
};

/**
 * APPS
 */

/**
 * Add an SSL Certificate to an app
 * @param {object}   options  Options
 * @param {Function} callback Callback
 */
ServerPilot.prototype.addSSL = function( options, callback ) {
    if ( ! options || isEmptyObject(options) ) {
        throw new Error('You must provide an SSL Key, Certificate, and CA Certificate');
    }

    if ( ! options.appId ) {
        throw new Error('You must provide an App ID');
    }

    if ( ! options.key ) {
        throw new Error('You must provide an SSL Key');
    }

    if ( ! options.cert ) {
        throw new Error('You must provide an SSL Certificate');
    }

    // Make sure it's set to at least null
    if ( ! options.cacerts ) {
        options.cacerts = null;
    }

    var id = options.appId;
    delete(options.appId);

    this._post('/apps/' + id + '/ssl', options, function(err, response) {
        this._handleResponse(err, response, callback);
    }.bind(this));
};

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
 * Delete SSL from an app
 * @param  {string}   id       App ID
 * @param  {Function} callback Callback
 * @return {void}
 */
ServerPilot.prototype.deleteSSL = function( id, callback ) {
    if ( ! id ) {
        throw new Error('You must pass an app id');
    }

    this._del('/apps/' + id + '/ssl', function(err, response) {
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
 * Update an app
 * @param  {object}   options  Options
 * @param  {Function} callback Callback
 * @return {void}
 */
ServerPilot.prototype.updateApp = function( options, callback ) {
    if ( ! options || isEmptyObject(options) ) {
        throw new Error('You must pass an options object');
    }

    if ( ! ('appId' in options) ) {
        throw new Error('You must pass a valid App ID');
    }

    if ( ! ('runtime' in options) && ! ('domains' in options) ) {
        throw new Error('You must pass at least one of the following: runtime, domains');
    }

    var appId = options.appId;
    delete(options.appId);

    this._post('/apps/' + appId, options, function(err, response) {
        this._handleResponse(err, response, callback);
    }.bind(this));
}

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

/**
 * Delete a system user
 * @param  {string}   id       System User ID
 * @param  {Function} callback Callback
 * @return {void}
 */
ServerPilot.prototype.deleteSysUser = function( id, callback ) {
    if ( ! id ) {
        throw new Error('You must provide a System User ID');
    }

    this._del('/sysusers/' + id, function(err, response) {
        this._handleResponse(err, response, callback);
    }.bind(this));
};

/**
 * Add a system user
 * @param {object}   options  Options
 * @param {Function} callback Callback
 */
ServerPilot.prototype.createSysUser = function( options, callback ) {
    if ( ! options || isEmptyObject(options) ) {
        throw new Error('You must pass valid options');
    }

    if ( ! ('name' in options) ) {
        throw new Error('You must specify a Name');
    }

    if ( ! ('serverid' in options) ) {
        throw new Error('You must specify a Server ID');
    }

    // TODO:
    // Name can only contain the characters abcdefghijklmnopqrstuvwxyz0123456789-

    this._post('/sysusers', options, function(err, response) {
        this._handleResponse(err, response, callback);
    }.bind(this));
};

/**
 * Get a single system user
 * @param  {string}   id       SysUser ID
 * @param  {Function} callback Callback
 * @return {ServerPilot}
 */
ServerPilot.prototype.getSysUser = function( id, callback ) {
    if ( ! id ) {
        throw new Error('You must provide a System User ID');
    }

    this._get('/sysusers/' + id, function(err, response) {
        this._handleResponse(err, response, callback);
    }.bind(this));
};

/**
 * Get system users
 * @param  {Function} callback callback
 * @return {void}
 */
ServerPilot.prototype.getSysUsers = function( callback ) {
    this._get('/sysusers', function(err, response) {
        this._handleResponse(err, response, callback);
    }.bind(this));
};

/**
 * Update a system user
 * @param  {object}   options  System User ID and password
 * @param  {Function} callback Callback
 * @return {void}
 */
ServerPilot.prototype.updateSysUser = function( options, callback ) {
    if ( ! options ) {
        throw new Error('You must provide a password and a System User ID to update');
    }

    if ( isEmptyObject(options) ) {
        throw new Error('You must provide a password and a System User ID to update');
    }

    if ( ! options.password ) {
        throw new Error('You must provide a password to update');
    }

    if ( options.password.length < 8 ) {
        throw new Error('Password must be at least 8 characters');
    }

    if ( ! options.sysUserId ) {
        throw new Error('You must provide a System User ID to update');
    }

    var id = options.sysUserId;
    delete(options.sysUserId);

    this._post('/sysusers/' + id, options, function(err, response) {
        this._handleResponse(err, response, callback);
    }.bind(this));
};

/**
 * DATABASES
 */

/**
 * Create a database
 * @param  {object}   options  Options
 * @param  {Function} callback Callback
 * @return {void}
 */
ServerPilot.prototype.createDatabase = function( options, callback ) {
    if ( ! options ) {
        throw new Error('You must provide options');
    }

    if ( ! options.appid ) {
        throw new Error('You must provide an App ID');
    }

    if ( ! options.name ) {
        throw new Error('You must provide a Database Name');
    }

    if ( ! options.user ) {
        throw new Error('You must provide database user information');
    }

    if ( ! options.user.name ) {
        throw new Error('You must provide a database user name');
    }

    if ( ! options.user.password ) {
        throw new Error('You must provide a database user password');
    }

    this._post('/dbs', options, function(err, response) {
        this._handleResponse(err, response, callback);
    }.bind(this));
};

/**
 * Delete a database
 * @param  {string}   id       Database ID
 * @param  {Function} callback Callback
 * @return {void}
 */
ServerPilot.prototype.deleteDatabase = function( id, callback ) {
    if ( ! id ) {
        throw new Error('You must provide a database ID');
    }

    this._del('/dbs/' + id, function(err, response) {
        this._handleResponse(err, response, callback);
    }.bind(this));
};

/**
 * Get a database
 * @param  {string}   id       Database ID
 * @param  {Function} callback Callback
 * @return {void}
 */
ServerPilot.prototype.getDatabase = function( id, callback ) {
    if ( ! id ) {
        throw new Error('You must pass a database ID');
    }

    this._get('/dbs/' + id, function(err, response) {
        this._handleResponse(err, response, callback);
    }.bind(this));
};

/**
 * Get all databases
 * @param  {Function} callback Callback
 * @return {void}
 */
ServerPilot.prototype.getDatabases = function( callback ) {
    this._get('/dbs', function(err, response) {
        this._handleResponse(err, response, callback);
    }.bind(this));
};

/**
 * Update a database with a new password for a user
 * @param  {object}   options  Options
 * @param  {Function} callback Callback
 * @return {void}
 */
ServerPilot.prototype.updateDatabase = function( options, callback ) {
    if ( ! options ) {
        throw new Error('You must pass options');
    }

    if ( ! options.databaseId ) {
        throw new Error('You must provide a database ID');
    }

    if ( ! options.user ) {
        throw new Error('You must provide a database user name and a new password');
    }

    if ( ! options.user.id ) {
        throw new Error('You must provide a database user ID');
    }

    if ( ! options.user.password ) {
        throw new Error('You must provide a new password for the database user');
    }

    var id = options.databaseId;
    delete(options.databaseId);

    this._post('/dbs/' + id, options, function(err, response) {
        this._handleResponse(err, response, callback);
    }.bind(this));
};