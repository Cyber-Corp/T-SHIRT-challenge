document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/items')
    .then(res => res.json())
    .then(items => {
      const tbody = document.querySelector('#items-table tbody');
      tbody.innerHTML = '';
      items.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td data-cy="item-id-${item.id}">${item.id.toString().padStart(3, '0')}</td>
          <td data-cy="shirt-type-${item.id}">${item.name}</td>
          <td data-cy="color-count-${item.id}">${item.color_count}</td>
          <td data-cy="fabric-count-${item.id}">${item.fabric_count}</td>
          <td data-cy='n-images-on-id-${item.id}'>${item.image_count}</td>
          <td><button data-cy='edit-images-bttn-${item.id}' onclick="window.location.href='upload.html?itemId=${item.id}'">Edit images</button></td>
        `;
        tbody.appendChild(tr);
      });
    })
    .catch(() => {
      document.getElementById('app').innerHTML = '<p>Failed to load items.</p>';
    });
});
