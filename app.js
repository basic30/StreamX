const API_KEY = 'AIzaSyA7k6glBajX2aK8yx49FhqDL43VesRIG64'; // Your YouTube API Key
const searchBox = document.getElementById('search-box');
const searchBtn = document.getElementById('search-btn');
const videoContainer = document.getElementById('video-container');
const header = document.querySelector('header');
const mainPlayer = document.createElement('div'); // Create main player dynamically
mainPlayer.id = 'main-player';
document.body.prepend(mainPlayer); // Add main player to the top of the body

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
    videoContainer.innerHTML = ''; // Clear previous results
    videos.forEach((video) => {
        const videoElement = document.createElement('div');
        videoElement.classList.add('video');
        
        // Thumbnail and title for each video
        videoElement.innerHTML = `
            <img src="https://img.youtube.com/vi/${video.id.videoId}/0.jpg" alt="${video.snippet.title}" class="thumbnail">
            <h3>${video.snippet.title}</h3>
        `;
        
        // Click event to play the video in the main player
        videoElement.addEventListener('click', () => playVideo(video.id.videoId, video.snippet.title));
        videoContainer.appendChild(videoElement);
    });
}

function playVideo(videoId, title) {
    // Display the main player and hide the header
    mainPlayer.style.display = 'block';
    mainPlayer.innerHTML = `
        <iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" allowfullscreen></iframe>
        <h3>${title}</h3>
    `;

    header.style.display = 'none'; // Hide the header when a video is clicked

    // Remove the clicked video from the suggestions
    searchResults = searchResults.filter(video => video.id.videoId !== videoId);
    displayVideos(searchResults); // Update suggestions
}

// Search button click event
searchBtn.addEventListener('click', () => {
    const query = searchBox.value;
    if (query) {
        header.style.display = 'none'; // Hide header when search begins
        fetchVideos(query);
    }
});

// Show the header when the main player is scrolled down
window.addEventListener('scroll', () => {
    if (window.scrollY === 0) {
        header.style.display = 'flex'; // Show header when scrolled to the top
    }
});
