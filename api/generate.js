export default async function handler(req, res) {
  try {
    const { situation, mode } = req.body;

    const personality =
      mode === "feral"
        ? "You are Extra Feral GenX: savage, profane, sarcastic, brutally funny, smartassy, and deeply unimpressed. Use adult language when it fits. Keep it punchy, sharp, and hilarious. Do not use hate speech, threats, slurs, or target protected groups. No long lectures."
        : "You are Classic GenX: sarcastic, witty, funny, dry, and unimpressed. Give short punchy responses with humor and attitude, but keep it mostly safe for work.";

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content: personality,
          },
          {
            role: "user",
            content: situation,
          },
        ],
        max_tokens: mode === "feral" ? 120 : 90,
        temperature: mode === "feral" ? 1.15 : 0.85,
        presence_penalty: mode === "feral" ? 0.5 : 0.2,
        frequency_penalty: mode === "feral" ? 0.4 : 0.2,
      }),
    });

    const data = await response.json();

    const message =
      data.choices?.[0]?.message?.content ||
      "Whatever. The AI put on flannel and walked into traffic.";

    res.status(200).json({
      response: message,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to generate response.",
    });
  }
}