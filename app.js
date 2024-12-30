const API_KEY = 'AIzaSyA7k6glBajX2aK8yx49FhqDL43VesRIG64'; // Your YouTube API Key
const searchBox = document.getElementById('search-box');
const searchBtn = document.getElementById('search-btn');
const videoContainer = document.getElementById('video-container');
const mainPlayer = document.getElementById('main-player');
const header = document.querySelector('header');

let searchResults = []; // Store search results for managing the video list

async function fetchVideos(query) {
    const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${query}&maxResults=10&key=${API_KEY}`
    );
    const data = await response.json();
    searchResults = data.items; // Store results for managing the video list
    displayVideos(data.items);
}

function displayVideos(videos) {
    videoContainer.innerHTML = '';
    videos.forEach(video => {
        const videoElement = document.createElement('div');
        videoElement.classList.add('video');
        
        // Show a thumbnail and title for each video
        videoElement.innerHTML = `
            <img src="https://img.youtube.com/vi/${video.id.videoId}/0.jpg" alt="${video.snippet.title}" class="thumbnail">
            <h3>${video.snippet.title}</h3>
        `;
        
        // Play the video in the main player when clicked
        videoElement.addEventListener('click', () => playVideo(video.id.videoId, video.snippet.title));
        videoContainer.appendChild(videoElement);
    });
}

function playVideo(videoId, title) {
    // Display the main player and play the selected video
    mainPlayer.style.display = 'block';
    mainPlayer.innerHTML = `
        <iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" allowfullscreen></iframe>
        <h3>${title}</h3>
    `;
    
    // Remove the clicked video from the video container
    searchResults = searchResults.filter(video => video.id.videoId !== videoId);
    displayVideos(searchResults); // Re-display the remaining videos
}

// Hide the header and show the results
searchBtn.addEventListener('click', () => {
    const query = searchBox.value;
    if (query) {
        header.style.display = 'none';  // Hide header
        fetchVideos(query);
    }
});
