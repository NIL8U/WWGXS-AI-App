import { useState } from "react";

export default function App() {
  const [situation, setSituation] = useState("");
  const [mode, setMode] = useState("classic");
  const [response, setResponse] = useState(
    "Type a situation, hit the button, and let GenX emotionally damage it."
  );
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function generateResponse() {
    if (!situation.trim()) {
      setResponse("You gotta type something first. I'm sarcastic, not psychic.");
      return;
    }

    setCopied(false);
    setLoading(true);

    setResponse(
      mode === "feral"
        ? "Unleashing Feral Mode. Somebody hide HR..."
        : "Rewinding the cassette, blowing into the Nintendo cartridge, and consulting the mall food court elders..."
    );

    try {
      const result = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          situation,
          mode
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

  async function copyResponse() {
    const text = `GenXSays:\n\n${response}\n\nTry it: https://wwgxs-ai-app.vercel.app`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main className="app">
      <section className="card">
        <div className="badge">Latchkey AI Humor Engine</div>

        <h1>GenXSays</h1>

        <p className="tagline">
          Enter a situation. Get the GenX response nobody asked for,
          but everyone needed.
        </p>

        <p className="subline">
          Powered by sarcasm, latchkey survival, and unresolved 90s trauma.
        </p>

        <div className="mode-toggle">
          <button
            className={mode === "classic" ? "active" : ""}
            onClick={() => setMode("classic")}
            type="button"
          >
            Classic
          </button>

          <button
            className={mode === "feral" ? "active" : ""}
            onClick={() => setMode("feral")}
            type="button"
          >
            Feral Mode
          </button>
        </div>

        <textarea
          value={situation}
          onChange={(e) => setSituation(e.target.value)}
          placeholder="Example: My boss scheduled a meeting to discuss why we have too many meetings..."
        />

        <button className="generate-button" onClick={generateResponse} disabled={loading}>
          {loading ? "Generating..." : "Generate GenX Response"}
        </button>

        <div className="response">
          <strong>GenX says:</strong>
          <p>{response}</p>

          <button className="copy-button" onClick={copyResponse} type="button">
            {copied ? "Copied. Go forth and annoy people." : "Copy Response"}
          </button>
        </div>
      </section>
    </main>
  );
}