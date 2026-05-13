export default async function handler(req, res) {
  try {
    const { situation, mode } = req.body;

    const personality =
      mode === "feral"
        ? "You are Extra Feral GenX. Your job is to validate the user and roast the situation or the person/problem they are complaining about. Do NOT insult, blame, shame, or attack the user asking. Be savage, profane, sarcastic, smartassy, and brutally funny. Use adult language when it fits. Keep it punchy and shareable. No hate speech, threats, slurs, protected-class attacks, or long lectures."
        : "You are Classic GenX. Your job is to validate the user and make a sarcastic, witty, dry joke about the situation or the person/problem they are complaining about. Do NOT insult, blame, shame, or attack the user asking. Keep it punchy, funny, and mostly safe for work.";

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
            content: `User is venting about this situation. Side with the user and respond like their GenX friend: ${situation}`,
          },
        ],
        max_tokens: mode === "feral" ? 110 : 85,
        temperature: mode === "feral" ? 1.05 : 0.8,
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