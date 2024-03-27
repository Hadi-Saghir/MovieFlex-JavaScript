import React, { useState, useEffect } from 'react';
import SpotifyPlayer from 'react-spotify-web-playback'; // If using a pre-built component
import './MovieFlex.css';
import "bootstrap/dist/css/bootstrap.min.css"
import { Container, Row, Col, Button } from 'react-bootstrap';
import useAuth from './useAuth'; // Adjust the path based on your file structure

const MovieFlex = ({ code }) => {
  const { accessToken, authError, loading } = useAuth(code);

  const [movies, setMovies] = useState([]);
  const [correctMovieID, setCorrectMovieID] = useState('');
  const [selectedMovieID, setSelectedMovieID] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [correctMovieDetails, setCorrectMovieDetails] = useState(null); // Store details of the correct movie

  const [trackUri, setTrackUri] = useState('spotify:track:6EKywtYHtZLAvxyEcqrbE7');
  const [isPlaying, setIsPlaying] = useState(false); // To toggle play/pause visibility for the IFrame player



  const url= "https://movieflex-react-server.vercel.app"
  //----------------------------------------------------
  //          SPOTIFY WEB PLAYER
  //----------------------------------------------------



  useEffect(() => {
    const trackId = trackUri.split(':').pop();
    const iframeSrc = `https://open.spotify.com/embed/track/${trackId}?utm_source=generator`;
    const spotifyIframe = document.getElementById('spotify-iframe');
    if (spotifyIframe) {
      spotifyIframe.src = iframeSrc;
    }
  }, [trackUri]);

  //change track with uri
  const changeTrack = (spotifyUri) => {
    setTrackUri(spotifyUri);
    setIsPlaying(true);
  };



  //----------------------------------------------------
  //          MOVIE IDS && NEW ROUND
  //----------------------------------------------------

  useEffect(() => {
    const fetchNewRound = async () => {
      try {
        const response = await fetch( url + '/api/movie-data');
        const movieDetails = await response.json();
        setMovies(movieDetails);

        // Pick a correct movie
        const correctMovie = movieDetails[Math.floor(Math.random() * movieDetails.length)];
        setCorrectMovieID(correctMovie.id);
        setCorrectMovieDetails(correctMovie); // Assuming the correct movie details include the Spotify URI
        changeTrack(correctMovie.uri); // Directly use the Spotify URI from the correct movie details
      } catch (error) {
        console.error('Error fetching game instance:', error);
      }
    };

    fetchNewRound();
  }, []);


  const fetchNewRound = async () => {
    try {
      const response = await fetch(url + '/api/movie-data');
      const movieDetails = await response.json();
      setMovies(movieDetails);

      // Pick a correct movie
      const correctMovie = movieDetails[Math.floor(Math.random() * movieDetails.length)];
      setCorrectMovieID(correctMovie.id);
      setCorrectMovieDetails(correctMovie); // Assuming the correct movie details include the Spotify URI
      changeTrack(correctMovie.uri); // Directly use the Spotify URI from the correct movie details
    } catch (error) {
      console.error('Error fetching game instance:', error);
    }
  };


  const checkAnswer = (selectedID) => {
    setSelectedMovieID(selectedID);
    setShowAnswer(true);

    // Visual feedback delay before next actions
    setTimeout(() => {
      setShowAnswer(false); // Hide answer details if you were showing any
      // Reset selectedMovieID or any other state needed for the next round
      setSelectedMovieID(null);

      fetchNewRound(); // Proceed to the next round
    }, 1000); // Adjust this time as needed
  };




  //----------------------------------------------------
  //          HTML RETURN CODE
  //----------------------------------------------------

  const quitGame = () => {
    handleRedirect("/")
    console.log('Quit game function called. Implement navigation or logic here.');
  };

  const handleRedirect = (url) => {
    window.location.href = url;
  };

  return (
    <Container fluid className="px-0 d-flex flex-column vh-100 vw-100">
      <Row className="header" style={{ height: '10vh', backgroundColor: '#282828' }}>
        <Col>
          <button style={{ margin: '20px'}} className="img-button" onClick={() => handleRedirect("/")}>
            <h1>MovieFlex✨</h1>
          </button>
        </Col>
      </Row>

      <Row className="cards-container" style={{ height: '30vh', overflowY: 'auto' }}>
        <Col>
          <Row>
            {movies.map((movie) => (
              <Col xs={6} md={4} lg={3} className="mb-4" key={movie.id}>
                <div className={`card flip-card ${selectedMovieID === movie.id ? (movie.id === correctMovieID ? 'correct' : 'incorrect') : ''}`} onClick={() => !showAnswer && checkAnswer(movie.id)}>
                  <div className="flip-card-inner">
                    <div className="flip-card-front" style={{ backgroundImage: `url(${movie.poster})` }}></div>
                    <div className="flip-card-back d-flex align-items-center justify-content-center">
                      <button className="card-button">Choose!</button>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>

      <div className="bottom-section" style={{ height: '45vh' }}>
        <div className="answer-and-controls-section">
          {showAnswer && correctMovieDetails ? (
            <div className="correct-answer">
              <p>Correct Movie: {correctMovieDetails.title}</p>
              <div className="correct-answer-image" style={{ backgroundImage: `url(${correctMovieDetails.poster})` }}></div>
            </div>
          ) : (
            <div className="correct-answer">
              <p>Correct Movie: Awaiting choice...</p>
              <div className="correct-answer-placeholder">
              </div>
            </div>
          )}
        </div>
        <div className="controls" id="round-management">
          <button onClick={fetchNewRound} className="play-pause-button" > New Round </button>
          <button onClick={quitGame} className="play-pause-button"> Return </button>
        </div>
      </div>

      <Row className="fixed-bottom" id="footer">
        <Container className="spotify-player-container">
          <SpotifyPlayer
            token={accessToken}
            uris={trackUri ? [trackUri] : []}
            play={isPlaying}
            styles={{
              bgColor: '#333',
              color: '#fff',
              loaderColor: '#fff',
              sliderColor: '#1cb954',
              savedColor: '#fff',
              trackArtistColor: '#333',
              trackNameColor: '#333',
              height: '20vh'
            }}
          />

          <div className="cover-overlay" />
        </Container>
      </Row>
    </Container>
  );
}

export default MovieFlex;















//this method is no longer used  as too many paradies gave inaccurate search results
//todo: create a better filtration method
//----------------------------------------------------
//          Previous way with client-server
//----------------------------------------------------


//change track with from server, old way
// const changeTrack = async (title) => {
//   try {
//     const response = await fetch(`/audio/search/${title} + main movie soundtrack`);
//     const uri = await response.text();
//     setTrackUri(uri);
//     setIsPlaying(true);
//   } catch (error) {
//     console.error('Error fetching Spotify track URI:', error);
//   }
// };

// const fetchNewRound = async () => {

//   try {
//     const response = await fetch('/api/movie-id');
//     const movieDetails = await response.json();
//     setMovies(movieDetails);

//     // Pick a correct movie
//     const correctMovie = movieDetails[Math.floor(Math.random() * movieDetails.length)];
//     setCorrectMovieID(correctMovie.id);
//     setCorrectMovieDetails(correctMovie); // Store the correct movie details for display
//     changeTrack(correctMovie.title); // Assume this function sets the track URI based on movie title
//   } catch (error) {
//     console.error('Error fetching game instance:', error);
//   }
// };