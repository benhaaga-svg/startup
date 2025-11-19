import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthState } from './authState';

export function Authenticated(props) {
  const navigate = useNavigate();


async function handleLogout() {
    localStorage.removeItem("user");

    await fetch('/api/auth/logout', { method: 'delete' });

    // Reset theme to default

    props.onLogout();
    navigate('/');
  }

  return (
    <main>
            <div className="sign-in-square">
                <div><p>Welcome back! {props.userName}</p></div>
                <button onClick={() => navigate('/home')}>Continue</button>
                <button onClick={() => {
                    handleLogout();
                     }}>Not me</button>
            </div>
        </main>
  );

}