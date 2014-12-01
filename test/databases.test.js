var should = require('should');
var ServerPilot = require('..');
var sp, appId, serverId, sysUserId, databaseId;
var databaseName = 'testdatabase',
    databaseUserName = 'testdatauser'
    databaseUserPass = 'testdatauserpass';

function catchCreateDatabaseException(options) {
    return function() {
        try {
            sp.createDatabase(options, function() {} );
        } catch(e) {
            return;
        }
        throw new Error('No error throw from class with options:' + JSON.stringify(options));
    };
}

describe('Databases', function() {

    before(function(done) {
        sp = new ServerPilot({
            clientId: process.env.SP_CLIENT_ID,
            apiKey: process.env.SP_API_KEY
        });

        // Create a dummy server
        sp.createServer('testserver', function(err, data) {
            serverId = data.data.id;

            // Get the sysuserid of that server
            sp.getSysUsers(function(err, data) {
                var sysusers = data.data;

                for (var i = sysusers.length - 1; i >= 0; i--) {
                    if (sysusers[i].serverid === serverId) {
                        sysUserId = sysusers[i].id;
                    }
                }

                // Create a dummy app
                sp.createApp({
                    name: 'testapp',
                    sysuserid: sysUserId,
                    runtime: 'php5.5',
                    domains: ['testapp.com']
                }, function(err, data) {
                    appId = data.data.id;

                    done();
                });
            });
        });
    });

    describe('.getDatabases()', function() {
        it('should get all databases`', function(done) {
            sp.getDatabases(function(err, data) {
                if (err) { return done(err); }
                data.should.be.an.Object;
                data.data.should.be.an.Object;
                done();
            });
        });
    });

    describe('.createDatabase(options)', function() {
        it('should throw when no options passed', catchCreateDatabaseException());
        it('should throw when no appId passed', catchCreateDatabaseException({
            name: databaseName,
            user: {
                name: databaseUserName,
                password: databaseUserPass
            }
        }));
        it('should throw when no database name passed', catchCreateDatabaseException({
            appid: appId,
            user: {
                name: databaseUserName,
                password: databaseUserPass
            }
        }));
        it('should throw when no user.name passed', catchCreateDatabaseException({
            appid: appId,
            name: databaseName,
            user: {
                password: databaseUserPass
            }
        }));
        it('should throw when no user.password passed', catchCreateDatabaseException({
            appid: appId,
            name: databaseName,
            user: {
                name: databaseUserName
            }
        }));
        it('should create a database', function(done) {
            sp.createDatabase({
                appid: appId,
                name: databaseName,
                user: {
                    name: databaseUserName,
                    password: databaseUserPass
                }
            }, function(err, data) {
                if (err) { return done(err); }

                data.data.name.should.eql(databaseName);
                data.data.user.name.should.eql(databaseUserName);

                done();
            });
        });
    });

    after(function(done) {
        sp.deleteServer(serverId, function(err, data) {
            done();
        });
    });

});