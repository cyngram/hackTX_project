import { useState } from "react";
import "./RecBox.css";

function RecBox() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null); //server's answers
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!prompt.trim()) return; // ignore empty prompts

    setLoading(true);
    const res = await fetch("/api/recommendations", {
      method: "POST",
      signal: AbortSignal.timeout(20000),
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: prompt }),
    });
    const data = await res.json();
    setReply(data);
    setLoading(false);
  }

  return (
    <div className="rec-box">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="What do you feel like watching?"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Thinking..." : "Search"}
        </button>
      </form>
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
              <div className="rec-movie" key={movie.id}>
                <img src={movie.poster} alt={movie.title} />
                <h3>
                  {movie.title} <span>({movie.year})</span>
                </h3>
                <p className="rec-rating">⭐ {movie.rating}</p>
                <p className="rec-reason">{movie.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default RecBox;
