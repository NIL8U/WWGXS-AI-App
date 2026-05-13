import { useEffect, useState } from "react";

export default function App() {
  const [situation, setSituation] = useState("");
  const [mode, setMode] = useState("classic");
  const [response, setResponse] = useState(
    "Type something stupid. Get the truth you didn’t ask for."
  );
  const [displayedResponse, setDisplayedResponse] = useState(response);
  const [loading, setLoading] = useState(false);
  const [thinkingStep, setThinkingStep] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (loading) {
      setDisplayedResponse(thinkingStep);
      return;
    }

    setDisplayedResponse("");

    let index = 0;
    const interval = setInterval(() => {
      setDisplayedResponse(response.slice(0, index + 1));
      index++;

      if (index >= response.length) {
        clearInterval(interval);
      }
    }, 22);

    return () => clearInterval(interval);
  }, [response, loading, thinkingStep]);

  async function generateResponse() {
    if (!situation.trim()) {
      setResponse("You gotta type something first. I’m sarcastic, not psychic.");
      return;
    }

    setCopied(false);
    setLoading(true);

    const steps =
      mode === "feral"
        ? [
            "Loading weapons-grade sarcasm...",
            "Disabling the filter nobody asked for...",
            "Checking if HR is still in the building...",
            "Adding just enough profanity to make it useful..."
          ]
        : [
            "Rewinding the cassette...",
            "Blowing into the Nintendo cartridge...",
            "Consulting the mall food court elders...",
            "Applying dry sarcasm and emotional distance..."
          ];

    let stepIndex = 0;
    setThinkingStep(steps[stepIndex]);

    const thinkingInterval = setInterval(() => {
      stepIndex++;

      if (stepIndex < steps.length) {
        setThinkingStep(steps[stepIndex]);
      }
    }, 650);

    try {
      const result = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ situation, mode })
      });

      const data = await result.json();

      clearInterval(thinkingInterval);

      setTimeout(() => {
        setLoading(false);
        setResponse(data.response || "Whatever. The AI shrugged and walked away.");
      }, 400);
    } catch {
      clearInterval(thinkingInterval);
      setLoading(false);
      setResponse("Something broke. Typical. Try again.");
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
          {loading ? "Processing sarcasm..." : "▶ Say it like Gen X"}
        </button>

        <div className={loading ? "response loading" : "response"}>
          <div className="response-label">
            {loading ? "loading sarcasm:" : "gen x says:"}
          </div>
          <p>
            {displayedResponse}
            <span className="cursor">|</span>
          </p>
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