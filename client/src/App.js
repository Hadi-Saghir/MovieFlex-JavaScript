import { BrowserRouter as Router, Routes, Route, Navigate, redirect } from 'react-router-dom'; // Import Navigate here
import { Container, Row, Col, Button } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";

import MovieFlex from './MovieFlex';
import './App.css';

const AUTH_URL = "https://accounts.spotify.com/authorize?client_id=a6efc533d8444fa49fbaf5e02f0541f2&response_type=code&redirect_uri=http://localhost:3000/&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state";

function Login() {

  const handleRedirect = (url) => {
    window.location.href = url;
  };


  return (
    <Container fluid style={{ height: '100vh', backgroundColor: '#000000', color: 'white', fontFamily: 'Arial, sans-serif' }}>
      <Row className="align-items-center" style={{ height: '10vh', backgroundColor: '#282828' }}>
        <Col className="text-center">
          <button style={{ marginLeft: '20px', marginRight: '20px' }} className="img-button" onClick={() => handleRedirect("/")}>
            <h1>MovieFlex✨</h1>
          </button>
        </Col>
      </Row>

      <Row className="align-items-center" style={{ height: '40vh', paddingLeft: '20vh', paddingRight: '20vh' }}>
        <Col md={8} lg={6} style={{ backgroundColor: '#181818', padding: '2rem', width: "400vh", borderRadius: "20px" }}>
          <h2 style={{ marginBottom: '1rem' }}>How to play:</h2>
          <ul className="myUL" style={{ listStyleType: 'none', paddingLeft: '50px' }}>
            <li>Play the soundtrack</li>
            <li>Match the soundtrack to the movie's poster</li>
            <li>Click to check your answer!</li>
          </ul>
        </Col>
      </Row>

      <Row className="align-items-center" style={{ height: '35vh' }}>
        <Col className="text-center">
          <a className="btn btn-lg" href={AUTH_URL} style={{ backgroundColor: '#1DB954', borderColor: '#1DB954', color: 'white', margin: "20vh" }}>Login With Spotify</a>
        </Col>
      </Row>

      <Row className="align-items-center" style={{ height: '15vh', backgroundColor: '#282828' }}>
        <Col className="text-center">
          <div><h1 style={{ color: "white" }}>Powered by</h1></div>
          <div style={{ marginTop: '10px' }}>
            <button style={{ marginLeft: '20px', marginRight: '20px' }} className="img-button" onClick={() => handleRedirect("https://developer.spotify.com")}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg" alt="Spotify Logo" style={{ height: '50px' }} />
            </button>

            <button style={{ marginLeft: '20px', marginRight: '20px' }} className="img-button" onClick={() => handleRedirect("https://developer.imdb.com/")}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg" alt="IMDb Logo" style={{ height: '50px' }} />
            </button>
          </div>
        </Col>
      </Row>
    </Container>
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