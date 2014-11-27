var should = require('should');
var ServerPilot = require('..');
var appId = 'CxrESKx9GXko9wen';
var serverId;
var options = {
    name: 'testapp',
    sysuserid: '',
    runtime: 'php5.5',
    domains: ['testapp.com']
};

function catchAppException(options) {
    return function() {
        try {
            new ServerPilot(options);
        } catch (e) {
            return;
        }
        throw new Error('No error throw by class with options: ' + JSON.stringify(options));
    };
}

describe('Apps', function() {
    var sp;

    before(function() {
        sp = new ServerPilot({
            clientId: process.env.SP_CLIENT_ID,
            apiKey: process.env.SP_API_KEY
        });

        // Create a dummy server
        sp.createServer('testserver', function(err, data) {
            serverId = data.data.id;
        });
    });

    describe('.getApps()', function() {
        it('should get all apps', function(done) {
            sp.getApps(function(err, data) {
                if ( err ) { done(err); }
                data.should.be.an.Object;
                data.data.should.be.an.Object;
                done();
            });
        });
    });

    describe('.createApp(options)', function() {

    });

    describe('.getApp(id)', function() {
        it('should get an app', function(done) {
            sp.getApp( appId, function(err, data) {
                if ( err ) { done(err); }
                data.should.be.an.Object;
                data.data.should.be.an.Object;
                done();
            });
        });
    });

    after(function() {
        // Destroy the server
        sp.deleteServer(serverId, function(err, data) {});
    })

});