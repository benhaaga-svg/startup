import React from 'react';

export function Login() {
  return (
    <main>
            <h1>Track Your Bids</h1>
            <div className="sign-in-square">
                <div><p>Username: </p><input placeholder="Username" /></div>
                <div><p>Password: </p><input placeholder="Password" /></div>
                <div>
                    <button onClick={() => window.location.href = "/home"}>Login</button>
                    <button onClick={() => window.location.href = "/signup"}>Create</button>
                </div>
            </div>
        </main>
  );
}