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
        ? "Feral Mode engaged. HR has left the chat..."
        : "Rewinding the cassette, blowing into the cartridge, and consulting the mall food court elders..."
    );

    try {
      const result = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ situation, mode })
      });

      const data = await result.json();
      setResponse(data.response || "Whatever. The AI shrugged and walked away.");
    } catch {
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
        <div className="top-strip">
          <span>EST. 1970-ish</span>
          <span>NO FILTER</span>
          <span>LOW PATIENCE</span>
        </div>

        <div className="brand-row">
          <div>
            <div className="badge">Latchkey AI Humor Engine</div>
            <h1>GenXSays</h1>
          </div>
          <div className="sticker">Whatever.</div>
        </div>

        <p className="tagline">
          Drop your situation. Get the GenX response nobody asked for,
          but everyone needed.
        </p>

        <p className="subline">
          Powered by sarcasm, gas station nachos, mixtapes, and unresolved 90s trauma.
        </p>

        <div className="mode-toggle">
          <button
            className={mode === "classic" ? "active classic" : ""}
            onClick={() => setMode("classic")}
            type="button"
          >
            Classic
          </button>

          <button
            className={mode === "feral" ? "active feral" : ""}
            onClick={() => setMode("feral")}
            type="button"
          >
            Extra Feral
          </button>
        </div>

        <textarea
          value={situation}
          onChange={(e) => setSituation(e.target.value)}
          placeholder="Example: My teenager thinks getting a job is optional because vibes..."
        />

        <button className="generate-button" onClick={generateResponse} disabled={loading}>
          {loading ? "Generating..." : "Say It Like Gen X"}
        </button>

        <div className="response">
          <div className="response-label">GenX says:</div>
          <p>{response}</p>

          <button className="copy-button" onClick={copyResponse} type="button">
            {copied ? "Copied. Go ruin a group chat." : "Copy Response"}
          </button>
        </div>
      </section>
    </main>
  );
}