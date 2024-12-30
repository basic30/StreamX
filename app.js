<script>
  // Spotify API Credentials (Replace these with your own)
  const CLIENT_ID = '98aea1e75779452b829e436b0a676fe0'; // Replace with your Client ID
  const CLIENT_SECRET = 'fdb53d0c6d734074867e43966a0bbe81'; // Replace with your Client Secret

  // API Endpoints
  const TOKEN_URL = 'https://accounts.spotify.com/api/token';
  const FEATURED_PLAYLISTS_URL = 'https://api.spotify.com/v1/browse/featured-playlists';

  // Fetch Access Token
  async function getAccessToken() {
    const response = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${btoa(CLIENT_ID + ':' + CLIENT_SECRET)}`,
      },
      body: 'grant_type=client_credentials',
    });

    const data = await response.json();
    return data.access_token;
  }

  // Fetch Featured Playlists
  async function fetchFeaturedPlaylists() {
    const token = await getAccessToken();
    const response = await fetch(FEATURED_PLAYLISTS_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    displayPlaylists(data.playlists.items);
  }

  // Display Playlists
  function displayPlaylists(playlists) {
    const heroSection = document.querySelector('.hero-section');

    const playlistsSection = document.createElement('section');
    playlistsSection.className = 'playlists-section';

    const playlistsHeading = document.createElement('h2');
    playlistsHeading.textContent = 'Featured Playlists';
    playlistsSection.appendChild(playlistsHeading);

    const playlistsContainer = document.createElement('div');
    playlistsContainer.className = 'playlists-container';

    playlists.forEach((playlist) => {
      const playlistCard = document.createElement('div');
      playlistCard.className = 'playlist-card';

      const playlistImage = document.createElement('img');
      playlistImage.src = playlist.images[0].url;
      playlistImage.alt = playlist.name;

      const playlistName = document.createElement('h3');
      playlistName.textContent = playlist.name;

      playlistCard.appendChild(playlistImage);
      playlistCard.appendChild(playlistName);
      playlistsContainer.appendChild(playlistCard);
    });

    playlistsSection.appendChild(playlistsContainer);
    heroSection.insertAdjacentElement('afterend', playlistsSection);
  }

  // Fetch playlists on page load
  window.onload = fetchFeaturedPlaylists;
</script>
