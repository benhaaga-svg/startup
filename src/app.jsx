import React from 'react';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import { Login } from './login/login';
import { Signup } from './signup/signup';
import { Scores } from './scores/scores';
import { Leaderboard } from './leaderboard/leaderboard';
import { Upload } from './upload/upload';
import { Profile } from './profile/profile';
import { Home } from './home/home';
import { AuthState } from './login/authState';
import { Unauthenticated } from './login/unauthenticated';
import { UploadEvent, UploadNotifier } from './classes/globalStatsNotifier';
import { setUnauthorizedHandler, authFetch } from './utils/authFetch';

function AppContent() {
  const navigate = useNavigate();
  const [user, setUser] = React.useState(JSON.parse(localStorage.getItem('user')) || {userName: '', firstName: '', lastName: '', dob: ''});
  const currentAuthState = user.userName === "" ? AuthState.Unauthenticated : AuthState.Authenticated;
  const [authState, setAuthState] = React.useState(currentAuthState);
  const [events, setEvent] = React.useState([]);

  React.useEffect(() => {
    UploadNotifier.addHandler(handleUploadEvent);

    return () => {
      UploadNotifier.removeHandler(handleUploadEvent);
    };
  }, []);

  React.useEffect(() => {
    // Set up the global unauthorized handler
    setUnauthorizedHandler(() => {
      handleUnauthorized();
    });

    verifyAuthentication();
  }, []);

  function handleUnauthorized() {
    console.log('Unauthorized access detected - redirecting to login');
    localStorage.removeItem('user');
    setUser({userName: '', firstName: '', lastName: '', dob: ''});
    setAuthState(AuthState.Unauthenticated);
    navigate('/');
  }

  async function verifyAuthentication() {
    try {
      const response = await authFetch('/api/auth/verify');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setAuthState(AuthState.Authenticated);
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        localStorage.removeItem('user');
        setUser({userName: '', firstName: '', lastName: '', dob: ''});
        setAuthState(AuthState.Unauthenticated);
      }
    } catch (error) {
      console.error('Error verifying authentication:', error);
      localStorage.removeItem('user');
      setUser({userName: '', firstName: '', lastName: '', dob: ''});
      setAuthState(AuthState.Unauthenticated);
    }
  }

  function handleUploadEvent(event) {
    setEvent((prevEvents) => [...prevEvents, event]);
  }

  React.useEffect(() => {
    const lastEvent = events[events.length - 1];
    if (lastEvent) {
      console.log("Received WebSocket event:", lastEvent);
    }
    if(lastEvent && lastEvent.type === UploadEvent.End) {
      console.log("Updating global stats from WebSocket event");
      if(lastEvent.value && lastEvent.value.msg) {
        setGlobalStats(lastEvent.value.msg);
      } else {
        // Fallback to fetching if stats not in event
        fetchGlobalStats();
      }
    }
  }, [events]);

  const [globalStats, setGlobalStats] = React.useState({playerCount: 0, totalGamesPlayed: 0, averageScore: 0, dateUpdated: new Date()}); 

React.useEffect(() => {;
    fetchGlobalStats();
}, []);

async function fetchGlobalStats() {
    try {
      const response = await authFetch('/api/globalStats');
      if (response.ok) {
          const data = await response.json();
          setGlobalStats(data);
      } else {
          console.error('Failed to fetch global stats');
          return {playerCount: 0, totalGamesPlayed: 0, averageScore: 0, dateUpdated: new Date()};
      }
    } catch (error) {
      console.error('Failed to fetch global stats:', error);
      return {playerCount: 0, totalGamesPlayed: 0, averageScore: 0, dateUpdated: new Date()};
    }
  }
  console.log(authState);
  return (
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
            <span>{user.userName}</span>
            <img className='header-img' src="/blank_user.png" alt="Profile"/>
          </NavLink>
        </div>
      </header>}

      <Routes>
    <Route path='/' element={<Login
                userName={user.userName}
                authState={authState}
                onAuthChange={(userObj, authState) => {
                  setAuthState(authState);
                  setUser(userObj);
                }}
              />}/>
    <Route path='/home' element={<Home />} />
    <Route path='/scores' element={<Scores globalStatsProp={globalStats} />} />
    <Route path='/upload' element={<Upload globalStatsUpdate = {(newstats) => setGlobalStats(newstats)} />} />
    <Route path='/profile' element={<Profile
        onAuthChange={(userObj, authState) => {
          setAuthState(authState);
          setUser(userObj);
        }} user={user} />} />
    <Route path='/leaderboard' element={<Leaderboard globalStatsProp={globalStats} />} />
    <Route path='/signup' element={<Signup userName={user.userName} onLogin={(userObj) => {
                  setAuthState(AuthState.Authenticated);
                  setUser(userObj);
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
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function NotFound() {
  return <main className="container-fluid bg-secondary text-center">404: Return to sender. Address unknown.</main>;
}