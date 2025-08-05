// home/home.js

// Laad data via data.json (fetch)
async function loadData() {
  const rawEntries = await fetch('../data.json').then(r => r.json());
  return rawEntries.map(([date, name, who, dist]) => ({ date, name, who, dist, done: false }));
}

// Render alle kalender entries
function renderCal(data) {
  const body = document.getElementById('cal-body');
  body.innerHTML = '';

  data.forEach(d => {
    const tr = document.createElement('tr');
    const statusClass = d.done ? 'status-done' : 'status-pending';
    tr.innerHTML = `
      <td>${d.date}</td>
      <td>${d.name}</td>
      <td>${d.who}</td>
      <td>${d.dist}</td>
      <td><span class="status-dot ${statusClass}"></span></td>
    `;
    body.appendChild(tr);
  });
}

// Toon volgende open taak voor ingelogde gebruiker
function nextTask(data) {
  const user = localStorage.getItem('user');
  const pending = data.filter(d => d.who === user && !d.done);
  if (!pending.length) return;
  const t = pending[0];

  const row = document.getElementById('task-row');
  row.innerHTML = `
    <tr>
      <td>${t.date}</td>
      <td>${t.name}</td>
      <td>${t.who}</td>
      <td>${t.dist}</td>
      <td><input type="checkbox" id="t-splits"></td>
      <td><input type="checkbox" id="t-buma"></td>
      <td><input type="checkbox" id="t-check"></td>
    </tr>
  `;

  document.getElementById('t-check').onchange = () => {
    t.done = true;
    renderCal(data);
    nextTask(data);
  };
}

// Initialisatie: fetch data en render views
document.addEventListener('DOMContentLoaded', async () => {
  const data = await loadData();
  renderCal(data);
  nextTask(data);

  document.getElementById('view-cal').onclick = () => showSection('calendar');
  document.getElementById('view-tasks').onclick = () => showSection('tasks');
  document.getElementById('view-artworks').onclick = () => window.open('https://drive.google.com/drive/folders/1jZpWCyjCzOlqNfuVA7QrpDu_npU0A8_g?usp=sharing','_blank');
  document.getElementById('user').textContent = localStorage.getItem('user');
});

function showSection(id) {
  ['calendar', 'tasks'].forEach(s => {
    document.getElementById(s).classList.toggle('hidden', s !== id);
  });
  document.querySelectorAll('nav button').forEach(btn => {
    btn.classList.toggle('active', btn.id === 'view-' + id);
  });
}
