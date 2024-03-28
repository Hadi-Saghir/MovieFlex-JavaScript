const express = require('express');
const axios = require('axios');
const cors = require('cors');

const querystring = require('querystring');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const PORT = 3001;

const app = express();
app.use(bodyParser.json());

const corsOptions = {
  origin: [
    'https://movieflex-react-client.vercel.app',
    'https://movieflex.hadisaghir.com'
  ],
  optionsSuccessStatus: 200, // For legacy browser support
};

app.use(cors(corsOptions));


// ----------------------------------------------------
//          OMDB API with only IDS
// ----------------------------------------------------
const csvFilePath = path.join(__dirname, 'movies.csv');

let movieIDs = [];

function loadMovieData() {
  return new Promise((resolve, reject) => {
    fs.readFile(csvFilePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        // Split CSV lines, then map each line to an object
        movieData = data.trim().split('\n').map(line => {
          const [id, title, uri, poster] = line.trim().split(',').map(item => item.trim());
          return { id, title, uri, poster };
        });
        resolve(movieData);
      }
    });
  });
}

app.get('/api/movie-data', async (req, res) => {
  if (movieData.length === 0) {
    try {
      await loadMovieData(); // Load movie data if not already loaded
    } catch (error) {
      return res.status(500).send('Error loading movie data');
    }
  }

  // Optionally, if you need to randomly select 4 movies
  let selectedData = [];
  while (selectedData.length < 4) {
    const randomIndex = Math.floor(Math.random() * movieData.length);
    const selectedMovie = movieData[randomIndex];
    if (!selectedData.includes(selectedMovie)) {
      selectedData.push(selectedMovie);
    }
  }

  res.json(selectedData); // Send selected movie data as JSON
});



//----------------------------------------------------
//          SPOTIFY API
//----------------------------------------------------

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URI;

let accessToken = '';
let tokenExpirationTime = 0;

const getAccessToken = async () => {
  if (Date.now() < tokenExpirationTime) {
    return accessToken;
  }

  try {
    const url = 'https://accounts.spotify.com/api/token';
    const headers = {
      Authorization: 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    const data = querystring.stringify({
      grant_type: 'client_credentials'
    });

    const response = await axios.post(url, data, { headers });
    accessToken = response.data.access_token;
    // Set the token expiration time to the current time plus the number of seconds until the token expires
    tokenExpirationTime = Date.now() + ((response.data.expires_in - 60) * 1000);

    return accessToken;
  } catch (error) {
    console.error('Error getting access token:', error.message);
    return null;
  }
};


const searchSpotify = async (query) => {
  try {
    const accessToken = await getAccessToken();
    
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`;
    const headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`
    };

    const response = await axios.get(url, { headers });
    const tracks = response.data.tracks.items;
    if (tracks.length > 0) {
      return tracks[0].uri;
    }
    return 'No tracks found';
  } catch (error) {
    console.error('Error while searching tracks:', error.message);
    return 'ERROR 404';
  }
};


// Login route
app.post('/login', async (req, res) => {
  const code = req.body.code;
  try {
    const tokenResponse = await axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: `grant_type=authorization_code&code=${code}&redirect_uri=${redirectUri}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
    });

    res.json({
      accessToken: tokenResponse.data.access_token,
      refreshToken: tokenResponse.data.refresh_token,
      expiresIn: tokenResponse.data.expires_in,
    });
  } catch (error) {
    console.error('Error exchanging authorization code for tokens:', error.response.data);
    res.status(500).send('Internal Server Error');
  }
});

// Refresh route
app.post('/refresh', async (req, res) => {
  const refreshToken = req.body.refreshToken;
  try {
    const refreshResponse = await axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: querystring.stringify({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
    });

    // Send the new access token and its expiry time back to the client
    res.json({
      accessToken: refreshResponse.data.access_token,
      expiresIn: refreshResponse.data.expires_in,
    });
  } catch (error) {
    console.error('Error refreshing access token:', error.response.data);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/audio/search/:title', async (req, res) => {
  const title = req.params.title;
  const query = `${title} soundtrack main theme movie`;
  const uri = await searchSpotify(query);
  res.send(uri);
});

app.get('/ping', (req, res) => {
  res.json({ message: 'Server is online' });
});



//----------------------------------------------------
//          START SERVER
//----------------------------------------------------
loadMovieData().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to load movie IDs from CSV:', err);
});












//----------------------------------------------------
//          OMDB API with only IDS
//----------------------------------------------------
// const csvFilePath = path.join(__dirname, 'movies.csv');

// let movieIDs = [];

//
// function loadMovieIDs() {
//   return new Promise((resolve, reject) => {
//     fs.readFile(csvFilePath, 'utf8', (err, data) => {
//       if (err) {
//         reject(err);
//       } else {
//         movieIDs = data.trim().split('\n').map(line => line.trim());
//         resolve(movieIDs);
//       }
//     });
//   });
// }

// app.get('/api/movie-id', async (req, res) => {
//   if (movieIDs.length < 4) {
//     return res.status(500).send('Not enough movies loaded.');
//   }
  
//   let selectedIDs = [];
//   while (selectedIDs.length < 4) {
//     const randomIndex = Math.floor(Math.random() * movieIDs.length);
//     const selectedID = movieIDs[randomIndex];
//     if (!selectedIDs.includes(selectedID)) {
//       selectedIDs.push(selectedID);
//     }
//   }

//   // Fetch movie information including posters and titles from OMDB API
//   const movieDetailsPromises = selectedIDs.map(id => 
//     axios.get(`http://www.omdbapi.com/?i=${id}&apikey=267451b`)
//   );

//   try {
//     const movieDetailsResponses = await Promise.all(movieDetailsPromises);
//     const movieDetails = movieDetailsResponses.map(response => ({
//       id: response.data.imdbID,
//       title: response.data.Title,
//       poster: response.data.Poster
//     }));
//     res.json(movieDetails);
//   } catch (error) {
//     console.error('Error fetching movie details:', error);
//     res.status(500).send('Error fetching movie details');
//   }
// });