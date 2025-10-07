import React from 'react';

export function Signup() {
  return (
    <main>
            <h1>Sign Up</h1>
            <div class="sign-in-square">
            <div><p>First Name: </p><input></input></div>
            <div><p>Last Name: </p><input></input></div>
            <div><p>Date of Birth: </p><input placeholder="MM/DD/YYYY"></input></div>
            <div><p>Username: </p><input></input></div>
            <div><p>Password: </p><input></input></div>
            <div><p>Password Again: </p><input></input></div>
            <div>
                <button onClick={() => window.location.back()}>Login</button>
                <button onClick={() => window.history.back()}>Go Back</button>
            </div>
            </div>
        </main>
  );
}