const fetchWeather = async (city) => {
  if (document.querySelector(".city-weather-info")) {
    cityWeather = document.querySelector(".city-weather-info");
    cityWeather.parentNode.removeChild(cityWeather);
  }
  toggleLoaderDisplay();
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      city: city,
    }),
  };
  try {
    const weatherStream = await fetch("/", options);
    const weatherJson = await weatherStream.json();
    return weatherJson;
  } catch (err) {
    return { Error: err.stack };
  }
};

const city = document.getElementById("city");
const submit = document.querySelector(".submit");
const weatherInformation = document.getElementById("weather-information");
const lodaer = document.querySelector(".lds-ring");

submit.addEventListener("click", async () => {
  if (city.value != "") {
    let data = await fetchWeather(city.value);

    city.value = "";

    toggleLoaderDisplay();

    const cityWeatherInfo = document.createElement("div");
    cityWeatherInfo.classList.add("city-weather-info");
    weatherInformation.appendChild(cityWeatherInfo);
    if (data.message) {
      const cityNotFound = document.createElement("p");
      cityNotFound.classList.add("city-not-found");
      cityNotFound.innerHTML = `City not found , please follow this order when typing your city, <br> Example - London, GB or New York, US.
        <br> for more informations please consult this page (<a href='https://www.iban.com/country-codes'>ISO3166).</a>`;
      cityWeatherInfo.append(cityNotFound);
      return;
    }

    const cityInformations = document.createElement("div");
    cityInformations.classList.add("city-informations");
    cityWeatherInfo.appendChild(cityInformations);

    const cityInformationTitle = document.createElement("h1");
    cityInformationTitle.classList.add("city-informations-title");
    cityInformationTitle.textContent = `${data.name} , ${data.sys.country}`;
    cityInformations.appendChild(cityInformationTitle);

    const date = new Date(),
      dformat =
        [date.getMonth() + 1, date.getDate(), date.getFullYear()].join("/") +
        " " +
        [date.getHours(), date.getMinutes(), date.getSeconds()].join(":");
    const dateDisplay = document.createElement("p");
    dateDisplay.textContent = date;
    cityInformations.appendChild(dateDisplay);

    const weather = document.createElement("div");
    weather.classList.add("weather");
    cityWeatherInfo.appendChild(weather);

    const weatherData = document.createElement("div");
    weatherData.classList.add("weather-data");
    weather.appendChild(weatherData);

    const tempData = document.createElement("div");
    tempData.className = "temp-data";
    weatherData.appendChild(tempData);
    const temp = document.createElement("p");
    temp.textContent = `Temp : ${kelvinToCelsius(data.main.temp)}°`;
    tempData.appendChild(temp);
    const feelslike = document.createElement("p");
    feelslike.textContent = `feels like : ${kelvinToCelsius(
      data.main.feels_like
    )}°`;
    tempData.appendChild(feelslike);
    const tempMinMax = document.createElement("p");
    tempMinMax.textContent = `min/max : ${kelvinToCelsius(
      data.main.temp_min
    )}°/${kelvinToCelsius(data.main.temp_max)}°`;
    tempData.appendChild(tempMinMax);
    const humidity = document.createElement("p");
    humidity.textContent = `humidity : ${data.main.humidity}%`;
    tempData.appendChild(humidity);

    const weatherDescription = document.createElement("div");
    weather.appendChild(weatherDescription);

    const img = document.createElement("img");
    img.classList.add("img");
    img.src =
      "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png";

    const description = document.createElement("p");
    description.classList.add("weather-description");
    description.textContent = data.weather[0].description;

    weatherDescription.appendChild(description);
    weatherDescription.appendChild(img);
  }
});

city.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    submit.click();
  }
});

const kelvinToCelsius = (temp) => {
  return Math.floor(temp - 273.15);
};

const toggleLoaderDisplay = () => {
  lodaer.style.display =
    lodaer.style.display == "inline-block" ? "none" : "inline-block";
};
