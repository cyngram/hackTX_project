// =============================================
// fakeMovies.js: placeholder data for building the UI
// Every component uses this until the real API routes are ready.
// Real data from /api/movies will use the SAME format,
// so nothing breaks when we swap it in.
// =============================================

const fakeMovies = [
  {
    id: 1,
    title: "Dune: Part Two",
    year: 2024,
    rating: 8.2,
    genres: ["Sci-Fi", "Adventure"],
    streaming: ["Max"],
    overview: "Paul joins the Fremen and faces a choice between love and the fate of the universe.",
    poster: "https://placehold.co/300x450/1a1a2e/f4a261?text=Dune+Part+Two",
    trailer: null,
  },
  {
    id: 2,
    title: "The Matrix",
    year: 1999,
    rating: 8.7,
    genres: ["Sci-Fi", "Action"],
    streaming: ["Netflix"],
    overview: "A hacker learns the world he knows is a simulation and joins the fight to free humanity.",
    poster: "https://placehold.co/300x450/0b3d0b/7CFC00?text=The+Matrix",
    trailer: null,
  },
  {
    id: 3,
    title: "Interstellar",
    year: 2014,
    rating: 8.7,
    genres: ["Sci-Fi", "Drama"],
    streaming: ["Paramount+"],
    overview: "Explorers travel through a wormhole to find humanity a new home.",
    poster: "https://placehold.co/300x450/1c1c1c/dddddd?text=Interstellar",
    trailer: null,
  },
  {
    id: 4,
    title: "Spider-Man: Into the Spider-Verse",
    year: 2018,
    rating: 8.4,
    genres: ["Animation", "Action"],
    streaming: ["Netflix"],
    overview: "Teenager Miles Morales becomes Spider-Man and meets heroes from other dimensions.",
    poster: "https://placehold.co/300x450/2b0a3d/ff3864?text=Spider-Verse",
    trailer: null,
  },
];
export default fakeMovies;