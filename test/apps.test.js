var should = require('should');
var fs = require('fs');
var ServerPilot = require('..');
var sp;
var appId, serverId;
var options = {
    name: 'testapp',
    sysuserid: '',
    runtime: 'php5.5',
    domains: ['testapp.com']
};
var sslKey, sslCert;

function catchCreateAppException(opts) {
    return function() {
        try {
            sp.createApp(opts, function() {} );
        } catch (e) {
            return;
        }
        throw new Error('No error throw by class with options: ' + JSON.stringify(opts));
    };
}

function catchUpdateAppException(opts) {
    return function() {
        try {
            sp.updateApp(opts, function() {} );
        } catch(e) {
            return;
        }
        throw new Error('No error throw by class with options: ' + JSON.stringify(opts));
    };
}

function catchDeleteAppException(id) {
    return function() {
        try {
            sp.deleteApp(id, function() {} );
        } catch(e) {
            return;
        }
        throw new Error('No error throw by class with id: ' + id);
    };
}

function catchAddSSLException(opts) {
    return function() {
        try {
            sp.addSSL(opts, function() {} );
        } catch(e) {
            return;
        }
        throw new Error('No error throw by class with options: ' + JSON.stringify(opts));
    };
}

function catchDeleteSSLException(id) {
    return function() {
        try {
            sp.deleteSSL(id, function() {} );
        } catch(e) {
            return;
        }
        throw new Error('No error throw by class with id: ' + id);
    };
}

describe('Apps', function() {

    before(function(done) {
        sp = new ServerPilot({
            clientId: process.env.SP_CLIENT_ID,
            apiKey: process.env.SP_API_KEY
        });

        // Create a dummy server
        sp.createServer('testserver' + process.version, function(err, data) {
            if (err) { console.log(err.message); }

            serverId = data.data.id;

            // Get the sysuserid of that server
            sp.getSysUsers(function(err, data) {
                var sysusers = data.data;

                for (var i = sysusers.length - 1; i >= 0; i--) {
                    if (sysusers[i].serverid === serverId) {
                        options.sysuserid = sysusers[i].id;

                        // Load in the contents of the SSL Key and Cert
                        fs.readFile(__dirname + '/dummy.key', 'ascii', function(err, data) {
                            if (err) { return done(err); }

                            sslKey = data;

                            fs.readFile(__dirname + '/dummy.cert', 'ascii', function(err, data) {
                                if (err) { return done(err); }

                                sslCert = data;

                                done();
                            })
                        });
                    }
                }
            });
        });
    });

    describe('.getApps()', function() {
        it('should get all apps', function(done) {
            sp.getApps(function(err, data) {
                if (err) { return done(err); }
                data.should.be.an.Object;
                data.data.should.be.an.Object;
                done();
            });
        });
    });

    describe('.createApp(options)', function() {
        it('should throw when no options passed', catchCreateAppException());
        it('should throw when empty options passed', catchCreateAppException({}));
        it('should throw when no name passed', catchCreateAppException({ sysuserid: options.sysuserid, runtime: options.runtime }));
        it('should throw when no sysuserid passed', catchCreateAppException({ name: options.name, runtime: options.runtime }));
        it('should throw when no runtime passed', catchCreateAppException({ sysuserid: options.sysuserid, name: options.name }));
        it('should create an app', function(done) {
            sp.createApp(options, function(err, data) {
                if (err) { return done(err); }

                data.data.name.should.eql(options.name);
                data.data.runtime.should.eql(options.runtime);
                data.data.domains.should.eql(options.domains);

                // Set stuff to use later
                appId = data.data.id;

                done();
            });
        });
    });

    describe('.getApp(id)', function() {
        it('should get an app', function(done) {
            sp.getApp( appId, function(err, data) {
                if (err) { return done(err); }
                data.should.be.an.Object;
                data.data.should.be.an.Object;
                done();
            });
        });
    });

    describe('.updateApp(options)', function() {
        it('should throw when no options passed', catchUpdateAppException());
        it('should throw when empty options passed', catchUpdateAppException({}));
        it('should throw when no appId passed', catchUpdateAppException({ runtime: 'php5.6' }));
        it('should throw when neither are passed: runtime, domains', catchUpdateAppException({ appId: appId }));
        it('should update app', function(done) {
            var opts = {
                appId: appId,
                runtime: 'php5.6',
                domains: ['mail.google.com','google.com']
            };
            sp.updateApp(opts, function(err, data) {
                if (err) { return done(err); }

                data.data.runtime.should.eql(opts.runtime);
                // data.data.domains.should.eql(opts.domains); // ServerPilot switches
                done();
            })
        })
    });

    describe('.addSSL(options)', function() {
        it('should throw when no options passed', catchAddSSLException());
        it('should throw when no appId passed', catchAddSSLException({ key: sslKey, cert: sslCert, cacerts: null }));
        it('should throw when no key passed', catchAddSSLException({ appId: appId, cert: sslCert, cacerts: null }));
        it('should throw when no cert passed', catchAddSSLException({ appId: appId, key: sslKey, cacerts: null }));
        it('should add SSL to the app', function(done) {
            sp.addSSL({
                appId: appId,
                key: sslKey,
                cert: sslCert,
                cacerts: null
            }, function(err, data) {
                if (err) { return done(err); }

                data.data.key.should.eql(sslKey);
                data.data.cert.should.eql(sslCert);
                should(data.data.cacerts).not.be.ok;
                done();
            })
        });
    });

    describe('.deleteSSL(id)', function() {
        it('should throw when no appId passed', catchDeleteSSLException());
        it('should delete SSL from an app', function(done) {
            sp.deleteSSL(appId, function(err, data) {
                if (err) { return done(err); }

                data.data.should.not.have.a.length;

                done();
            });
        });
    });

    describe('.deleteApp(id)', function() {
        it('should throw when no id passed', catchDeleteAppException());
        it('should delete the app', function(done) {
            sp.deleteApp( appId, function(err, data) {
                if (err) { return done(err); }

                sp.getApp(appId, function(err, data) {
                    if ( err ) {
                        done();
                    }
                });
            });
        })
    });

    after(function(done) {
        // Destroy the server
        sp.deleteServer(serverId, function(err, data) {
            done();
        });
    });

});