var should = require('should');
var ServerPilot = require('..');
var sp, appId, serverId, sysUserId, databaseId, databaseUserId;
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

function catchGetDatabaseException(id) {
    return function() {
        try {
            sp.getDatabase(id, function() {} );
        } catch(e) {
            return;
        }
        throw new Error('No error throw from class with ID:' + id);
    };
}

function catchUpdateDatabaseException(options) {
    return function() {
        try {
            sp.updateDatabase(options, function() {} );
        } catch(e) {
            return;
        }
        throw new Error('No error throw from class with options:' + JSON.stringify(options));
    };
}

function catchDeleteDatabaseException(id) {
    return function() {
        try {
            sp.deleteDatabase(id, function() {} );
        } catch(e) {
            return;
        }
        throw new Error('No error throw from class with id:' + id);
    };
}

describe('Databases', function() {

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

                // Set id for future use
                databaseId = data.data.id;
                databaseUserId = data.data.user.id;

                done();
            });
        });
    });

    describe('.getDatabase(id)', function() {
        it('should throw when no id passed', catchGetDatabaseException());
        it('should get a database', function(done) {
            sp.getDatabase(databaseId, function(err, data) {
                if (err) { return done(err); }

                data.data.id.should.eql(databaseId);

                done();
            });
        });
    });

    describe('.updateDatabase(options)', function() {
        it('should throw when no options passed', catchUpdateDatabaseException());
        it('should throw when no user.id passed', catchUpdateDatabaseException({
            databaseId: databaseId,
            name: databaseName,
            user: {
                password: 'mynewpassword'
            }
        }));
        it('should throw when no user.password passed', catchUpdateDatabaseException({
            databaseId: databaseId,
            name: databaseName,
            user: {
                id: databaseUserId
            }
        }));
        it('should update database user password', function(done) {
            sp.updateDatabase({
                databaseId: databaseId,
                user: {
                    id: databaseUserId,
                    password: 'mynewpassword'
                }
            }, function(err, data) {
                if (err) { return done(err); }

                // No way to verify password change
                done();
            });
        });
    });

    describe('.deleteDatabase(id)', function() {
        it('should throw when no id passed', catchDeleteDatabaseException());
        it('should delete the database', function(done) {
            sp.deleteDatabase(databaseId, function(err, data) {
                if (err) { return done(err); }

                sp.getDatabase(databaseId, function(err, data) {
                    if ( err ) {
                        done();
                    }
                });
            });
        });
    });

    after(function(done) {
        sp.deleteServer(serverId, function(err, data) {
            done();
        });
    });

});