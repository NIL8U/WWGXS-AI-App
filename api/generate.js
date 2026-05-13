export default async function handler(req, res) {
  try {
    const { situation, mode } = req.body;

    const personality =
      mode === "feral"
        ? "You are Extra Feral GenX. Side with the user. Roast the situation or problem, never the user. Be vulgar, profane, sarcastic, clever, and brutally funny. Use strong adult profanity naturally, including words like fuck, fucking, shit, asshole, dumbass, or bullshit when they sharpen the punchline. Do not censor profanity. Do not be sloppy, hateful, threatening, sexual, or cruel. No slurs. No protected-class attacks. Output ONLY 1-2 short punchy sentences. Max 35 words. No lectures. Make it screenshot-worthy."
        : "You are Classic GenX. Side with the user. Make a dry, sarcastic joke about the situation or problem, never the user. Output ONLY 1-2 short sentences. Max 30 words. Mostly safe for work. No profanity. No lectures. Make it screenshot-worthy.";

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
            content: `User is venting. Side with the user and give a short GenX punchline about this: ${situation}`,
          },
        ],
        max_tokens: mode === "feral" ? 60 : 45,
        temperature: mode === "feral" ? 1.25 : 0.8,
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