import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'; // Import Navigate here
import { Container, Row, Col } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";

import MovieFlex from './MovieFlex';
import MovieFlexFree from './MovieFlexFree';
import './App.css';

// const AUTH_URL = "https://accounts.spotify.com/authorize?client_id=a6efc533d8444fa49fbaf5e02f0541f2&response_type=code&redirect_uri=http://localhost:3000/&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state";

const AUTH_URL = "https://accounts.spotify.com/authorize?client_id=a6efc533d8444fa49fbaf5e02f0541f2&response_type=code&redirect_uri=https://movieflex.hadisaghir.com/&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state";

function Login() {

  const handleRedirect = (url) => {
    window.location.href = url;
  };

  const handleRedirectNewTab = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const navigation = useNavigate();

  return (
    <Container className="d-flex flex-column py-2" style={{ height: "100%", width: "100%", overflow: 'auto' }}>
      <Row className="w-full md:h-screen flex items-center" style={{ zIndex: '102' }}>
        <Col xs={4} className="flex justify-between items-center w-full h-full px-2 2xl:px-16">
          <button className="img-button button-margin" onClick={() => handleRedirect("/")}>
            <img src="https://elasticbeanstalk-eu-north-1-102471047009.s3.eu-north-1.amazonaws.com/movieflex/MovieFlex.png" alt="IMDb Logo" className="mf-logo" style={{ width: '200px', height: 'auto' }} />
          </button>
        </Col>
      </Row>

      <Row className="d-flex flex-column py-2">
        <div className="how-to-play">
          <h2 className="h2">How to play:</h2>
          <ul className="myUL ul-list-style">
            <li>Play the soundtrack</li>
            <li>Match the soundtrack to the movie's poster</li>
            <li>Click to check your answer!</li>
          </ul>
        </div>
      </Row>

      <Row className="login-container">
        <Col className="controls">
          <div style={{width: "60%"}}></div>
          <img src="https://elasticbeanstalk-eu-north-1-102471047009.s3.eu-north-1.amazonaws.com/movieflex/Premium-Webplayer-Arrow.png" alt="Premium Webplayer" className="prem-logo" />
        </Col>
        <Col className="controls">
          <button onClick={() => navigation("/movieflex-free")} className="login-button">No Login</button>
          <button onClick={() => handleRedirect(AUTH_URL)} className="login-button">Login With Spotify</button>
        </Col>
      </Row>



      <Row className="powered-by-container" style={{ backgroundColor: '#282828' }}>
        <Col className="text-center">
          <div><h3 style={{ color: 'white' }}>Powered by</h3></div>
          <div style={{ marginTop: '5px', marginBottom: '20px' }}>
            <button className="img-button button-margin" onClick={() => handleRedirectNewTab("https://developer.spotify.com")}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg" alt="Spotify Logo" className="img-logo" />
            </button>

            <button className="img-button button-margin" onClick={() => handleRedirectNewTab("https://developer.imdb.com/")}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg" alt="IMDb Logo" className="img-logo" />
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
        <Route path="/movieflex-free" element={<MovieFlexFree />} />
        <Route path="/movieflex" element={<MovieFlex code={code} />} />
      </Routes>
    </Router>
  );
}

export default App;