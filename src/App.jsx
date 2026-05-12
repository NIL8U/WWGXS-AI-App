import { useState } from "react";

export default function App() {
  const [situation, setSituation] = useState("");
  const [response, setResponse] = useState(
    "Whatever. Rub some dirt on it and make better choices."
  );

  const responses = [
    "Sounds like a personal problem. Figure it out.",
    "We survived drinking from garden hoses. He’ll live.",
    "Back in our day we had jobs AND trauma.",
    "Tell him motivation isn’t downloadable.",
    "Funny how nobody wants a job until Taco Bell sounds good."
  ];

  function generateResponse() {
    const random =
      responses[Math.floor(Math.random() * responses.length)];

    setResponse(random);
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

        <button onClick={generateResponse}>
          Generate GenX Response
        </button>

        <div className="response">
          <strong>GenX says:</strong>
          <p>{response}</p>
        </div>
      </section>
    </main>
  );
}