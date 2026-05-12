export default function App() {
  return (
    <main className="app">
      <section className="card">
        <h1>GenXSays</h1>
        <p className="tagline">
          Enter a situation. Get the GenX response nobody asked for, but everyone needed.
        </p>

        <textarea
          placeholder="Example: My boss scheduled a meeting to discuss why we have too many meetings..."
        />

        <button>Generate GenX Response</button>

        <div className="response">
          <strong>GenX says:</strong>
          <p>Whatever. Rub some dirt on it and make better choices.</p>
        </div>
      </section>
    </main>
  );
}