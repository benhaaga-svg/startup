import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthState } from './authState';

export function Authenticated(props) {
  const navigate = useNavigate();


function logout() {
    fetch(`/api/auth/logout`, {
      method: 'delete',
    })
      .catch(() => {
        // Logout failed. Assuming offline
      })
      .finally(() => {
        localStorage.removeItem('userName');
        props.onLogout();
        navigate('/');
      });
  }

  return (
    <main>
            <div className="sign-in-square">
                <div><p>Welcome back! {props.userName}</p></div>
                <button onClick={() => navigate('/home')}>Continue</button>
                <button onClick={() => {
                    logout();
                     }}>Not me</button>
            </div>
        </main>
  );

}