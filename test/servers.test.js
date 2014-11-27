var should = require('should');
var ServerPilot = require('..');
var serverId = 'DIAo3w871vFkwHPy';

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
                if ( err ) { done(err); }
                data.should.be.an.Object;
                data.data.should.be.an.Object;
                done();
            });
        });
    });

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