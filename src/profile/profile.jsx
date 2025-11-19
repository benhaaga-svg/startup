import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthState } from '../login/authState';
import './profile.css';

export function Profile({ onAuthChange }) {
  const navigate = useNavigate();
  const [themeColor, setThemeColor] = React.useState(
    localStorage.getItem('themeColor') || '#1a237e'
  );

  React.useEffect(() => {
    // Apply saved theme on component mount
    const savedColor = localStorage.getItem('themeColor');
    if (savedColor) {
      applyTheme(savedColor);
    }
  }, []);

  function applyTheme(color) {
    // Convert hex to RGB for lighter shade
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    // Create lighter shade by adding 20 to each component
    const lighterR = Math.min(255, r + 20);
    const lighterG = Math.min(255, g + 20);
    const lighterB = Math.min(255, b + 20);
    const lighterColor = `#${lighterR.toString(16).padStart(2, '0')}${lighterG.toString(16).padStart(2, '0')}${lighterB.toString(16).padStart(2, '0')}`;

    // Create accent colors (brighter versions)
    const accentR = Math.min(255, r + 40);
    const accentG = Math.min(255, g + 40);
    const accentB = Math.min(255, b + 70);
    const accentColor = `#${accentR.toString(16).padStart(2, '0')}${accentG.toString(16).padStart(2, '0')}${accentB.toString(16).padStart(2, '0')}`;

    const accentLightR = Math.min(255, r + 60);
    const accentLightG = Math.min(255, g + 100);
    const accentLightB = Math.min(255, b + 160);
    const accentLightColor = `#${accentLightR.toString(16).padStart(2, '0')}${accentLightG.toString(16).padStart(2, '0')}${accentLightB.toString(16).padStart(2, '0')}`;

    // Apply to CSS variables
    document.documentElement.style.setProperty('--primary-color', color);
    document.documentElement.style.setProperty('--primary-light', lighterColor);
    document.documentElement.style.setProperty('--accent-color', accentColor);
    document.documentElement.style.setProperty('--accent-light', accentLightColor);
  }

  function handleColorChange(e) {
    const newColor = e.target.value;
    setThemeColor(newColor);
    applyTheme(newColor);
    localStorage.setItem('themeColor', newColor);
  }

  async function handleLogout() {
    localStorage.removeItem("user");

    await fetch('/api/auth/logout', { method: 'delete' });

    // Reset theme to default
    const defaultColor = '#1a237e';
    applyTheme(defaultColor);

    onAuthChange({user: {userName: ''}}, AuthState.Unauthenticated);
    navigate('/');
  }

  return (
    <main className="profile-main">
           <h2>My Info</h2>
           <h4>My Stats</h4>
            <h5> Games Played: 12 | W/L Ratio: 2/12 | AVG Score: 24 | Highest Score: 101 | Global Ranking: 12th</h5>

           <div><p>Name: Ben Haaga | Tracking started: 06/06/2025</p></div>

           <div className="theme-picker">
             <h4>Theme Color</h4>
             <div className="color-picker-container">
               <label htmlFor="theme-color">Choose your theme color:</label>
               <input
                 type="color"
                 id="theme-color"
                 value={themeColor}
                 onChange={handleColorChange}
                 className="color-input"
               />
               <span className="color-value">{themeColor}</span>
             </div>
           </div>

            <button onClick={handleLogout}>Logout</button>

        </main>
  );
}