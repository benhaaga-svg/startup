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



export default function App() {
  return (



    <BrowserRouter>
    <div className='div'>
      <header className='header'>
        <nav className='header-nav'>
        <menu className='header-nav-menu'>
    <li className='header-nav-li'>
      <NavLink to="/">
        Login
      </NavLink>
    </li>
    <li className='header-nav-li'>
      <NavLink to="/home">
        Home
      </NavLink>
    </li>
    <li className='header-nav-li'>
      <NavLink to="/scores">
        Scores
      </NavLink>
    </li>
    <li className='header-nav-li'>
      <NavLink to="/upload">
        Upload
      </NavLink>
    </li>
    <li className='header-nav-li'>
      <NavLink to="/profile">
        Profile
      </NavLink>
    </li>
    <li className='header-nav-li'>
      <NavLink to="/leaderboard">
        Leaderboard
      </NavLink>
    </li>
  </menu>
</nav>
      </header>

      <Routes>
    <Route path='/' element={<Login />} exact />
    <Route path='/home' element={<Home />} />
    <Route path='/scores' element={<Scores />} />
    <Route path='/upload' element={<Upload />} />
    <Route path='/profile' element={<Profile />} />
    <Route path='/leaderboard' element={<Leaderboard />} />
    <Route path='/signup' element={<Signup />} />
    <Route path='*' element={<NotFound />} />
    </Routes>

      <footer className='footer'>

            <div className='footer-div'>
                <p className='p'>Designed by Ben Haaga in 2025 for cs260</p>
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