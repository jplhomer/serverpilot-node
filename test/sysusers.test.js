var should = require('should');
var ServerPilot = require('..');
var sp;
var serverId;
var sysUserId;
var name = 'testuser';
var password = '#1password';

function catchCreateSysUser(opts) {
    return function() {
        try {
            sp.addSysUser(opts, function() {} );
        } catch(e) {
            return;
        }
        throw new Error('No error throw by class for options: ' + JSON.stringify(opts));
    };
}

function catchGetSysUser(id) {
    return function() {
        try {
            sp.getSysUser(id, function() {} );
        } catch(e) {
            return;
        }
        throw new Error('No error throw by class for id: ' + id);
    };
}

function catchDeleteSysUser(id) {
    return function() {
        try {
            sp.deleteSysUser(id, function() {} );
        } catch(e) {
            return;
        }
        throw new Error('No error throw by class for id: ' + id);
    };
}

function catchUpdateSysUser(options) {
    return function() {
        try {
            sp.updateSysUser(options, function() {} );
        } catch(e) {
            return;
        }
        throw new Error('No error throw by class for options: ' + JSON.stringify(options));
    };
}

describe('System Users', function() {

    before(function(done) {
        sp = new ServerPilot({
            clientId: process.env.SP_CLIENT_ID,
            apiKey: process.env.SP_API_KEY
        });

        // Create a dummy server
        sp.createServer('testserver' + process.version, function(err, data) {
            if (err) { done(err); }

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

    describe('.createSysUser(options)', function() {
        it('should throw when no options passed', catchCreateSysUser());
        it('should throw when empty options passed', catchCreateSysUser({}));
        it('should throw when no serverid passed', catchCreateSysUser({ name: name }));
        it('should throw when no name passed', catchCreateSysUser({ serverid: serverId }));
        // it('should throw when invalid name is passed', catchCreateSysUser({ name: 'Test User', serverid: serverId }));
        it('should add sysuser', function(done) {
            var opts = {
                serverid: serverId,
                name: name,
                password: password
            };

            sp.createSysUser(opts, function(err, data) {
                if (err) { return done(err); }

                data.data.name.should.eql(opts.name);
                data.data.serverid.should.eql(opts.serverid);

                sysUserId = data.data.id;
                done();
            });
        });
    });

    describe('.getSysUser(id)', function() {
        it('should throw when no id passed', catchGetSysUser());
        it('should get the sysuser', function(done) {
            sp.getSysUser(sysUserId, function(err, data) {
                if ( err ) { return done(err); }
                data.should.be.an.Object;
                data.data.should.be.an.Object;
                done();
            });
        });
    });

    describe('.updateSysUser(options)', function() {
        it('should throw when no options passed', catchUpdateSysUser());
        it('should throw when no password passed', catchUpdateSysUser({ sysUserId: sysUserId }));
        it('should throw when password less than 8 characters', catchUpdateSysUser({ password: 'test456', sysUserId: sysUserId }));
        it('should throw when no sysUserId passed', catchUpdateSysUser({ password: 'test45678', sysUserId: sysUserId }));
        it('should update sysuser', function(done) {
            var updateOpts = {
                sysUserId: sysUserId,
                password: 'test45678'
            };

            sp.updateSysUser(updateOpts, function(err, data) {
                if (err) { return done(err); }

                // Yeah, really no way to verify that this worked.
                done();
            });
        });
    });

    describe('.deleteSysUser(id)', function() {
        it('should throw when no id passed', catchDeleteSysUser());
        it('should delete the sysuser', function(done) {
            sp.deleteSysUser(sysUserId, function(err, data) {
                if (err) { return done(err); }

                // Make sure the user is gone
                sp.getSysUser(sysUserId, function(err, data) {
                    if (err) {
                        done();
                    }
                });
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