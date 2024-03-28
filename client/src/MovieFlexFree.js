import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css"
import { Container, Row, Col } from 'react-bootstrap';



const MovieFlexFree = () => {
    const [movies, setMovies] = useState([]);
    const [correctMovieID, setCorrectMovieID] = useState('');
    const [selectedMovieID, setSelectedMovieID] = useState('');
    const [showAnswer, setShowAnswer] = useState(false);
    const [correctMovieDetails, setCorrectMovieDetails] = useState(null); // Store details of the correct movie

    const [trackUri, setTrackUri] = useState('spotify:track:6EKywtYHtZLAvxyEcqrbE7');
    const [isPlaying, setIsPlaying] = useState(false); // To toggle play/pause visibility for the IFrame player


    // const url = "";
    const url = "https://movieflex-react-server.vercel.app"


    //----------------------------------------------------
    //          SPOTIFY WEB PLAYER
    //----------------------------------------------------


    useEffect(() => {
        const trackId = trackUri.split(':').pop();
        const iframeSrc = `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&autoplay=${isPlaying ? '1' : '0'}`;
        const spotifyIframe = document.getElementById('spotify-iframe');
        if (spotifyIframe) {
            spotifyIframe.src = iframeSrc;
        }
    }, [trackUri, isPlaying]);


    const playTrack = () => {
        const trackId = trackUri.split(':').pop();
        const iframeSrc = `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&autoplay='1'}`;
        const spotifyIframe = document.getElementById('spotify-iframe');
        if (spotifyIframe) {
            spotifyIframe.src = iframeSrc;
        }
    };


    const changeTrack = (spotifyUri) => {
        setTrackUri(spotifyUri)
        playTrack();
    };


    //----------------------------------------------------
    //          MOVIE IDS && NEW ROUND
    //----------------------------------------------------

    useEffect(() => {
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
                console.log(movieDetails)
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
            console.log(movieDetails)
        } catch (error) {
            console.error('Error fetching game instance:', error);
        }
    };

    const checkAnswer = (selectedID) => {
        setSelectedMovieID(selectedID);
        setTimeout(setShowAnswer(true), 100);

        // Start showing the answer after a short delay to allow for any immediate transitions
        setTimeout(() => {
            setShowAnswer(false);
            setSelectedMovieID(null); // Reset for the next question
            fetchNewRound()
            // Proceed to the next round after a short pause to separate rounds
            // setTimeout(fetchNewRound, 100); // Adjust as necessary
        }, 2000); // Short delay to kick off transitions
    };





    //----------------------------------------------------
    //          HTML RETURN CODE
    //---------------------------------------------------- 

    const getTransformationStyle = (movieId, movieIndex, totalMovies) => {
        // No transformations before an answer is shown
        if (!showAnswer) return {};

        // Check if this is the correct movie
        const isCorrect = movieId === correctMovieID;

        // Apply transformations based on the movie's position (index) and correctness
        let transform = '';
        if (isCorrect) {
            // Correct movie, decide on the transform based on its initial position
            switch (movieIndex) {
                case 0: // Top left
                    transform = 'translate(125%, 50%)';
                    break;
                case 1: // Bottom left
                    transform = 'translate(125%, -50%)';
                    break;
                case 2: // Top right
                    transform = 'translate(-125%, 50%)';
                    break;
                case 3: // Bottom right
                    transform = 'translate(-125%, -50%)';
                    break;
                default:
                    // Fallback for any other position, though unlikely given a 2x2 grid
                    transform = 'translate(0%, 0%)';
            }
            return {
                transform: transform,
                opacity: 1,
                transition: 'transform 0.5s ease, opacity 0.5s ease',
            };
        } else {
            // Incorrect movie, just scale down
            return {
                transform: 'scale(0.8)',
                opacity: 0, // Make incorrect cards semi-transparent
                transition: 'transform 0.2s ease, opacity 0.5s ease',
            };
        }
    };



    const quitGame = () => {
        handleRedirect("/")
        console.log('Quit game function called. Implement navigation or logic here.');
    };

    const handleRedirect = (url) => {
        window.location.href = url;
    };


    return (
        <div>
            <Container className="d-flex flex-column py-2" style={{ height: "100%", width: "100%", overflow: 'auto' }}>
                <Row className="w-full md:h-screen flex items-center" style={{ height: '15vh', zIndex: '102' }}>
                    <Col xs={4} className="flex justify-between items-center w-full h-full px-2 2xl:px-16">
                        <button className="img-button button-margin" onClick={() => handleRedirect("/")}>
                            <img src="https://elasticbeanstalk-eu-north-1-102471047009.s3.eu-north-1.amazonaws.com/movieflex/MovieFlex.png" alt="IMDb Logo" className="mf-logo" style={{ maxWidth: '150px', height: 'auto' }} />
                        </button>
                    </Col>
                </Row>

                <Row className="flex-grow-1 my-2" style={{ height: '60vh', overflow: 'hidden', zIndex: '101' }}>
                    <div className={`selected-answer-container ${!showAnswer ? 'show' : ''}`}>
                        <Col>
                            <div className="card-holder" style={{ overflow: 'hidden' }}>
                                {movies.map((movie, index) => (
                                    <Col xs={6} md={4} lg={3} className="mb-4" key={movie.id}>
                                        <div
                                            key={movie.id}
                                            className={`card flip-card ${selectedMovieID === movie.id ? (movie.id === correctMovieID ? 'correct' : 'incorrect') : ''} ${showAnswer ? 'no-hover-effect' : ''}`}
                                            id="card"
                                            onClick={() => !showAnswer && checkAnswer(movie.id)}
                                            style={getTransformationStyle(movie.id, index, movies.length)}
                                        >
                                            <div className="flip-card-inner">
                                                <div className="flip-card-front" style={{ backgroundImage: `url(${movie.poster})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                                                <div className="flip-card-back d-flex align-items-center justify-content-center">
                                                    <button className="card-button">Choose!</button>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                ))}
                            </div>
                        </Col>
                    </div>
                </Row>
                <div id="embed-iframe"></div>

                <Col className="d-flex flex-column py-2" style={{ overflow: 'hidden' }}>
                    <div className="answer-and-controls-section">
                        <div className="correct-answer-text">
                            {showAnswer && correctMovieDetails ? (
                                <p>Correct Movie: {correctMovieDetails.title}</p>
                            ) : (
                                <p>Correct Movie: Awaiting choice...</p>
                            )}
                        </div>
                        <div className="controls">
                            {/* <button onClick={togglePlay} className="play-pause-button" id="toggle-play"> Toggle Play</button> */}
                            <button onClick={fetchNewRound} className="play-pause-button" > New Round </button>
                            <button onClick={quitGame} className="play-pause-button"> Return </button>
                        </div>
                    </div>
                </Col>

                <div className="spotify-player-container" style={{}}>
                    <iframe
                        key={trackUri + isPlaying}
                        title="Spotify Music Player"
                        src={`https://open.spotify.com/embed/track/${trackUri.split(':').pop()}?utm_source=generator`}
                        width="100%"
                        height="80"
                        frameBorder="0"
                        allowtransparency="true"
                        allow="encrypted-media"
                        styles={{
                            bgColor: '#333',
                            color: '#fff',
                            loaderColor: '#fff',
                            sliderColor: '#1cb954',
                            savedColor: '#fff',
                            trackArtistColor: '#333',
                            trackNameColor: '#333',
                        }}>
                    </iframe>
                    <div className="cover-overlay-embedd"></div>

                </div>

            </Container>

        </div>
    );

}

export default MovieFlexFree;
