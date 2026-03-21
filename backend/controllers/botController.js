import Groq from "groq-sdk";

const SYSTEM_PROMPT = `
You are RealtyBot, a helpful AI assistant for RealtyEngage — a real estate customer engagement platform.
You help customers with:
- Questions about real estate projects and properties
- EMI payment plans and payment tracking
- Site visit scheduling
- Maintenance requests
- General platform navigation

Always be polite, concise, and professional.
If you don't know something specific about the customer's data, ask them to check their dashboard.
Do not answer questions unrelated to real estate or this platform.
`;

export const chatWithBot = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const chatHistory = history.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...chatHistory,
        { role: "user", content: message },
      ],
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });

  } catch (error) {
    console.error("Bot error:", error);
    res.status(500).json({ error: "Bot failed to respond. Please try again." });
  }
};