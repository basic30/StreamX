let channels = JSON.parse(localStorage.getItem('channels')) || [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let currentChannel = null;
const TELEGRAM_LINK = 'YOUR_TELEGRAM_LINK'; // Add your Telegram link here

// Load Channels and Favorites
const loadChannels = (listId, channelData) => {
    const container = document.getElementById(listId);
    container.innerHTML = '';
    channelData.forEach((channel, index) => {
        const item = document.createElement('div');
        item.className = 'channel-item';
        item.onclick = () => showTelegramModal(index);
        item.innerHTML = `
            <img src="${channel.logo}" class="channel-logo">
            <h3>${channel.name}</h3>
            <p>${channel.category}</p>
        `;
        container.appendChild(item);
    });
};

// Show Telegram Pop-up
const showTelegramModal = (index) => {
    currentChannel = index;
    document.getElementById('telegramModal').style.display = 'flex';
};

// Visit Telegram and Play
const visitTelegram = () => {
    window.open(TELEGRAM_LINK, '_blank');
    closeTelegramModal();
    openModal(channels[currentChannel], currentChannel);
};

// Close Telegram Modal
const closeTelegramModal = () => {
    document.getElementById('telegramModal').style.display = 'none';
};

// Open Video Modal
const openModal = (channel, index) => {
    currentChannel = index;
    document.getElementById('videoPlayer').innerHTML = channel.embedCode;
    document.getElementById('videoModal').style.display = 'flex';
    updateFavButton();
};

// Close Video Modal
const closeModal = () => {
    document.getElementById('videoModal').style.display = 'none';
};

// Dark Mode
const toggleDarkMode = () => {
    document.body.classList.toggle('dark');
};
document.getElementById('toggleDarkMode').onclick = toggleDarkMode;

// Toggle Favorite
const toggleFavorite = () => {
    const channel = channels[currentChannel];
    const index = favorites.findIndex(fav => fav.name === channel.name);
    if (index > -1) favorites.splice(index, 1);
    else favorites.push(channel);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    loadChannels('favoritesList', favorites);
    updateFavButton();
};

// Update Favorite Button
const updateFavButton = () => {
    const channel = channels[currentChannel];
    const isFavorite = favorites.some(fav => fav.name === channel.name);
    document.getElementById('favButton').textContent = isFavorite ? '❤️ Remove from Favorites' : '❤️ Add to Favorites';
};

// Search Channels
const searchChannels = () => {
    const searchValue = document.getElementById('searchBar').value.toLowerCase();
    const filtered = channels.filter(channel => channel.name.toLowerCase().includes(searchValue));
    loadChannels('channelList', filtered);
};

// Filter By Category
const filterByCategory = () => {
    const selectedCategory = document.getElementById('categoryFilter').value;
    const filtered = selectedCategory === 'All' ? channels : channels.filter(channel => channel.category === selectedCategory);
    loadChannels('channelList', filtered);
};

// Admin: Add Channel
const adminForm = document.getElementById('adminForm');
if (adminForm) {
    adminForm.onsubmit = (e) => {
        e.preventDefault();
        const newChannel = {
            name: document.getElementById('channelName').value,
            logo: document.getElementById('channelLogo').value,
            category: document.getElementById('channelCategory').value,
            embedCode: document.getElementById('channelEmbedCode').value
        };
        channels.push(newChannel);
        localStorage.setItem('channels', JSON.stringify(channels));
        alert('Channel added!');
        window.location.href = 'index.html';
    };
}

// Initial Load
loadChannels('channelList', channels);
loadChannels('favoritesList', favorites);