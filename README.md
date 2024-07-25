# Weather App w ReactJS

A simple React.js-based weather application that displays the current weather information for a specified city.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [File Structure](#file-structure)
- [Components](#components)
- [Styling](#styling)
- [Environment Variables](#environment-variables)
- [License](#license)

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/CBJdereal/ReactJSWeatherApp.git
   ```

2. Navigate to the project directory:
   ```sh
   cd ReactJSWeatherApp
   ```

3. Install the dependencies:
   ```sh
   npm install
   ```

4. Create a `.env` file in the root of your project and add your OpenWeatherMap API key:
   ```sh
   VITE_APP_API_KEY=your_api_key_here
   ```

5. Start the development server:
   ```sh
   npm run dev
   ```

## Usage

After following the installation steps, open your browser and navigate to `(http://localhost:5173)` to view the app. The app will display the current weather information for the default city (Dubai). You can search for other cities using the search bar.

## File Structure

The project structure is as follows:

```
weather-app/
│
├── dist/
├── node_modules/
├── public/
│   ├── vite.svg
│
├── src/
│   ├── assets/
│   │   ├── search.png
│   │   ├── clear.png
│   │   ├── cloud.png
│   │   ├── drizzle.png
│   │   ├── rain.png
│   │   ├── humidity.png
│   │   ├── snow.png
│   │   └── wind.png
│   │
│   ├── components/
│   │   └── Weather.jsx
│   │
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│
├── .env
├── .eslint.cjs
├── .gitignore
├── index.html
├── package-lock.json
├── package.json
├── README.md
└── vite.config.js
```

## Components

### App.jsx

This is the main component of the app.

```jsx
import React from 'react';
import Weather from './components/Weather.jsx';

const App = () => {
  return (
    <div className="app">
      <Weather />
    </div>
  );
};

export default App;
```

### Weather.jsx

The `Weather` component is responsible for fetching and displaying the weather data.

```jsx
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
```

## Styling

The styles for the app are defined in `Weather.css`.

```css
.weather {
    place-self: center;
    padding: 40px;
    border-radius: 10px;
    background-image: linear-gradient(45deg, #0014ab 0%, #000000 40%);
    display: flex;
    flex-direction: column;
    align-items: center; 
}

.search-bar {
    display: flex;
    align-items: center;
    gap: 12px;
}

.search-bar input {
    height: 50px;
    border: none;
    outline: none;
    border-radius: 40px;
    padding-left: 25px;
    color: rgb(255, 255, 255);
    background-image: linear-gradient(45deg, #000000 0%, #001eff 100%);
}

.search-bar img {
    width: 50px;
    padding: 15px;
    border-radius: 50%;
    background: #ebfffc;
    cursor: pointer;
}

.weather-icon {
    width: 150px;
    margin: 30px 0;
    display: flex;
    justify-content: center;
}

.temperature {
    color: #ebfffc;
    font-size: 50px;
    line-height: 1;
}

.location {
    color: #ebfffc;
    font-size: 27px;
    line-height: 1;
}

.weather-data {
    width: 100%;
    margin-top: 40px;
    color: #ffffff;
    display: flex;
    justify-content: space-between;
}

.weather-data .col {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    font-size: 19px;
}

.weather-data .col span {
    display: block; 
    font-size: 19px;
}

.weather-data .col img {
    width:

 28px;
    margin-top: 12px;
    margin-left: 19px;
}
.error-message {
    color: white;
    font-size: 14px;
    margin-top: 10px;
    padding: 5px;
    border-radius: 4px;
    text-align: center;
}
```

## Environment Variables

Create a `.env` file in the root of your project and add your OpenWeatherMap API key (https://openweathermap.org):
```sh
VITE_APP_API_KEY=your_api_key_here
```

---

Make sure to replace `"your_api_key_here"` with your actual OpenWeatherMap API key in the `.env` file.


## Test Demo Cases

### 1. Normal Case

#### Description
In this case, we test the application by entering a valid city name like Dubai and verifying the displayed weather information.

#### Screenshot
![img](https://github.com/CBJdereal/ReactJSWeatherApp/assets/64748236/f75db25e-92e6-4849-9299-51a73222f5b7)


### 2. Proof of the First Normal Case

![img](https://github.com/CBJdereal/ReactJSWeatherApp/assets/64748236/243e1fb2-8f46-4d9d-9985-cea5d5feca7e)

### 3. Another Example of a Normal Case

#### Description
In this case, we test the application by entering a valid city name like Delhi and verifying the displayed weather information.

#### Screenshot
![img](https://github.com/CBJdereal/ReactJSWeatherApp/assets/64748236/8c837653-4c94-4369-b82d-a2fcc4774f6e)


### 4. Proof of the Second Normal Case

![img](https://github.com/CBJdereal/ReactJSWeatherApp/assets/64748236/6ce409a1-63dd-4567-9ab6-81fbbf638a85)

### 5. API Key Error Catch

![img](https://github.com/CBJdereal/ReactJSWeatherApp/assets/64748236/4a003d44-a67b-46d4-a2ab-8c537aca89e5)

### 6. Not Valid Location Error Catch

![img](https://github.com/CBJdereal/ReactJSWeatherApp/assets/64748236/47bbec7c-88c4-428f-9eb1-adf09660aa4c)

### 6. Empty Search Bar Error Catch

![img](https://github.com/CBJdereal/ReactJSWeatherApp/assets/64748236/49444e94-709b-491e-9d6e-849d0f33fbae)










