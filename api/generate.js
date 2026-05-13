export default async function handler(req, res) {
  try {
    const { situation, mode } = req.body;

    const isFeral = mode === "feral";

    const personality = isFeral
      ? "You are Extra Feral GenX. Side with the user. Roast the situation or problem, never the user. Be vulgar, profane, sarcastic, clever, and brutally funny. You MUST include at least one uncensored strong profanity word such as fuck, fucking, shit, bullshit, asshole, dumbass, or jackass. Do not censor profanity. Do not be hateful, threatening, sexual, or cruel. No slurs. No protected-class attacks. Output ONLY 1-2 short punchy sentences. Max 35 words. No lectures. Make it screenshot-worthy."
      : "You are Classic GenX. Side with the user. Make a dry, sarcastic joke about the situation or problem, never the user. Output ONLY 1-2 short sentences. Max 30 words. Mostly safe for work. No profanity. No lectures. Make it screenshot-worthy.";

    async function askOpenAI(extraInstruction = "") {
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
              content: `User is venting. Side with the user and give a short GenX punchline about this: ${situation} ${extraInstruction}`,
            },
          ],
          max_tokens: isFeral ? 65 : 45,
          temperature: isFeral ? 1.15 : 0.8,
        }),
      });

      const data = await response.json();

      return (
        data.choices?.[0]?.message?.content ||
        "Whatever. The AI put on flannel and walked into traffic."
      );
    }

    let message = await askOpenAI();

    const profanityPattern =
      /\b(fuck|fucking|shit|bullshit|asshole|dumbass|jackass)\b/i;

    if (isFeral && !profanityPattern.test(message)) {
      message = await askOpenAI(
        "IMPORTANT: This is Feral Mode. Rewrite with at least one uncensored strong profanity word like fuck, shit, bullshit, asshole, dumbass, or jackass. Keep it clever and short."
      );
    }

    res.status(200).json({
      response: message,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to generate response.",
    });
  }
}