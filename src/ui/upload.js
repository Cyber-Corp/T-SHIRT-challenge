document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const itemId = params.get('itemId');
  if (!itemId) {
    document.getElementById('app').innerHTML = '<p>Invalid item.</p>';
    return;
  }
  // Fetch item info
  const items = await fetch('/api/items').then(r => r.json());
  const item = items.find(i => i.id == itemId);
  if (!item) {
    document.getElementById('app').innerHTML = '<p>Item not found.</p>';
    return;
  }
  document.getElementById('item-info').innerHTML = `<b>Item ID:</b> ${item.id} <b>Name:</b> ${item.name}`;
  // Fetch configurations and images
  const { configurations, images } = await fetch(`/api/items/${itemId}/configurations`).then(r => r.json());

  // Extract unique colors and fabrics
  const colors = [...new Set(configurations.map(c => c.color))];
  const fabrics = [...new Set(configurations.map(c => c.fabric))];

  // Build matrix
  const matrix = document.getElementById('config-matrix');
  matrix.innerHTML = '';
  // Header row
  const thead = document.createElement('thead');
  const headRow = document.createElement('tr');
  headRow.appendChild(document.createElement('th')); // top-left empty
  colors.forEach(color => {
    const th = document.createElement('th');
    th.textContent = color;
    headRow.appendChild(th);
  });
  thead.appendChild(headRow);
  matrix.appendChild(thead);
  // Body rows
  const tbody = document.createElement('tbody');
  fabrics.forEach(fabric => {
    const row = document.createElement('tr');
    const fabricCell = document.createElement('th');
    fabricCell.textContent = fabric;
    row.appendChild(fabricCell);
    colors.forEach(color => {
      const cell = document.createElement('td');
      // Find config for this color+fabric
      const config = configurations.find(c => c.color === color && c.fabric === fabric);
      if (config) {
        // Images for this config
        const imgs = images.filter(img => img.item_configuration_id === config.config_id);
        const imgGrid = document.createElement('div');
        imgGrid.className = 'img-grid';
        imgs.forEach(img => {
          const imgBox = document.createElement('div');
          imgBox.className = 'img-box';
          imgBox.innerHTML = `
            <img src="${img.image_url}" alt="" />
            <button class="remove-btn" title="Remove" data-imgid="${img.id}">7d7</button>
          `;
          imgGrid.appendChild(imgBox);
        });
        cell.appendChild(imgGrid);
        // Add button
        const addBtn = document.createElement('button');
        addBtn.textContent = 'Add';
        addBtn.onclick = () => showAddPopup(config.config_id);
        cell.appendChild(addBtn);
      } else {
        cell.innerHTML = '<span style="color:#bbb">N/A</span>';
      }
      row.appendChild(cell);
    });
    tbody.appendChild(row);
  });
  matrix.appendChild(tbody);

  // Remove image handler
  matrix.addEventListener('click', async e => {
    if (e.target.classList.contains('remove-btn')) {
      const imgId = e.target.getAttribute('data-imgid');
      await fetch(`/api/images/${imgId}`, { method: 'DELETE' });
      location.reload();
    }
  });
});

function showAddPopup(configId) {
  const popup = document.createElement('div');
  popup.className = 'popup';
  popup.innerHTML = `
    <div class="popup-content">
      <h2>Upload Image</h2>
      <form id="upload-form">
        <input type="file" name="image" accept="image/*" required />
        <input type="hidden" name="configId" value="${configId}" />
        <button type="submit">Upload</button>
        <button type="button" onclick="this.closest('.popup').remove()">Cancel</button>
      </form>
    </div>
  `;
  document.body.appendChild(popup);
  document.getElementById('upload-form').onsubmit = async function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    await fetch(`/api/configurations/${configId}/images`, {
      method: 'POST',
      body: formData
    });
    location.reload();
  };
}
