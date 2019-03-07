const fs = require('fs');
const path = require('path');
const http = require('http');

const SpotifyWebApi = require('spotify-web-api-node');

const scopes = [
    'app-remote-control',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'streaming'
];

const credentials = require('./credentials');

http
    .createServer({}, function (req) {
        let code = req.url.substr("/?code=".length);

        spotifyApi.authorizationCodeGrant(code)
            .then(
                function(data) {
                    console.log('The token expires in ' + data.body['expires_in']);
                    console.log('The access token is ' + data.body['access_token']);
                    console.log('The refresh token is ' + data.body['refresh_token']);

                    // Set the access token on the API object to use it in later calls
                    spotifyApi.setAccessToken(data.body['access_token']);
                    spotifyApi.setRefreshToken(data.body['refresh_token']);

                    fs.writeFileSync(path.join(__dirname, 'code'), JSON.stringify({
                            access: data.body['access_token'],
                            refresh: data.body['refresh_token']
                        })
                    );
                })
            .catch(function(err) {
                console.log('Something went wrong!', err);
            })
            .finally(() => {
                process.exit(0);
            })
    })
    .listen(8000);

const spotifyApi = new SpotifyWebApi(credentials);

// Create the authorization URL
let authorizeURL = spotifyApi.createAuthorizeURL(scopes);

console.log(authorizeURL);
console.log('Waiting for the code...');
