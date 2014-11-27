var should = require('should');
var ServerPilot = require('..');
var sp;
var serverId;
var name = 'testuser';
var password = '#1password';

function catchAddSysUser(opts) {
    return function() {
        try {
            sp.addSysUser(opts, function() {} );
        } catch(e) {
            return;
        }
        throw new Error('No error throw by class for options: ' + JSON.stringify(opts));
    };
}

describe('System Users', function() {

    before(function(done) {
        sp = new ServerPilot({
            clientId: process.env.SP_CLIENT_ID,
            apiKey: process.env.SP_API_KEY
        });

        // Create a dummy server
        sp.createServer('testserver', function(err, data) {
            serverId = data.data.id;
            done();
        })
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

    describe('.addSysUser()', function() {
        it('should throw when no options passed', catchAddSysUser());
        it('should throw when empty options passed', catchAddSysUser({}));
        it('should throw when no serverid passed', catchAddSysUser({ name: name }));
        it('should throw when no name passed', catchAddSysUser({ serverid: serverId }));
        // it('should throw when invalid name is passed', catchAddSysUser({ name: 'Test User', serverid: serverId }));
        it('should add sysuser', function(done) {
            var opts = {
                serverid: serverId,
                name: name,
                password: password
            };

            sp.addSysUser(opts, function(err, data) {
                if (err) { return done(err); }

                data.data.name.should.eql(opts.name);
                data.data.serverid.should.eql(opts.serverid);
                done();
            });
        });
    });

    after(function(done) {
        // Kill dummy server
        sp.deleteServer(serverId, function(err, data) {
            done();
        });
    });
});