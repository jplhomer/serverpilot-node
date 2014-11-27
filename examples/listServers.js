var ServerPilot = require('../lib/serverpilot');
var sp = new ServerPilot({
    clientId: process.env.SP_CLIENT_ID,
    apiKey: process.env.SP_API_KEY
});

// List out servers
var servers = sp.getServers( function(err, data) {
    if ( err ) { console.log( err.message ); }

    console.log(data.data);
});