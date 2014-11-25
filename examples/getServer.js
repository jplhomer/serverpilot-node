var ServerPilot = require('../lib/serverpilot');
var sp = new ServerPilot({
    clientId: process.env.SP_CLIENT_ID,
    apiKey: process.env.SP_API_KEY
});

// List out servers
var server = sp.getServer( 'SZI7A0CksipJAHfV', function(response) {
    console.log(response.data);
});