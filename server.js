const express = require("express");
const fs = require("fs");
const app = express();

app.get("/user/:id", (req, res) => {
    const userId = req.params.id;
    const filePath = `users_${userId}.json`;

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "Користувач не знайдений" });
    }

    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    res.json(data);
});

app.listen(3000, () => console.log("Сервер працює на http://localhost:3000"));

fetch("http://localhost:3000/user/123456")
    .then(res => res.json())
    .then(data => console.log(data));
