import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthState } from '../login/authState';
import './profile.css';

export function Profile({ onAuthChange }) {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("userName");
    localStorage.removeItem("signedIn");
    onAuthChange('', AuthState.Unauthenticated);
    navigate('/');
  }

  return (
    <main className="profile-main">
           <h2>My Info</h2>
           <h4>My Stats</h4>
           <h5>From: <input placeholder="MM/DD/YYYY"></input> To: <input placeholder="MM/DD/YYYY"></input></h5>
           <button>Search</button>
            <h5> Games Played: 12 | W/L Ration: 2/12 | AVG Score: 24 </h5>
           <h4>All-Time</h4>
           <h5>Global Standing: 12th | Games Played: 12 | W/L Ration: 2/12 | AVG Score: 24 | Last Played: 03/22/2025</h5>

           <div><p>Name: Ben Haaga | Tracking started: 06/06/2025</p></div>


            <button onClick={handleLogout}>Logout</button>

        </main>
  );
}