import React, { useState, useEffect } from "react";
import "../styles/MainContainer.css";

function MainContainer(props) {

  function formatDate(daysFromNow = 0) {
    let output = "";
    var date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    output += date.toLocaleString("en-US", { weekday: "long" }).toUpperCase();
    output += " " + date.getDate();
    return output;
  }

  const [forecast, setForecast] = useState(null);
  const [aqi, setAqi] = useState(null);
  
  const { apiKey, selectedCity } = props;

  useEffect(() => {
    const fetchForecastData = () => {
      const apiCall = `https://api.openweathermap.org/data/2.5/forecast?lat=${selectedCity.lat}&lon=${selectedCity.lon}&appid=${apiKey}&units=imperial`;
      
      fetch(apiCall)
        .then((response) => response.json())
        .then((data) => {
          console.log("Forecast data:", data);
          setForecast(data);
        })
    };

    const fetchAQIData = () => {
      const aqiCall = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${selectedCity.lat}&lon=${selectedCity.lon}&appid=${apiKey}`;
      
      fetch(aqiCall)
        .then((response) => response.json())
        .then((data) => {
          console.log("AQI data:", data);
          setAqi(data);
        })
    };
    
    if (selectedCity && selectedCity.lat && selectedCity.lon) {
      setForecast(null);
      setAqi(null);
      fetchForecastData();
      fetchAQIData();
    }
  }, [selectedCity, apiKey]); 

  function WeatherCard(item, daysFromNow) {
    return (
      <div className="forecast-card" key={daysFromNow}>
        <p className="day-forecast">{formatDate(daysFromNow)}</p>
        <img 
          className="forecast-icon"
          src={require(`../icons/${item.weather[0].icon}.svg`)} 
          alt="weather icon"
        />
        <p className="forecast-temp">{Math.round(item.main.temp_max)}° to {Math.round(item.main.temp_min)}°</p>
      </div>
    );
  }
  
  return (
    <div id="main-container">
      <div id="weather-container">
        {!selectedCity ? (
          <div className="select-city-message">
            <h2>Enter a city!</h2>
            <p>Search for a city to see its weather forecast :D</p>
          </div>
        ) : (
          <>
            <div className="header-section">
              <p>{formatDate(0)}</p>
              <h1 className="location">Weather for {selectedCity.fullName}</h1>
            </div>
            
            {forecast && 
              <div className="current-weather-show">
                <div className="current-weather-details">
                  <p className="condition">{forecast.list[0].weather[0].main}</p>
                  <p>{forecast.list[0].weather[0].description}</p>
                  <h1 className="temp">{Math.round(forecast.list[0].main.temp)}°</h1>
                  {aqi && aqi.list && aqi.list[0] && (
                    <p className="aqi-display">AQI: {aqi.list[0].main.aqi}</p>
                  )}
                </div>
                <div className="current-weather-icon">
                  <img 
                    src={require(`../icons/${forecast.list[0].weather[0].icon}.svg`)} 
                    alt="weather icon"
                  />
                </div>
              </div>
            }
            
            {forecast &&
              <div className="forecast">
                {forecast.list
                  .filter((item, index) => {
                    // Get one entry per day at around noon (12:00)
                    const date = new Date(item.dt * 1000);
                    const hour = date.getHours();
                    return hour >= 11 && hour <= 13;
                  })
                  .slice(0, 5)
                  .map((item, index) => WeatherCard(item, index + 1))
                }
              </div>
            }
          </>
        )}
      </div>
    </div>
  );
}

export default MainContainer;