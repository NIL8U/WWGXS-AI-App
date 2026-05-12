export default async function handler(req, res) {
  try {
    const { situation } = req.body;

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
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
              content:
                "You are a sarcastic, witty, funny GenX personality. Give short punchy responses with humor and attitude.",
            },
            {
              role: "user",
              content: situation,
            },
          ],
          max_tokens: 80,
        }),
      }
    );

    const data = await response.json();

    const message =
      data.choices?.[0]?.message?.content ||
      "Whatever. Everything is terrible.";

    res.status(200).json({
      response: message,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to generate response.",
    });
  }
}