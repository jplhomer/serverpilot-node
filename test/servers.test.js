var should = require('should');
var ServerPilot = require('..');
var sp;
var serverId, apikey, actionid;
var serverName = 'testserver' + process.version;
var firewall = true;
var autoupdates = true;

function catchServerException(name) {
    return function() {
        try {
            sp.createServer(name, function(){} );
        } catch (e) {
            return;
        }
        throw new Error('No error throw by class with name: ' + name);
    };
}

function catchUpdateServerException(options) {
    return function() {
        try {
            sp.updateServer(options, function() {} );
        } catch (e) {
            return;
        }
        throw new Error('No error throw by class with options: ' + JSON.stringify(options));
    };
}

function catchDeleteServerException(id) {
    return function() {
        try {
            sp.deleteServer(id, function() {} );
        } catch (e) {
            return;
        }
        throw new Error('No error throw by class with id: ' + id);
    };
}

describe('Servers', function() {

    before(function() {
        sp = new ServerPilot({
            clientId: process.env.SP_CLIENT_ID,
            apiKey: process.env.SP_API_KEY
        });
    });

    describe('.getServers()', function() {
        it('should get all servers', function(done) {
            sp.getServers(function(err, data) {
                if ( err ) { return done(err); }
                data.should.be.an.Object;
                data.data.should.be.an.Object;
                done();
            });
        });
    });

    describe('.createServer(name)', function() {
        it('should throw when no options passed', catchServerException());
        it('should throw when empty options', catchServerException(''));
        it('should create a server', function(done) {
            sp.createServer(serverName, function(err, data) {
                if ( err ) { return done(err); }

                data.actionid.should.be.a.String;
                data.data.should.be.an.Object;
                data.data.name.should.eql(serverName);

                // Set data for later tasks
                actionId = data.actionid;
                serverId = data.data.id;
                apiKey = data.data.apikey;

                done();
            })
        })
    })

    describe('.getServer(id)', function() {
        it('should get a server', function(done) {
            sp.getServer( serverId, function(err, data) {
                if ( err ) { done(err); }
                data.should.be.an.Object;
                data.data.should.be.an.Object;
                done();
            });
        });
    });

    describe('.updateServer(options)', function() {
        it('should throw when no options are passed', catchUpdateServerException());
        it('should throw when empty options object passed', catchUpdateServerException({}));
        it('should throw when options object does not contain: serverId', catchUpdateServerException({ firewall: true }));
        it('should throw when option values are not boolean: firewall or autoupdates', catchUpdateServerException({ serverId: serverId, firewall: '', autoupdates: '' }));
        it('should update the server', function(done) {
            var updateOptions = {
                serverId: serverId,
                firewall: firewall,
                autoupdates: autoupdates
            };

            sp.updateServer(updateOptions, function(err, data) {
                if (err) { return done(err); }

                // Match up known things about our server
                data.data.id.should.eql(serverId);
                data.data.autoupdates.should.eql(autoupdates);
                data.data.firewall.should.eql(firewall);

                done();
            });
        });
    });

    describe('.deleteServer(id)', function() {
        it('should throw when no id is passed', catchDeleteServerException());
        it('should delete server', function(done) {
            sp.deleteServer(serverId, function(err, data) {
                if (err) { return done(err); }

                // Check to see that the server doesn't exist anymore
                sp.getServers(function(err, data) {
                    if (err) { return done(err); }

                    var servers = data.data;
                    servers.should.not.containDeep({id: serverId});
                    done();
                })
            })
        })
    })

});