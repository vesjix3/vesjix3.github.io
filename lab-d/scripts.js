const API_KEY = "1d8da1dd0ec597aa0b3293b46b291cf4";

const cityInput = document.getElementById("cityInput");
const weatherBtn = document.getElementById("weatherBtn");

const cityEl = document.querySelector(".city");
const date = document.querySelector(".date");
const time = document.querySelector(".time");
const status = document.querySelector(".status");
const centerPanel = document.querySelector(".center-panel");
const details = document.querySelector(".details");
const temp = document.querySelector(".temp");
const forecast = document.querySelector(".forecast");

weatherBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  getCurrentWeather(city);
  getForecast(city);
});

function getCurrentWeather(city) {
  const xhr = new XMLHttpRequest();
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=pl`;

  xhr.open("GET", url, true);

  xhr.onload = function () {
    if (xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      console.log("CURRENT WEATHER:", data);

      const utcNow = new Date();
      const cityTime = new Date(utcNow.getTime() + data.timezone * 1000);

      const months = [
        "STY", "LUT", "MAR", "KWI", "MAJ", "CZE",
        "LIP", "SIE", "WRZ", "PAŹ", "LIS", "GRU"
      ];

      const iconCode = data.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

      cityEl.textContent = data.name;
      time.textContent = cityTime.toLocaleTimeString("pl-PL", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC"
      });
      status.textContent = data.weather[0].description;

      centerPanel.innerHTML = `
        <img src="${iconUrl}" alt="${data.weather[0].description}">
      `;

      details.innerHTML = `
        Ciśnienie: ${data.main.pressure} hPa<br>
        Wilgotność: ${data.main.humidity}%<br>
        Wiatr: ${data.wind.speed} m/s
      `;

      temp.textContent = `${Math.round(data.main.temp)}°C`;
    } else {
      alert("Nie udało się pobrać bieżącej pogody.");
    }
  };

  xhr.onerror = function () {
    alert("Błąd połączenia z API current weather.");
  };

  xhr.send();
}

function getForecast(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=pl`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error("Błąd pobierania forecast");
      }
      return response.json();
    })
    .then(data => {
      console.log("FORECAST:", data);

      forecast.innerHTML = "";

      const dailyForecasts = data.list.filter(item =>
        item.dt_txt.includes("12:00:00")
      )

      dailyForecasts.forEach(item => {
        const date = new Date(item.dt_txt);
        const dayName = date.toLocaleDateString("pl-PL", { weekday: "short" });
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        const card = document.createElement("div");
        card.classList.add("forecast-card");


        card.innerHTML = `
          <h3>${dayName}</h3>
          <img src="${iconUrl}" alt="${item.weather[0].description}">
          <div class="day-temp">${Math.round(item.main.temp)}°C</div>
          <div class="night-temp">${item.weather[0].description}</div>
        `;

        forecast.appendChild(card);
      });
    })
    .catch(error => {
      console.error(error);
      alert("Nie udało się pobrać prognozy pogody.");
    });
}
