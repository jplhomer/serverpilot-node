var should = require('should');
var ServerPilot = require('..');
var appId = 'CxrESKx9GXko9wen';

function catchAppException(options) {
    return function () {
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
});