import { useEffect, useState } from "react";

export default function WeatherComponent() {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      const params = {
        latitude: 3.4516,
        longitude: -76.5320,
        hourly: "temperature_2m,precipitation,precipitation_probability",
        timezone: "America/Bogota",
      };

      const query = new URLSearchParams(params).toString();
      const url = `https://api.open-meteo.com/v1/forecast?${query}`;

      try {
        const res = await fetch(url);
        const data = await res.json();

        const times = data.hourly.time.map((timeStr) => new Date(timeStr));
        const temperatures = data.hourly.temperature_2m;
        const precipitation = data.hourly.precipitation; // mm/h
        const precipitationProbability = data.hourly.precipitation_probability; // %

        // Obtener el índice de la hora más cercana a la actual
        const now = new Date();
        const currentIndex = times.findIndex(
          (time) => time.getHours() === now.getHours() && time.getDate() === now.getDate()
        );

        const isRaining = 
          precipitation[currentIndex] > 0 || precipitationProbability[currentIndex] >= 50;

        console.log("¿Está lloviendo?:", isRaining);

        setWeatherData({ times, temperatures, precipitation, precipitationProbability, isRaining });
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };


    fetchWeather();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Clima en Cali</h2>
      {weatherData ? (
        <ul>
          {weatherData.times.map((time, i) => (
            <li key={i}>
              {time.toISOString()}: {weatherData.temperatures[i]} °C
            </li>
          ))}
        </ul>
      ) : (
        <p>Cargando datos del clima...</p>
      )}
    </div>
  );
}
