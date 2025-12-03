import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthState } from './authState';

export function Unauthenticated(props) {
  const navigate = useNavigate();
  const [userName, setUserName] = React.useState(props.userName);
  const [password, setPassword] = React.useState('');

    const [displayError, setDisplayError] = React.useState(false);
  async function loginUser() {
    login(`/api/auth/login`);
  }


  async function login(endpoint) {
    const response = await fetch(endpoint, {
      method: 'post',
      body: JSON.stringify({ userName: userName, password: password }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    if (response?.status === 200) {
      const body = await response.json();
      localStorage.setItem('user', JSON.stringify(body.user));
      props.onLogin(body.user);
      navigate("/home");
    } else {
      const body = await response.json();
      setDisplayError(`⚠ Error: ${body.msg}`);
    }
  }

  return (
            <div className="sign-in-square">
                <div><p>Username: </p><input placeholder="Username" id='username-input' className={displayError ? 'error' : ''} onChange={(e) => setUserName(e.target.value)} /></div>
                <div><p>Password: </p><input type='password' className={displayError ? 'error' : ''} onChange={(e) => setPassword(e.target.value)} placeholder='password' /></div>
                {displayError && <div id="error-message">Incorrect username or password</div>}
                <div>
                    <button onClick={() => loginUser()}>Login</button>
                    <button onClick={() => navigate('/signup')}>Create</button>
                </div>
            </div>
  );

}