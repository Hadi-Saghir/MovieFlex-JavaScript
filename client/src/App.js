import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Import Navigate here
import { Container } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css"
import axios from 'axios';

import MovieFlex from './MovieFlex';
import './App.css';

const AUTH_URL = "https://accounts.spotify.com/authorize?client_id=a6efc533d8444fa49fbaf5e02f0541f2&response_type=code&redirect_uri=http://localhost:3000/&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state";

function Login() {
  return (
    <div id="wrapper">
      <main>
        <h1>MovieFlex✨</h1>
        <div className="container">
          <ul className="myUL">
            <li>Play the soundtrack</li>
            <li>Match the soundtrack to the movie's poster</li>
            <li>Click to check your answer!</li>
          </ul>
        </div>
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
          <a className="btn btn-success btn-lg" href={AUTH_URL}>Login With Spotify</a>
        </Container>
      </main>
    </div>
  );
}

function App() {
  // The App component now simply decides between showing the login screen or redirecting to MovieFlex

  const code = new URLSearchParams(window.location.search).get('code');
console.log(code)
  return (
    <Router>
      <Routes>
        <Route path="/" element={!code ? <Login /> : <Navigate to="/movieflex" />} />
        <Route path="/movieflex" element={<MovieFlex code={code} />} />
      </Routes>
    </Router>
  );
}

export default App;