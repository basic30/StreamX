const API_KEY = 'AIzaSyA7k6glBajX2aK8yx49FhqDL43VesRIG64'; // Replace with your actual API key
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const videoList = document.getElementById('video-list');
const videoPlayer = document.getElementById('video-player');
const videoTitle = document.getElementById('video-title');
const videoDescription = document.getElementById('video-description');

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = searchInput.value;
    if (searchTerm) {
        searchVideos(searchTerm);
    }
});

async function searchVideos(query) {
    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${query}&type=video&key=${API_KEY}`);
        const data = await response.json();
        displayVideos(data.items);
    } catch (error) {
        console.error('Error fetching videos:', error);
    }
}

function displayVideos(videos) {
    videoList.innerHTML = '';
    videos.forEach(video => {
        const videoItem = document.createElement('div');
        videoItem.classList.add('video-item');
        videoItem.innerHTML = `
            <img src="${video.snippet.thumbnails.medium.url}" alt="${video.snippet.title}">
            <div class="video-item-info">
                <h3>${video.snippet.title}</h3>
                <p>${video.snippet.channelTitle}</p>
            </div>
        `;
        videoItem.addEventListener('click', () => playVideo(video));
        videoList.appendChild(videoItem);
    });
}

function playVideo(video) {
    const videoId = video.id.videoId;
    videoPlayer.innerHTML = `
        <iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
    `;
    videoTitle.textContent = video.snippet.title;
    videoDescription.textContent = video.snippet.description;
}

