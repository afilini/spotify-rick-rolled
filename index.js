const fs = require('fs');
const path = require('path');

const SpotifyWebApi = require('spotify-web-api-node');

const album = 'spotify:album:6N9PS4QXF1D0OWPk0Sxtb4';

// This time interval is the time in ms between
// the end of one loop and the beginning of the next loop
const TIME_INTERVAL_MS = 100;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

const code = JSON.parse(fs.readFileSync(path.join(__dirname, 'code')).toString());
const credentials = require('./credentials');

const spotifyApi = new SpotifyWebApi(credentials);

spotifyApi.setAccessToken(code.access);
spotifyApi.setRefreshToken(code.refresh);

let last_progress = 0;

async function loop() {
    try {
        let currentStatus = (await spotifyApi.getMyCurrentPlaybackState({})).body;

        if (currentStatus && currentStatus.device) {
            if (currentStatus.item.id !== '4uLU6hMCjMI75M1A2tKUQC') {
                await spotifyApi.play({
                    context_uri: album
                });

                await spotifyApi.seek(last_progress);

                console.log(new Date(), "You got RickRoll'd!");
            } else if (!currentStatus.is_playing) {
                await spotifyApi.play();

                console.log(new Date(), "Nice try :)");
            } else {
                last_progress = currentStatus.progress_ms;
            }

            await spotifyApi.setRepeat({
                state: 'track'
            });
        }
    } catch (error) {
        console.error(error)
        await sleep(5000) // wait 5 seconds just in case
    } finally {
        setTimeout(() => { loop().catch(console.error); }, TIME_INTERVAL_MS);
    }
}

loop().catch(console.error);
