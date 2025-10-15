import React from 'react';
import { AuthState } from './authState';
import { Unauthenticated } from './unauthenticated';
import { useNavigate } from 'react-router-dom';
import { Authenticated } from './authenticated';

export function Login({ userName, authState, onAuthChange }) {
  const navigate = useNavigate();

  return (
    <main>
        {authState !== AuthState.Unknown && <h1>Track Your Bids</h1>}
        {authState === AuthState.Unauthenticated && <Unauthenticated onAuthChange={onAuthChange}/>}
        {authState === AuthState.Authenticated && <Authenticated userName={userName} onAuthChange={onAuthChange} AuthState={AuthState} />}
    </main>
  );
}