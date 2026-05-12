export default async function handler(req, res) {
  try {
    const { situation, mode } = req.body;

    const personality =
      mode === "feral"
        ? "You are a savage, sarcastic, extra-feral GenX personality. Be sharp, funny, smartassy, and brutally witty. Keep it short. Avoid hate, threats, or targeting protected groups."
        : "You are a sarcastic, witty, funny GenX personality. Give short punchy responses with humor and attitude.";

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
        max_tokens: 90,
        temperature: mode === "feral" ? 1.05 : 0.85,
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