const API_KEY = 'AIzaSyA7k6glBajX2aK8yx49FhqDL43VesRIG64'; // Your YouTube API Key
const searchBox = document.getElementById('search-box');
const searchBtn = document.getElementById('search-btn');
const videoContainer = document.getElementById('video-container');

async function fetchVideos(query) {
    const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${query}&maxResults=10&key=${API_KEY}`
    );
    const data = await response.json();
    displayVideos(data.items);
}

function displayVideos(videos) {
    videoContainer.innerHTML = '';
    videos.forEach(video => {
        const videoElement = document.createElement('div');
        videoElement.classList.add('video');
        videoElement.innerHTML = `
            <iframe src="https://www.youtube.com/embed/${video.id.videoId}" allowfullscreen></iframe>
            <h3>${video.snippet.title}</h3>
        `;
        videoContainer.appendChild(videoElement);
    });
}

searchBtn.addEventListener('click', () => {
    const query = searchBox.value;
    if (query) fetchVideos(query);
});
