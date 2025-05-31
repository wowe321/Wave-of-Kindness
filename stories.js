const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

app.use(express.json());

const dataDir = path.join(__dirname, "data"); // папка для зберігання файлів

// Переконаємось, що папка існує
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

// Отримати дані користувача
app.get("/user/:id", (req, res) => {
    const userId = req.params.id;
    const filePath = path.join(dataDir, `users_${userId}.json`);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "Користувач не знайдений" });
    }

    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    res.json(data);
});

// Додати історію користувача
app.post("/user/:id/story", (req, res) => {
    const userId = req.params.id;
    const filePath = path.join(dataDir, `users_${userId}.json`);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "Користувач не знайдений" });
    }

    const { name, city, story } = req.body;

    if (!name || !story) {
        return res.status(400).json({ error: "Відсутні обов’язкові поля: name, story" });
    }

    const userData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    if (!Array.isArray(userData.stories)) {
        userData.stories = [];
    }

    userData.stories.push({ name, city: city || "Невідомо", story });

    fs.writeFileSync(filePath, JSON.stringify(userData, null, 2), "utf-8");

    res.json({ message: "Історію додано" });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Сервер працює на http://localhost:${PORT}`);
});
const userId = localStorage.getItem("userId") || "123456"; // замінити або отримати з localStorage

// Показати історії користувача на сторінці
function loadStories() {
    fetch(`http://localhost:3000/user/${userId}`)
        .then(res => {
            if (!res.ok) throw new Error("Користувач не знайдений");
            return res.json();
        })
        .then(data => {
            const container = document.getElementById("stories-list");
            container.innerHTML = "";
            if (Array.isArray(data.stories)) {
                data.stories.forEach(({ name, city, story }) => {
                    const el = document.createElement("div");
                    el.className = "story";
                    el.innerHTML = `<strong>${name}</strong> з ${city || "невідомого міста"}:<p>${story}</p>`;
                    container.appendChild(el);
                });
            }
        })
        .catch(err => {
            console.error(err);
            alert("Не вдалося завантажити історії");
        });
}

// Обробка форми
document.getElementById("story-form").addEventListener("submit", function(e) {
    e.preventDefault();

    const name = this.name.value.trim();
    const city = this.city.value.trim();
    const story = this.story.value.trim();

    if (!name || !story) {
        alert("Будь ласка, заповніть ім'я та історію.");
        return;
    }

    fetch(`http://localhost:3000/user/${userId}/story`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, city, story }),
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message || "Історію надіслано!");
            loadStories(); // Оновити список історій
            this.reset();
        })
        .catch(err => {
            console.error(err);
            alert("Помилка при відправці історії.");
        });
});

// Збереження ID користувача з форми
function saveUserId() {
    const input = document.getElementById("user-id-input").value.trim();
    if (input) {
        localStorage.setItem("userId", input);
        alert("ID збережено. Перезавантажте сторінку або перейдіть на Профіль.");
        loadStories();
    }
}

// Прив’язуємо кнопку збереження ID
document.getElementById("save-userid-btn").addEventListener("click", function(e) {
    e.preventDefault();
    saveUserId();
});

// Завантажити історії після завантаження сторінки
document.addEventListener("DOMContentLoaded", loadStories); 
