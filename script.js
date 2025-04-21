const cloudName = 'YOUR_CLOUD_NAME';
const uploadPreset = 'YOUR_UNSIGNED_PRESET';

const dropArea = document.getElementById('drop-area');
const fileElem = document.getElementById('fileElem');
const fileSelect = document.getElementById('fileSelect');
const gallery = document.getElementById('gallery');

// Initialize sortable
new Sortable(gallery, {
  animation: 150,
  handle: '.drag-handle',
  ghostClass: 'sortable-ghost',
  onEnd: () => {
    const reordered = [...gallery.children]
      .filter(item => item.classList.contains('gallery-item'))
      .map(item => {
        const img = item.querySelector('img');
        return JSON.parse(localStorage.getItem('images')).find(i => i.url === img.src);
      });
    localStorage.setItem('images', JSON.stringify(reordered));
  }
});

// Check for empty gallery state
function checkEmptyGallery() {
  if (gallery.children.length === 0) {
    const emptyState = document.createElement('div');
    emptyState.classList.add('empty-gallery');
    emptyState.innerHTML = '<p>Your uploaded images will appear here</p>';
    gallery.appendChild(emptyState);
  } else if (gallery.querySelector('.empty-gallery') && gallery.children.length > 1) {
    gallery.removeChild(gallery.querySelector('.empty-gallery'));
  }
}

fileSelect.onclick = () => fileElem.click();

// Drag and drop handlers
dropArea.addEventListener('dragover', e => {
  e.preventDefault();
  dropArea.classList.add('hover');
});

dropArea.addEventListener('dragleave', () => {
  dropArea.classList.remove('hover');
});

dropArea.addEventListener('drop', e => {
  e.preventDefault();
  dropArea.classList.remove('hover');
  handleFiles(e.dataTransfer.files);
});

fileElem.addEventListener('change', () => {
  handleFiles(fileElem.files);
});

function handleFiles(files) {
  [...files].forEach(uploadFile);
}

function uploadFile(file) {
  if (!file.type.startsWith('image/')) {
    alert('Only image files are allowed!');
    return;
  }
  
  // Remove empty state if present
  const emptyState = gallery.querySelector('.empty-gallery');
  if (emptyState) gallery.removeChild(emptyState);
  
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  
  const loadingContainer = document.createElement('div');
  loadingContainer.classList.add('gallery-item');
  loadingContainer.innerHTML = `
    <div class="loading-animation">
      <div class="spinner"></div>
    </div>
    <p class="upload-status">Uploading ${file.name.length > 15 ? file.name.substring(0, 15) + '...' : file.name}</p>
  `;
  gallery.appendChild(loadingContainer);
  
  fetch(url, {
    method: 'POST',
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      const imageURL = data.secure_url;
      const imageTitle = file.name;
      const dimensions = `${data.width}x${data.height}`;
      const sizeKB = (file.size / 1024).toFixed(1);
      const timestamp = new Date().toLocaleString();
      
      loadingContainer.innerHTML = `
        <div class="drag-handle"></div>
        <img src="${imageURL}" alt="${imageTitle}" title="${imageTitle}" />
        <div class="img-meta">
          <strong>${imageTitle.length > 15 ? imageTitle.substring(0, 15) + '...' : imageTitle}</strong>
          
        </div>
        <span class="upload-status">✓ Uploaded</span>
        <button class="delete-btn">&times;</button>
      `;
      
      loadingContainer.querySelector('.delete-btn').onclick = (e) => {
        e.stopPropagation();
        gallery.removeChild(loadingContainer);
        removeFromLocalStorage(imageURL);
        checkEmptyGallery();
      };
      
      saveImageToLocalStorage({ url: imageURL, title: imageTitle, dimensions, sizeKB, timestamp });
    })
    .catch(() => {
      loadingContainer.innerHTML = `
        <div class="loading-animation" style="background: #ffeeee;">
          <p style="color: #e74c3c;">Failed</p>
        </div>
        <p class="upload-status text-red">Upload failed for ${file.name.length > 15 ? file.name.substring(0, 15) + '...' : file.name}</p>
        <button class="delete-btn">&times;</button>
      `;
      
      loadingContainer.querySelector('.delete-btn').onclick = (e) => {
        e.stopPropagation();
        gallery.removeChild(loadingContainer);
        checkEmptyGallery();
      };
    });
}

function displayImage(data) {
  const div = document.createElement('div');
  div.classList.add('gallery-item');
  div.innerHTML = `
    <div class="drag-handle"></div>
    <img src="${data.url}" alt="${data.title}" title="${data.title}" />
    <div class="img-meta">
      <strong>${data.title.length > 15 ? data.title.substring(0, 15) + '...' : data.title}</strong>
      <small>${data.dimensions}, ${data.sizeKB}KB</small>
      <small>${data.timestamp}</small>
    </div>
    <button class="delete-btn">&times;</button>
  `;
  gallery.appendChild(div);
  
  div.querySelector('.delete-btn').onclick = (e) => {
    e.stopPropagation();
    gallery.removeChild(div);
    removeFromLocalStorage(data.url);
    checkEmptyGallery();
  };
}

function saveImageToLocalStorage(data) {
  const images = JSON.parse(localStorage.getItem('images')) || [];
  images.push(data);
  localStorage.setItem('images', JSON.stringify(images));
}

function removeFromLocalStorage(url) {
  let images = JSON.parse(localStorage.getItem('images')) || [];
  images = images.filter(img => img.url !== url);
  localStorage.setItem('images', JSON.stringify(images));
}

function loadImagesFromStorage() {
  const images = JSON.parse(localStorage.getItem('images')) || [];
  images.forEach(displayImage);
  checkEmptyGallery();
}

window.onload = loadImagesFromStorage;