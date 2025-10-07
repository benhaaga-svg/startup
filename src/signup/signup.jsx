import React from 'react';
import { useNavigate } from 'react-router-dom';

export function Signup() {
  const navigate = useNavigate();

  return (
    <main>
            <h1>Sign Up</h1>
            <div className="sign-in-square">
            <div><p>First Name: </p><input></input></div>
            <div><p>Last Name: </p><input></input></div>
            <div><p>Date of Birth: </p><input placeholder="MM/DD/YYYY"></input></div>
            <div><p>Username: </p><input></input></div>
            <div><p>Password: </p><input></input></div>
            <div><p>Password Again: </p><input></input></div>
            <div>
                <button onClick={() => navigate('/home')}>Login</button>
                <button onClick={() => navigate(-1)}>Go Back</button>
            </div>
            </div>
        </main>
  );
}