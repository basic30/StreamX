const clientId = '5997d407';  // Use your Jamendo API client ID
let token = '';  // Jamendo doesn't require OAuth for basic access, but you will use the client ID in requests

// Search Jamendo API
async function searchSongs(query) {
  const result = await fetch(
    `https://api.jamendo.com/v3.0/tracks/?client_id=${clientId}&format=json&limit=10&namesearch=${query}`,
  );
  const data = await result.json();
  displaySongs(data.results);  // `results` is where tracks are located in the response
}

// Display Songs
function displaySongs(songs) {
  const songList = document.getElementById('song-list');
  songList.innerHTML = '';  // Clear the current song list
  songs.forEach((song) => {
    const songDiv = document.createElement('div');
    songDiv.className = 'song';
    songDiv.innerHTML = `
      <img src="${song.album_image}" alt="${song.name}">
      <p>${song.name}</p>
    `;
    songDiv.addEventListener('click', () => playSong(song));
    songList.appendChild(songDiv);
  });
}

// Play Song
function playSong(song) {
  document.getElementById('album-art').src = song.album_image;  // Display album art
  document.getElementById('song-title').textContent = song.name;  // Song title
  document.getElementById('artist-name').textContent = song.artist_name;  // Artist name
  const audioPlayer = document.getElementById('audio-player');
  audioPlayer.src = song.preview;  // Jamendo provides a `preview` URL for a short audio clip
  audioPlayer.play();  // Play the song preview
}

// Event Listener for Search
document.getElementById('search').addEventListener('input', (e) => {
  const query = e.target.value;
  if (query.length > 2) {  // Start search after 2 characters
    searchSongs(query);
  }
});

// Initialize App - Jamendo API doesn't require an authentication token, so just start the app
