//loads express + node's path tools
require("dotenv").config();
const express = require("express");
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
};

// flip the table: 27 → "horror", 878 → "sci-fi", ... for map
const GENRE_NAMES = Object.fromEntries(
  Object.entries(GENRES).map(([name, id]) => [id, name]),
);

app.get("/api/movies", async (req, res) => {
  try {
    const genre = req.query.genre;
    const genreId = GENRES[genre?.toLowerCase()];

    // today's date as "2026-10-24", used to hide movies that aren't out yet
       const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/Chicago" });

    // genre → discover (only movies released by today), no genre → trending
    const url = genreId
      ? `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&sort_by=popularity.desc&primary_release_date.lte=${today}&api_key=${process.env.TMDB_KEY}`
      : `https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.TMDB_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    const movies = data.results
      // keep only movies that are already out and have a poster
      .filter((m) => m.release_date && m.release_date <= today && m.poster_path)
      // reshape into our team format
      .map((m) => ({
        id: m.id,
        title: m.title,
        year: Number(m.release_date.slice(0, 4)),
        releaseDate: m.release_date,
        rating: Math.round(m.vote_average * 10) / 10,
        genres: m.genre_ids.map((id) => GENRE_NAMES[id]).filter(Boolean),
        streaming: [],
        overview: m.overview,
        poster: `https://image.tmdb.org/t/p/w500${m.poster_path}`,
        trailer: null,
      }));

    res.json(movies);
  } catch (error) {
    // in case of crash, log the error and send a 500 response to the client
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching movies." });
  }
});

app.post("/api/recommendations", async (req, res) => {
  const prompt = req.body.prompt;
  if (!prompt) {
    return res
      .status(400)
      .json({ error: "Tell us what you're in the mood for!" });
  }
  // current day + time, so "what should I watch right now" makes sense and give recent data
  const now = new Date().toLocaleString("en-US", {
    weekday: "long",
    hour: "numeric",
    timeZone: "America/Chicago",
  });

  // our instructions to Gemini (the user's text goes inside)
  const instructions = `You are a friendly movie recommender.
It is currently ${now}.
The user says: "${prompt}"

Recommend 5 real, existing movies that fit their request.
Reply ONLY with JSON in this exact shape:
{
  "message": "one or two friendly sentences introducing your picks",
  "movies": [ { "title": "exact movie title", "year": 2016, "reason": "one short sentence" } ]
}`;

  // ---------- STEP 1: ask Gemini ----------
  const geminiResponse = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent",
    {
      method: "POST",
      signal: AbortSignal.timeout(20000),
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_KEY,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: instructions }] }],
        generationConfig: { responseMimeType: "application/json" }, // force JSON reply
      }),
    },
  );
  const geminiData = await geminiResponse.json();

  // dig Gemini's answer out of the response
  const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    // no answer → hand it to the generic error handler
    throw new Error("Gemini gave no answer: " + JSON.stringify(geminiData));
  }

  // Gemini's JSON arrives as text → turn it into a real object
  const picks = JSON.parse(text); // { message, movies: [{ title, year, reason }] }

  // ---------- STEP 2: look up each movie on TMDB ----------
  // runs all searches parallel, so we don't wait for one to finish before starting the next
  const found = await Promise.all(
    picks.movies.map(async (pick) => {
      const searchUrl =
        `https://api.themoviedb.org/3/search/movie` +
        `?query=${encodeURIComponent(pick.title)}` +
        `&year=${pick.year || ""}` +
        `&api_key=${process.env.TMDB_KEY}`;

      const tmdbResponse = await fetch(searchUrl);
      const tmdbData = await tmdbResponse.json();
      const m = tmdbData.results?.[0]; // best match

      if (!m) return null; // not found → probably made up → skip

      // same team format as /api/movies, plus Gemini's reason
      return {
        id: m.id,
        title: m.title,
        year: m.release_date ? Number(m.release_date.slice(0, 4)) : null,
        releaseDate: m.release_date || null,
        rating: Math.round(m.vote_average * 10) / 10,
        genres: m.genre_ids.map((id) => GENRE_NAMES[id]).filter(Boolean),
        streaming: [],
        overview: m.overview,
        poster: m.poster_path
          ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
          : null,
        trailer: null,
        reason: pick.reason,
      };
    }),
  );

  // remove any movies TMDB couldn't find
  const movies = found.filter((movie) => movie !== null);

  // ---------- STEP 3: send it back ----------
  res.json({ message: picks.message, movies: movies });
});

//showtimessss

// ---------- where to stream (TMDB watch providers) ----------
// GET /api/movies/550/providers → { link, stream: [...], rent: [...], buy: [...] }
app.get("/api/movies/:id/providers", async (req, res) => {
  const url = `https://api.themoviedb.org/3/movie/${encodeURIComponent(req.params.id)}/watch/providers?api_key=${process.env.TMDB_KEY}`;
  const response = await fetch(url);
  if (!response.ok) return res.status(response.status).json({ error: "TMDB lookup failed" });
  const data = await response.json();
  const us = data.results?.US || {}; // only US services

  // TMDB gives logos as paths → turn them into full image urls
  const clean = (list = []) =>
    list.map((p) => ({
      id: p.provider_id,
      name: p.provider_name,
      logo: `https://image.tmdb.org/t/p/w92${p.logo_path}`,
    }));

  res.json({
    link: us.link || null, // TMDB page that links out to each service
    stream: clean(us.flatrate),
    rent: clean(us.rent),
    buy: clean(us.buy),
  });
});

// ---------- showtimes (SerpApi Google results) ----------
// GET /api/showtimes?title=Wicked → [{ day, theaters: [{ name, address, link, times: [...] }] }]
// small cache so we don't burn SerpApi searches (free plan has a monthly limit)
const showtimeCache = new Map(); // title → { at, data }
const CACHE_MS = 30 * 60 * 1000; // 30 minutes

app.get("/api/showtimes", async (req, res) => {
  const title = req.query.title;
  if (!title) return res.status(400).json({ error: "title is required" });

  const key = title.toLowerCase();
  const cached = showtimeCache.get(key);
  if (cached && Date.now() - cached.at < CACHE_MS) return res.json(cached.data);

  const params = new URLSearchParams({
    engine: "google",
    q: `${title} showtimes`,
    location: "Austin, Texas, United States",
    hl: "en",
    gl: "us",
    api_key: process.env.SERPAPI_KEY,
  });
  const response = await fetch(`https://serpapi.com/search.json?${params}`, {
    signal: AbortSignal.timeout(20000),
  });
  const data = await response.json();
  if (data.error) throw new Error("SerpApi: " + data.error);

  // reshape: each day → theaters → flat list of times
  const days = (data.showtimes || []).map((d) => ({
    day: d.day,
    theaters: (d.theaters || []).map((t) => ({
      name: t.name,
      address: t.address || "",
      distance: t.distance || "",
      link: t.link || null,
      times: (t.showing || []).flatMap((s) =>
        (s.time || []).map((time) => ({ time, type: s.type || "" })),
      ),
    })),
  }));

  showtimeCache.set(key, { at: Date.now(), data: days });
  res.json(days);
});

//generic error handler for any unhandled errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong internally" });
});

//checks if file exists
app.use(express.static(path.join(__dirname, "client/dist")));

//sends files
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "client/dist", "index.html"));
});

//renders the server on port 3000 or the port specified in the environment variables
app.listen(process.env.PORT || 3000, () => console.log("running"));