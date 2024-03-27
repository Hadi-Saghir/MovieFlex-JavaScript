// /api/spotify-token.js
const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const authOptions = {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
    };

    try {
        const response = await fetch('https://accounts.spotify.com/api/token', authOptions);
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching Spotify token:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
