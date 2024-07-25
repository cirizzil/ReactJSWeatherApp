import React, { useEffect, useState } from 'react';
import './Weather.css';
import search_icon from '../assets/search.png';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import rain_icon from '../assets/rain.png';
import humidity_icon from '../assets/humidity.png';
import snow_icon from '../assets/snow.png';
import wind_icon from '../assets/wind.png';

const Weather = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [city, setCity] = useState('Dubai'); // Default city
    const [inputValue, setInputValue] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const allIcons = {
        "01d": clear_icon,
        "01n": clear_icon,
        "02d": cloud_icon,
        "02n": cloud_icon,
        "03d": cloud_icon,
        "03n": cloud_icon,
        "04d": drizzle_icon,
        "04n": drizzle_icon,
        "09d": rain_icon,
        "09n": rain_icon,
        "10d": rain_icon,
        "10n": rain_icon,
        "13d": snow_icon,
        "13n": snow_icon,
    };

    const search = async (city) => {
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_API_KEY}`;
            const response = await fetch(url);
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Invalid location');
                } else if (response.status === 401) {
                    throw new Error('Invalid API key');
                } else {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }
            }
            const data = await response.json();
            console.log(data);
            const icon = allIcons[data.weather[0].icon] || clear_icon;
            setWeatherData({
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                temperature: Math.floor(data.main.temp),
                location: data.name,
                icon: icon
            });
            setErrorMessage(''); // Clear any existing error message
        } catch (error) {
            console.error(error);
            if (error.message === 'Invalid location') {
                setErrorMessage('Whoops, make sure you have entered a valid location.');
            } else if (error.message === 'Invalid API key') {
                setErrorMessage('There was an issue fetching the weather data. Please check your API key and try again.');
            } else {
                setErrorMessage('An error occurred while fetching the weather data.');
            }
            setWeatherData(null); // Clear weather data
        }
    };

    useEffect(() => {
        search(city);
    }, [city]);

    const handleSearch = () => {
        if (inputValue.trim() === '') {
            setErrorMessage('Yo, type in a city!');
        } else {
            setCity(inputValue);
            setErrorMessage(''); // Clear any existing error message
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className='weather'>
            <div className='search-bar'>
                <input 
                    type='text' 
                    placeholder='Search...' 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <img 
                    src={search_icon} 
                    alt='Search Icon' 
                    onClick={handleSearch} 
                    style={{ cursor: 'pointer' }}
                />
            </div>
            {errorMessage && <p className='error-message'>{errorMessage}</p>}
            {weatherData && (
                <>
                    <img src={weatherData.icon} alt='Weather Icon' className='weather-icon' />
                    <p className='temperature'>{weatherData.temperature}°C</p>
                    <p className='location'>{weatherData.location}</p>
                    <div className='weather-data'>
                        <div className='col'>
                            <img src={humidity_icon} alt='Humidity Icon' />
                            <div>
                                <p>{weatherData.humidity}%</p>
                                <span>Humidity</span>
                            </div>
                        </div>
                        <div className='col'>
                            <img src={wind_icon} alt='Wind Icon' />
                            <div>
                                <p>{weatherData.windSpeed} KM/hr</p>
                                <span>Wind Speed</span>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Weather;
