import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthState } from './authState';

export function Authenticated({ userName, onAuthChange }) {
  const navigate = useNavigate();
  return (
    <main>
            <div className="sign-in-square">
                <div><p>Welcome back! {userName}</p></div>
                <button onClick={() => navigate('/home')}>Continue</button>
                <button onClick={() => {
                    localStorage.removeItem("userName");
                    localStorage.removeItem("signedIn");
                    onAuthChange('', AuthState.Unauthenticated);
                    navigate('/'); }}>Not me</button>
            </div>
        </main>
  );

}