import { useState } from "react";
import "./RecBox.css";
import MovieDetail from "../MovieDetail/MovieDetail";
import Mascot from "../Mascot/Mascot"; // from inside another component folder

function RecBox() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null); //server's answers
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null); //tracks which movie is selected
  const [lastPrompt, setLastPrompt] = useState(""); // tracks the last prompt sent to the server

  async function askGemini(text) {
    setLoading(true);
    setReply(null);

    try {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        signal: AbortSignal.timeout(20000),
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text }), // ← was `prompt`, now `text`
      });

      const data = await res.json();

      if (!res.ok) {
        // server answered with an error (400, 500, etc.)
        setReply({ error: data.error || "Something went wrong" });
        return;
      }

      setReply(data);
    } catch (err) {
      // network failed, server is down, or it took longer than 20 seconds
      console.error(err);
      setReply({
        error:
          err.name === "TimeoutError"
            ? "That took too long"
            : "Couldn't reach the server",
      });
    } finally {
      // runs no matter what, so the button never gets stuck on "Thinking..."
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLastPrompt(prompt); // remember what they originally asked
    askGemini(prompt);
  }

  const REFINES = [
    { label: "Something lighter", ask: "Make it lighter and more feel-good." },
    { label: "More intense", ask: "Make it more intense and gripping." },
    {
      label: "Surprise me",
      ask: "Pick something unexpected I probably haven't heard of.",
    },
  ];

  function refine(instruction) {
    const shown = reply.movies.map((m) => m.title).join(", ");
    askGemini(
      `${lastPrompt}. ${instruction} Don't suggest these again: ${shown}.`,
    );
  }

  function moreLike(movie) {
    refine(`Give me movies similar to ${movie.title}.`);
  }

  return (
    <div className="rec-box">
      <div className="rec-row">
        <Mascot
          size={120}
          mood={loading ? "thinking" : "happy"}
          className={loading ? "mascot-bounce" : ""}
        />{" "}
        {/* render the mascot with a size of 100px */}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Need help choosing a film?"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Thinking..." : "Get Picks"}
          </button>
        </form>
      </div>
      {/* if something went wrong */}
      {reply?.error && (
        <p className="rec-error">Couldn't get recommendations, try again!</p>
      )}

      {/* the answer */}
      {reply?.message && (
        <div className="rec-reply">
          <p className="rec-message">{reply.message}</p>

          <div className="rec-movies">
            {reply.movies.map((movie) => (
              <div
                className="rec-movie"
                key={movie.id}
                onClick={() => setSelected(movie)}
              >
                <img src={movie.poster} alt={movie.title} />
                <h3>
                  {movie.title} <span>({movie.year})</span>
                </h3>
                <p className="rec-rating">⭐ {movie.rating}</p>
                <p className="rec-reason">{movie.reason}</p>
              </div>
            ))}
          </div>
          <div className="rec-refine">
            <span>Not quite?</span>
            {REFINES.map((r) => (
              <button
                type="button"
                key={r.label}
                onClick={() => refine(r.ask)}
                disabled={loading}
              >
                {r.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => moreLike(reply.movies[0])}
              disabled={loading}
            >
              More like {reply.movies[0]?.title}
            </button>
          </div>
        </div>
      )}
      {selected && (
        <MovieDetail movie={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

export default RecBox;
