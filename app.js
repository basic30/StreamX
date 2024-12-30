const API_KEY = 'AIzaSyA7k6glBajX2aK8yx49FhqDL43VesRIG64'; // Your YouTube API Key
const searchBox = document.getElementById('search-box');
const searchBtn = document.getElementById('search-btn');
const videoContainer = document.getElementById('video-container');
const header = document.querySelector('header');

// Create main player dynamically
const mainPlayer = document.createElement('div');
mainPlayer.id = 'main-player';
document.body.appendChild(mainPlayer); // Add the main player at the end of the body

let currentVideoId = null; // Store the current video ID for minimizing
let lastScrollY = 0; // Track the last scroll position

async function fetchVideos(query) {
    const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${query}&maxResults=10&key=${API_KEY}`
    );
    const data = await response.json();
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
    currentVideoId = videoId; // Store the current video ID
    mainPlayer.style.display = 'block';
    mainPlayer.innerHTML = `
        <iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" allowfullscreen></iframe>
        <h3>${title}</h3>
    `;
    mainPlayer.classList.remove('minimized'); // Reset to full state when a new video is played
}

// Handle scrolling behavior to hide/show the header and minimize the player
window.addEventListener('scroll', () => {
    if (window.scrollY > lastScrollY) {
        // Scrolling down - hide the header and minimize the player
        header.style.top = '-100px'; // Move header out of view
        mainPlayer.classList.add('minimized'); // Minimize the main player
    } else {
        // Scrolling up - show the header and restore the player
        header.style.top = '0';
        mainPlayer.classList.remove('minimized');
    }
    lastScrollY = window.scrollY;
});

// Search button click event
searchBtn.addEventListener('click', () => {
    const query = searchBox.value;
    if (query) {
        fetchVideos(query);
    }
});
