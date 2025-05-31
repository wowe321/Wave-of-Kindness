document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlUserId = urlParams.get("id");

    // Якщо є id в URL — зберігаємо його в localStorage
    if (urlUserId) {
        localStorage.setItem("userId", urlUserId);
        window.history.replaceState({}, document.title, window.location.pathname); // Прибрати ?id
    }

    const userId = localStorage.getItem("userId");

    if (!userId) {
        showRegistrationPrompt();
        return;
    }

    fetch(`../users_${userId}.json`)
        .then(res => {
            if (!res.ok) throw new Error("Користувача не знайдено");
            return res.json();
        })
        .then(userData => showUserProfile(userData))
        .catch(() => showRegistrationPrompt());
});

function makeLine(from, to) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", from.x);
    line.setAttribute("y1", from.y + from.r);
    line.setAttribute("x2", to.x);
    line.setAttribute("y2", to.y - to.r);
    line.setAttribute("stroke", "#aaa");
    line.setAttribute("stroke-width", "1.5");
    return line;
}

function showRegistrationPrompt() {
    document.querySelector("main").innerHTML = `
    <section class="section-box">
      <h2>👤 Новий користувач</h2>
      <p>Вас ще не зареєстровано. Оберіть спосіб реєстрації:</p>
      <div class="register-btn-group">
        <button class="btn-register-site" onclick="registerOnSite()">Зареєструватися на сайті</button>
        <button class="btn-register-bot" onclick="window.open('https://t.me/Wave_of_Kindness_bot?start=register')">Зареєструватися в боті</button>
      </div>
    </section>
  `;
}

function showUserProfile(user) {
    document.querySelector("main").innerHTML = `
    <section class="section-box">
      <h2>Загальна інформація</h2>
      <p><strong>Ім’я:</strong> ${user.name}</p>
      <p><strong>Місто:</strong> ${user.city}</p>
      <p><strong>Чим можу допомогти:</strong> ${user.help}</p>
      <p><strong>Реферальне посилання:</strong> 
        <a href="https://t.me/Wave_of_Kindness_bot?start=${user.id}">
          t.me/Wave_of_Kindness_bot?start=${user.id}
        </a>
      </p>
    </section>

    <section class="section-box">
      <h2>Запрошені учасники</h2>
      <ul id="ref-users">
        ${user.referrals && user.referrals.length > 0 
          ? user.referrals.map(ref => `<li>${ref}</li>`).join("")
          : "<li>Немає запрошених користувачів</li>"
        }
      </ul>
    </section>

    <section class="section-box">
      <h2>🌊 Граф хвилі</h2>
      <div id="wave-graph"></div>
    </section>
  `;

  drawWaveGraph(user);
}

function drawWaveGraph(user) {
  const graph = document.getElementById("wave-graph");

  const baseX = 160;
  const baseY = 50;
  const radius = 20;
  const gapX = 60;
  const refCount = user.referrals ? user.referrals.length : 0;

  const users = [
    { name: user.name, x: baseX, y: baseY, r: radius, color: "#00bcd4" }
  ];

  for (let i = 0; i < refCount; i++) {
    users.push({
      name: user.referrals[i],
      x: baseX - gapX * (refCount - 1) / 2 + i * gapX,
      y: baseY + 80,
      r: 15,
      color: "#4dd0e1"
    });
  }

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "220");
  svg.setAttribute("viewBox", "0 0 320 220");

  // Лінії між користувачем і рефералами
  for (let i = 1; i < users.length; i++) {
    svg.appendChild(makeLine(users[0], users[i]));
  }

  // Кружечки + підписи
  users.forEach(user => {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", user.x);
    circle.setAttribute("cy", user.y);
    circle.setAttribute("r", user.r);
    circle.setAttribute("fill", user.color);
    svg.appendChild(circle);

    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", user.x);
    label.setAttribute("y", user.y + user.r + 12);
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("font-size", "12px");
    label.setAttribute("fill", "#333");
    label.textContent = user.name;
    svg.appendChild(label);
  });

  graph.innerHTML = "";
  graph.appendChild(svg);
}

function registerOnSite() {
  const newId = generateRandomId();
  localStorage.setItem("userId", newId);
  window.location.href = `stories.html?new=true&id=${newId}`;
}

function generateRandomId() {
  return Math.floor(100000 + Math.random() * 900000);
}
