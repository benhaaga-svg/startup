import React from 'react';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const navigate = useNavigate();

  return (
    <main>
            <h1>Track Your Bids</h1>
            <div className="sign-in-square">
                <div><p>Username: </p><input placeholder="Username" /></div>
                <div><p>Password: </p><input placeholder="Password" /></div>
                <div>
                    <button onClick={() => navigate('/home')}>Login</button>
                    <button onClick={() => navigate('/signup')}>Create</button>
                </div>
            </div>
        </main>
  );
}