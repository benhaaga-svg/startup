import React from 'react';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Signup } from './signup/signup';
import { Scores } from './scores/scores';
import { Leaderboard } from './leaderboard/leaderboard';
import { Upload } from './upload/upload';
import { Profile } from './profile/profile';
import { Home } from './home/home';
import { AuthState } from './login/authState';
import { Unauthenticated } from './login/unauthenticated';
import player from './classes/player';




export default function App() {

  const [user, setUser] = React.useState(JSON.parse(localStorage.getItem('user')) || {user: {userName: ''}});
  const currentAuthState = user.user.userName === "" ? AuthState.Unauthenticated : AuthState.Authenticated;
  const [authState, setAuthState] = React.useState(currentAuthState);


  const [globalStats, setGlobalStats] = React.useState({result: {playerCount: 0, totalGamesPlayed: 0, averageScore: 0, dateUpdated: new Date()}}); 

React.useEffect(() => {;
    fetchGlobalStats();
}, []);

async function fetchGlobalStats() {
    const response = await fetch('/api/globalStats');
    if (response.ok) {
        const data = await response.json();
        setGlobalStats(data);
    } else {
        console.error('Failed to fetch global stats');
        return {playerCount: 0, totalGamesPlayed: 0, averageScore: 0, dateUpdated: new Date()};
    }
  }
  console.log(authState);
  return (
    


    <BrowserRouter>
    <div className='div'>
      {currentAuthState === AuthState.Authenticated && <header className='header'>
        <nav className='header-nav'>
          <menu className='header-nav-menu'>
            {authState === AuthState.Authenticated && (
            <li className='header-nav-li'>
              <NavLink to="/home">Home</NavLink>
            </li>
            )}
            <li className='header-nav-li'>
              <NavLink to="/scores">Scores</NavLink>
            </li>
            <li className='header-nav-li'>
              <NavLink to="/upload">Upload</NavLink>
            </li>
            <li className='header-nav-li'>
              <NavLink to="/leaderboard">Leaderboard</NavLink>
            </li>
          </menu>
        </nav>
        <div className='header-profile'>
          <NavLink to="/profile" className='header-profile-link'>
            <span>{user.user.userName}</span>
            <img className='header-img' src="/blank_user.png" alt="Profile"/>
          </NavLink>
        </div>
      </header>}

      <Routes>
    <Route path='/' element={<Login
                userName={user.user.userName}
                authState={authState}
                onAuthChange={(userObj, authState) => {
                  setAuthState(authState);
                  setUser(userObj);
                }}
              />}/>
    <Route path='/home' element={<Home />} />
    <Route path='/scores' element={<Scores globalStatsProp={globalStats} />} />
    <Route path='/upload' element={<Upload globalStatsUpdate = {(newStats) => setGlobalStats(newStats)} />} />
    <Route path='/profile' element={<Profile
        onAuthChange={(userObj, authState) => {
          setAuthState(authState);
          setUser(userObj);
        }} />} />
    <Route path='/leaderboard' element={<Leaderboard globalStatsProp={globalStats} />} />
    <Route path='/signup' element={<Signup userName={user.user.userName} onLogin={(userObj) => {
                  setAuthState(AuthState.Authenticated);
                  setUser(userObj.user);
                }} />} />
    <Route path='*' element={<NotFound />} />
    </Routes>

      <footer className='footer'>

            <div className='footer-div'>
                <p className='p'>Designed by Ben Haaga in 2025 for cs260</p>
                <span> | </span>
                <a className='footer-a' href="https://github.com/benhaaga-svg/startup">Github Repository</a>
            </div>

        </footer>
    </div>
    </BrowserRouter>
  );
}

function NotFound() {
  return <main className="container-fluid bg-secondary text-center">404: Return to sender. Address unknown.</main>;
}