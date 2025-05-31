document.addEventListener("DOMContentLoaded", () => {
  const map = L.map("map").setView([48.3794, 31.1656], 6); // Центр України

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);

  const kindnessActs = [
    {
      name: "Ірина",
      city: "Львів",
      coords: [49.8397, 24.0297],
      story: "Допомогла літній сусідці з покупками.",
    },
    {
      name: "Олександр",
      city: "Одеса",
      coords: [46.4825, 30.7233],
      story: "Організував благодійний концерт.",
    },
    {
      name: "Марина",
      city: "Харків",
      coords: [49.9935, 36.2304],
      story: "Провела безкоштовний майстер-клас для дітей.",
    },
  ];

  kindnessActs.forEach((act) => {
    L.marker(act.coords)
      .addTo(map)
      .bindPopup(`<strong>${act.name} (${act.city})</strong><br>${act.story}`);
  });
});
