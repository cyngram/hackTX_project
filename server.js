//loads express + node's path tools
require("dotenv").config();
const express = require('express');
const path = require("path");
const app = express();

app.use(express.json());
//sends json response to the /api/hello endpoint
app.get("/api/hello", (req, res) => {
  res.json({ message: "server works!" });
});

//TMDB genre names --> genre id numbers
const GENRES = {
    action: 28,
    adventure: 12,
    animation: 16,
    comedy: 35,
    crime: 80,
    documentary: 99,
    drama: 18,
    family: 10751,
    fantasy: 14,
    history: 36,
    horror: 27,
    music: 10402,
    mystery: 9648,
    romance: 10749,
    "sci-fi": 878,
    thriller: 53,
    war: 10752,
    western: 37,
}

app.get("/api/movies", async (req, res) => {
    try {
  const genre = req.query.genre;
  const genreId = GENRES[genre?.toLowerCase()];

  //grab the appropriate url based on whether a genre was specified or not
  const url = genreId
  ? `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&sort_by=popularity.desc&api_key=${process.env.TMDB_KEY}`
  : `https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.TMDB_KEY}`;
    //fetches the data from the TMDB API and sends it back to the client
    const response = await fetch(url);
  const data = await response.json();

  //maps the data to a more usable format
    const movies = data.results.map((m) => ({
    id: m.id,
    title: m.title,
    year: m.release_date ? Number(m.release_date.slice(0, 4)) : null,
    rating: Math.round(m.vote_average * 10) / 10,
    genres: [],
    streaming: [],
    overview: m.overview,
    poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
    trailer: null,

  }));

  res.json(movies);
} //in case of crash, log the error and send a 500 response to the client
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching movies." });
    }
});

app.post("api/recommendations", async (req, res) => {
    try {
        const prompt = req.body.prompt;
        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": process.env.GEMINI_KEY,
                },
                body: JSON.stringify({
                    contents: [{ parts: [{text: prompt}] }],
                }),
            }
        );
        const data = await response.json();

        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        res.json({ text: text, raw: text ? undefined : data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching recommendations." });
    }
});

//checks if file exists
app.use(express.static(path.join(__dirname, "client/dist")));

//sends files
app.use((req, res) => {
    res.sendFile(path.join(__dirname, "client/dist", "index.html"));
})

//renders the server on port 3000 or the port specified in the environment variables
app.listen(process.env.PORT || 3000, () => console.log("running"));
