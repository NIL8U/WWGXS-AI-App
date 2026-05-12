import { useState } from "react";

export default function App() {
  const [situation, setSituation] = useState("");
  const [response, setResponse] = useState(
    "Type a situation, hit the button, and let GenX emotionally damage it."
  );
  const [loading, setLoading] = useState(false);

  async function generateResponse() {
    if (!situation.trim()) {
      setResponse("You gotta type something first. I'm sarcastic, not psychic.");
      return;
    }

    setLoading(true);
    setResponse("Consulting the council of mixtapes, mall food courts, and unresolved childhood trauma...");

    try {
      const result = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          situation
        })
      });

      const data = await result.json();

      setResponse(data.response || "Whatever. The AI shrugged and walked away.");
    } catch (error) {
      setResponse("Something broke. Typical. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="app">
      <section className="card">
        <h1>GenXSays</h1>

        <p className="tagline">
          Enter a situation. Get the GenX response nobody asked for,
          but everyone needed.
        </p>

        <textarea
          value={situation}
          onChange={(e) => setSituation(e.target.value)}
          placeholder="Example: My boss scheduled a meeting to discuss why we have too many meetings..."
        />

        <button onClick={generateResponse} disabled={loading}>
          {loading ? "Generating..." : "Generate GenX Response"}
        </button>

        <div className="response">
          <strong>GenX says:</strong>
          <p>{response}</p>
        </div>
      </section>
    </main>
  );
}