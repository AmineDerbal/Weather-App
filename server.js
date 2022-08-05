require("dotenv").config();
const express = require("express");
console.log(process.env);
const cors = require("cors");
const app = express();
const port = 3000;
const fetch = require("node-fetch");

app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(express.json());

app.use(cors());

//test route

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/", async (req, res) => {
  const city = req.body.city;
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}`;

  const weatherStream = await fetch(url);
  const weatherData = await weatherStream.json();
  res.json(weatherData);
});

app.listen(port);
