// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('nav a');

  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();

      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);

      window.scrollTo({
        top: targetElement.offsetTop - 70, // Offset for fixed header
        behavior: 'smooth'
      });
    });
  });

  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('nav ul');

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });
  }

  // YouTube Escuchar section
  const CHANNEL_ID = 'UCaCbbzaEdtvnelBl8bu907g';
  const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
  const RSS2JSON_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`;

  let allVideos = [];
  let displayedCount = 0;
  const VIDEOS_PER_PAGE = 3;

  async function fetchYouTubeVideos() {
    try {
      const response = await fetch(RSS2JSON_URL);
      const data = await response.json();
      if (data.status === 'ok') {
        allVideos = data.items;
        renderVideos();
      }
    } catch (error) {
      console.error('Error fetching YouTube videos:', error);
    }
  }

  function getVideoId(link) {
    try {
      const url = new URL(link);
      const shortsMatch = url.pathname.match(/\/shorts\/([^/?]+)/);
      if (shortsMatch) return shortsMatch[1];
      return url.searchParams.get('v');
    } catch {
      return null;
    }
  }

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  function renderVideos() {
    const grid = document.getElementById('video-grid');
    const loadMoreBtn = document.getElementById('load-more-btn');

    const videosToShow = allVideos.slice(displayedCount, displayedCount + VIDEOS_PER_PAGE);

    videosToShow.forEach(video => {
      const videoId = getVideoId(video.link);
      if (!videoId) return;

      const card = document.createElement('div');
      card.className = 'video-card glass-card';
      card.innerHTML = `
        <div class="video-wrapper">
          <iframe
            src="https://www.youtube.com/embed/${videoId}"
            title="${video.title.replace(/"/g, '&quot;')}"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen>
          </iframe>
        </div>
        <div class="video-info">
          <h3 class="video-title">${video.title}</h3>
          <p class="video-date">${formatDate(video.pubDate)}</p>
        </div>
      `;
      grid.appendChild(card);
    });

    displayedCount += videosToShow.length;

    if (displayedCount >= allVideos.length) {
      loadMoreBtn.style.display = 'none';
    } else {
      loadMoreBtn.style.display = 'inline-block';
    }
  }

  const loadMoreBtn = document.getElementById('load-more-btn');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', renderVideos);
  }

  fetchYouTubeVideos();
});
