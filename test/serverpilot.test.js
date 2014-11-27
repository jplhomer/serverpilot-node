var should = require('should');
var ServerPilot = require('..');

function catchSPException(options) {
    return function () {
        try {
            new ServerPilot(options);
        } catch (e) {
            return;
        }
        throw new Error('No error throw by class with options: ' + JSON.stringify(options));
    };
}

describe('ServerPilot', function() {

    it('should throw when no options passed', catchSPException());
    it('should throw when empty options passed', catchSPException({}));
    it('should throw when options with no clientId or apiKey', catchSPException({clientId: '', apiKey: ''}));
    it('should create an instance', function() {
        var options = {
            clientId: process.env.SP_CLIENT_ID,
            apiKey: process.env.SP_API_KEY
        };
        var sp = new ServerPilot(options);
        sp.options.clientId.should.eql( process.env.SP_CLIENT_ID );
        sp.options.apiKey.should.eql( process.env.SP_API_KEY );
    });
});