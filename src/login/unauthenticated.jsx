import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthState } from './authState';

export function Unauthenticated({ onAuthChange }) {
  const navigate = useNavigate();
    const [displayError, setDisplayError] = React.useState(false);
  function handleLogin() {

    const enteredUserName = document.querySelector('input[id="username-input"]').value;
    const enteredPassword = document.querySelector('input[id="password-input"]').value;
    if (enteredUserName === localStorage.getItem("userName") && enteredPassword !== "") {
        // Set lilac/periwinkle theme for Elle
        if (enteredUserName.toLowerCase().includes("el")) {
    const periwinkleColor = '#9575cd'; // Lilac/periwinkle color
    localStorage.setItem('themeColor', periwinkleColor);

            // Apply theme immediately
            applyElleTheme(periwinkleColor);
        }

        onAuthChange(enteredUserName, AuthState.Authenticated);
        navigate('/home');
    } else {
        setDisplayError(true);
    }
  }

  function applyElleTheme(color) {
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

  return (
            <div className="sign-in-square">
                <div><p>Username: </p><input placeholder="Username" id='username-input' className={displayError ? 'error' : ''}/></div>
                <div><p>Password: </p><input placeholder="Password" id='password-input' type="password" className={displayError ? 'error' : ''}/></div>
                {displayError && <div id="error-message">Incorrect username or password</div>}
                <div>
                    <button onClick={handleLogin}>Login</button>
                    <button onClick={() => navigate('/signup')}>Create</button>
                </div>
            </div>
  );

}