document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/items')
    .then(res => res.json())
    .then(items => {
      const tbody = document.querySelector('#items-table tbody');
      tbody.innerHTML = '';
      items.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${item.id.toString().padStart(3, '0')}</td>
          <td>${item.name}</td>
          <td>${item.color_count}</td>
          <td>${item.fabric_count}</td>
          <td>${item.image_count}</td>
          <td><button onclick="window.location.href='upload.html?itemId=${item.id}'">Edit images</button></td>
        `;
        tbody.appendChild(tr);
      });
    })
    .catch(() => {
      document.getElementById('app').innerHTML = '<p>Failed to load items.</p>';
    });
});
