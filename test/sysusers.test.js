var should = require('should');
var ServerPilot = require('..');

describe('Servers', function() {
    var sp;

    before(function() {
        sp = new ServerPilot({
            clientId: process.env.SP_CLIENT_ID,
            apiKey: process.env.SP_API_KEY
        });
    });

    describe('.getSysUsers()', function() {
        it('should get all sysusers', function(done) {
            sp.getSysUsers(function(err, data) {
                if ( err ) { return done(err); }
                data.should.be.an.Object;
                data.data.should.be.an.Object;
                done();
            });
        });
    });
});