// Modal elements
const modal = document.getElementById('mapModal');
const modalImage = document.getElementById('modalImage');
const modalStory = document.getElementById('modalStory');
const closeBtn = document.querySelector('.close');

// Attach click event to all map cards
document.querySelectorAll('.map-card').forEach(card => {
  card.addEventListener('click', async () => {
    const storyFile = card.dataset.storyFile;
    const img = card.querySelector('img');
    const imgSrc = img.src;
    const altText = img.alt;

    // Load external story HTML
    try {
      const response = await fetch(storyFile);
      if (!response.ok) throw new Error('Story file not found');
      const storyHTML = await response.text();
      modalStory.innerHTML = storyHTML;
    } catch (err) {
      modalStory.innerHTML = "<p>Story not available.</p>";
      console.error(err);
    }

    // Set image and alt
    modalImage.src = imgSrc;
    modalImage.alt = altText;

    // Show modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // prevent background scroll
  });
});

// Close modal when clicking the "x"
closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
  document.body.style.overflow = ''; // restore scroll
});

// Close modal when clicking outside content
window.addEventListener('click', e => {
  if (e.target === modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
});

// Optional: Close modal on pressing ESC
window.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
});
