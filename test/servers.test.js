var should = require('should');
var ServerPilot = require('..');
var serverId, apikey, actionid;
var serverName = 'testserver';

function catchServerException(options) {
    return function () {
        try {
            sp.createServer(options, function(){} );
        } catch (e) {
            return;
        }
        throw new Error('No error throw by class with options: ' + JSON.stringify(options));
    };
}

describe('Servers', function() {
    var sp;

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
});