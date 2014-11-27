var ServerPilot = require('../lib/serverpilot');
var sp = new ServerPilot({
    clientId: process.env.SP_CLIENT_ID,
    apiKey: process.env.SP_API_KEY
});
var serverId = 'DIAo3w871vFkwHPy';

// List out servers
var server = sp.getServer( serverId, function(err, data) {
    if ( err ) { console.log( err.message ); }

    console.log(data.data);
});