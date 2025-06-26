fetch('user_data.json')
    .then(res => res.json())
    .then(data => {
            const mapEl = document.getElementById("map")
            if (!mapEl) return

            const map = L.map("map").setView([49, 31], 6)
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map)

            const input = document.getElementById("citySearch")
            let markers = []

            const users = Object.entries(data).map(([id, user]) => ({
                id,
                name: user.name || "Невідомо",
                city: user.city || "Невідомо",
                specialty: user.specialty || "",
                help: user.help_description || "",
                came_from: user.came_from || null,
                referal: user.referal || "",
            }))

            function renderMarkers(filterCity = "") {
                markers.forEach(m => map.removeLayer(m))
                markers = []

                users.forEach(user => {
                            if (filterCity && !user.city.toLowerCase().includes(filterCity.toLowerCase())) return

                            // Тестова позиція (реальні координати можна брати з city → geocoding)
                            const latlng = [
                                user.city.includes("Дніпро") ? 48.4647 :
                                user.city.includes("Київ") ? 50.4501 :
                                49.0,
                                user.city.includes("Дніпро") ? 35.0462 :
                                user.city.includes("Київ") ? 30.5234 :
                                31.0
                            ]

                            const marker = L.marker(latlng).addTo(map)
                            marker.bindPopup(`
          <strong>${user.name}</strong><br/>
          <em>${user.city}</em><br/>
          ${user.specialty}<br/>
          ${user.help}<br/>
          ${user.referal ? `<a href="${user.referal}" target="_blank">Реферальне посилання</a>` : ""}
        `)

        markers.push(marker)
      })
    }

    if (input) {
      input.addEventListener("input", () => {
        renderMarkers(input.value)
      })
    }

    renderMarkers()
  })
