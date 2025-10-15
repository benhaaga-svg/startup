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
        onAuthChange(enteredUserName, AuthState.Authenticated);
        navigate('/home');
    } else {
        setDisplayError(true);
    }
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