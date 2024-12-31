const clientId = '98aea1e75779452b829e436b0a676fe0'; // Replace with your Client ID
const redirectUri = 'https://basic30.github.io/potify'; // Replace with your Redirect URI
let accessToken = '';

// Login with Spotify
document.getElementById('login').addEventListener('click', () => {
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user-read-private user-read-email user-top-read`;
    window.location.href = authUrl;
});

// Get access token from URL
function getAccessToken() {
    const hash = window.location.hash;
    if (hash) {
        const token = hash.split('&')[0].split('=')[1];
        accessToken = token;
        window.location.hash = '';
        document.getElementById('login').style.display = 'none';
        document.getElementById('search').style.display = 'block';
    }
}

// Fetch music based on search query
async function fetchMusic(query) {
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    const data = await response.json();
    displayMusic(data.tracks.items);
}

// Display music tracks
function displayMusic(tracks) {
    const musicList = document.getElementById
