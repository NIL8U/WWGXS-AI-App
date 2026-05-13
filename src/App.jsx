import { useState } from "react";

export default function App() {
  const [situation, setSituation] = useState("");
  const [mode, setMode] = useState("classic");
  const [response, setResponse] = useState(
    "Type something stupid. Get the truth you didn’t ask for."
  );
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function generateResponse() {
    if (!situation.trim()) {
      setResponse("You gotta type something first. I’m sarcastic, not psychic.");
      return;
    }

    setCopied(false);
    setLoading(true);

    setResponse(
      mode === "feral"
        ? "Extra Feral engaged. Hide the good scissors..."
        : "Rewinding the tape, blowing into the cartridge, consulting the mall food court elders..."
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
    const text = `GenX Says:\n\n${response}\n\nTry it: https://wwgxs-ai-app.vercel.app`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main className="app">
      <section className="shell">
        <div className="warning-label">
          Parental Advisory: Explicit Sarcasm
        </div>

        <header className="brand">
          <h1>
            Gen<span>X</span> Says
          </h1>
          <div className="whatever-sticker">whatever.</div>
        </header>

        <div className="tape-note">
          AI with attitude. Built for the generation that survived without internet.
        </div>

        <div className="mood-label">Choose your mood:</div>

        <div className="mode-toggle">
          <button
            className={mode === "classic" ? "active classic" : "classic"}
            onClick={() => setMode("classic")}
            type="button"
          >
            <span>classic</span>
            <small>dry. sarcastic. mostly safe.</small>
          </button>

          <button
            className={mode === "feral" ? "active feral" : "feral"}
            onClick={() => setMode("feral")}
            type="button"
          >
            <span>extra feral</span>
            <small>no filter. no chill.</small>
          </button>
        </div>

        <label className="field-label">What’s your situation?</label>

        <textarea
          value={situation}
          onChange={(e) => setSituation(e.target.value)}
          placeholder="Example: My teenager thinks getting a job is optional because vibes..."
        />

        <button className="generate-button" onClick={generateResponse} disabled={loading}>
          {loading ? "Rewinding..." : "▶ Say it like Gen X"}
        </button>

        <div className="response">
          <div className="response-label">gen x says:</div>
          <p>{response}</p>
        </div>

        <button className="copy-button" onClick={copyResponse} type="button">
          {copied ? "Copied. Go ruin a group chat." : "Copy Response"}
        </button>

        <footer>
          No boomers were consulted.
        </footer>
      </section>
    </main>
  );
}