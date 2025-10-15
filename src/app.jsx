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




export default function App() {

  const [userName, setUserName] = React.useState(localStorage.getItem('userName') || '');
  const currentAuthState = userName ? AuthState.Authenticated : AuthState.Unauthenticated;
  const [authState, setAuthState] = React.useState(currentAuthState);
  console.log(authState);
  return (
    


    <BrowserRouter>
    <div className='div'>
      {currentAuthState === AuthState.Authenticated && <header className='header'>
        <nav className='header-nav'>
          <menu className='header-nav-menu'>
            <li className='header-nav-li'>
              <NavLink to="/">Login</NavLink>
            </li>
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
            <span>Profile</span>
            <img className='header-img' src="/blank_user.png" alt="Profile"/>
          </NavLink>
        </div>
      </header>}

      <Routes>
    <Route path='/' element={<Login
        userName={userName}
        authState={authState}
        onAuthChange={(userName,authState) =>
          {setAuthState(authState);
         setUserName(userName);}} />} exact />
    <Route path='/home' element={<Home />} />
    <Route path='/scores' element={<Scores />} />
    <Route path='/upload' element={<Upload />} />
    <Route path='/profile' element={<Profile
        onAuthChange={(userName,authState) =>
          {setAuthState(authState);
         setUserName(userName);}} />} />
    <Route path='/leaderboard' element={<Leaderboard />} />
    <Route path='/signup' element={<Signup />} />
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