# Spotify Rick Roll

1. Create a new app on Spotify and set `http://localhost:8000` as callback URL
2. Create a `credentials.js` file following template at the end of the file
3. Run `authorize.js`, open the link in your browser and authorize the app
4. Run `index.js` and have fun!

## Configuration template

```$js
module.exports = {
    clientId: '.....',
    clientSecret: '.....',
    redirectUri: 'http://localhost:8000'
};
```