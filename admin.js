// admin.js

document.addEventListener('DOMContentLoaded', () => {
  loadUsers();
  loadModerationQueue();
  loadAnalytics();
});

function loadUsers() {
  const userContainer = document.getElementById('user-management');

  // Заглушка: список користувачів
  const users = [
    { name: 'Любов', city: 'Київ', invited: 5 },
    { name: 'Ірина', city: 'Львів', invited: 3 },
    { name: 'Олександр', city: 'Одеса', invited: 4 }
  ];

  const list = document.createElement('ul');
  users.forEach(user => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${user.name}</strong> (${user.city}) — Запрошено: ${user.invited} <button class="btn small" onclick="blockUser('${user.name}')">Заблокувати</button>`;
    list.appendChild(li);
  });

  userContainer.appendChild(list);
}

function blockUser(userName) {
  alert(`Користувача ${userName} заблоковано (демо).`);
}

function loadModerationQueue() {
  const modContainer = document.getElementById('moderation');

  // Заглушка: черга історій
  const stories = [
    { name: 'Марина', story: 'Допомогла літній жінці перейти дорогу.' },
    { name: 'Тарас', story: 'Подарував одяг для дитячого будинку.' }
  ];

  const list = document.createElement('ul');
  stories.forEach((story, index) => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${story.name}</strong>: ${story.story} <button class="btn small" onclick="approveStory(${index})">✅</button> <button class="btn small" onclick="rejectStory(${index})">❌</button>`;
    list.appendChild(li);
  });

  modContainer.appendChild(list);
}

function approveStory(index) {
  alert(`Історія #${index + 1} затверджена.`);
}

function rejectStory(index) {
  alert(`Історія #${index + 1} відхилена.`);
}

function loadAnalytics() {
  document.getElementById('total-waves').textContent = '125';
  document.getElementById('average-depth').textContent = '4.6';

  const activity = {
    'Київ': 50,
    'Львів': 30,
    'Одеса': 20,
    'Харків': 25
  };

  const container = document.getElementById('location-activity');
  const list = document.createElement('ul');
  for (const city in activity) {
    const li = document.createElement('li');
    li.textContent = `${city}: ${activity[city]} хвиль`;
    list.appendChild(li);
  }
  container.innerHTML = '';
  container.appendChild(list);
}
