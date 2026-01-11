const gallery = document.getElementById('gallery');
const filterButtonsDiv = document.getElementById('filter-buttons');
const modal = document.getElementById('mapModal');
const modalImage = document.getElementById('modalImage');
const modalStory = document.getElementById('modalStory');
const closeBtn = document.querySelector('.close');

let mapsData = [];

// Load index.json
async function loadIndex() {
  try {
    const response = await fetch('index.json');
    mapsData = await response.json();
    renderGallery(mapsData);
    renderFilterButtons(mapsData);
  } catch (err) {
    console.error("Failed to load index.json:", err);
  }
}

// Render gallery
function renderGallery(data) {
  gallery.innerHTML = ''; // clear
  // Sort by id for default order
  data.sort((a,b) => a.id - b.id);
  data.forEach(map => {
    const card = document.createElement('div');
    card.className = 'map-card';
    card.dataset.storyFile = map.story_file;
    card.dataset.tags = map.tags.join(',');

    card.innerHTML = `
      <img src="maps/${map.filename}" alt="${map.title}">
      <h3>${map.title}</h3>
      <p>${map.description}</p>
    `;

    gallery.appendChild(card);

    // Click event for modal
    card.addEventListener('click', async () => {
      try {
        const response = await fetch(map.story_file);
        if (!response.ok) throw new Error('Story file not found');
        const storyHTML = await response.text();
        modalStory.innerHTML = storyHTML;
      } catch {
        modalStory.innerHTML = "<p>Story not available.</p>";
      }

      modalImage.src = `maps/${map.filename}`;
      modalImage.alt = map.title;
      modal.style.display = 'block';
      document.body.style.overflow = 'hidden';
    });
  });
}

// Generate unique filter buttons
function renderFilterButtons(data) {
  const allTags = new Set();
  data.forEach(map => map.tags.forEach(tag => allTags.add(tag)));

  // Add "All" button
  const allBtn = document.createElement('button');
  allBtn.textContent = 'All';
  allBtn.className = 'filter-btn active';
  allBtn.addEventListener('click', () => filterGallery('All'));
  filterButtonsDiv.appendChild(allBtn);

  allTags.forEach(tag => {
    const btn = document.createElement('button');
    btn.textContent = tag;
    btn.className = 'filter-btn';
    btn.addEventListener('click', () => filterGallery(tag));
    filterButtonsDiv.appendChild(btn);
  });
}

// Filter gallery
function filterGallery(tag) {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent === tag);
  });

  const filtered = tag === 'All' ? mapsData : mapsData.filter(map => map.tags.includes(tag));
  renderGallery(filtered);
}

// Modal close handlers
closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
  document.body.style.overflow = '';
});
window.addEventListener('click', e => {
  if (e.target === modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
});
window.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
});

loadIndex();
