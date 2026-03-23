import Groq from "groq-sdk";
import User from "../models/User.js";
import Payment from "../models/Payment.js";
import Project from "../models/Project.js";
import Visit from "../models/Visit.js";

export const chatWithBot = async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    const userId = req.user.id;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // ─── Fetch real data from MongoDB ───
    const user = await User.findById(userId).select("name email");

    const payments = await Payment.find({ customer: userId })
      .populate("project", "name location price")
      .lean();

    const projects = await Project.find()
      .select("name area price status location emiMonths minDownPayment description features")
      .lean();

    const visits = await Visit.find({ customer: userId })
      .populate("project", "name location")
      .lean();

    // ─── Build context string ───
    const customerContext = `
CUSTOMER INFORMATION:
- Name: ${user?.name || "N/A"}
- Email: ${user?.email || "N/A"}

AVAILABLE PROJECTS (${projects.length} total):
${projects.map((p, i) =>
  `${i + 1}. ${p.name}
   - Area: ${p.area}
   - Price: ₹${p.price?.toLocaleString()}
   - Status: ${p.status}
   - Location: ${p.location || "N/A"}
   - EMI Duration: ${p.emiMonths} months
   - Min Down Payment: ₹${p.minDownPayment?.toLocaleString()}
   - Description: ${p.description || "N/A"}
   - Features: ${p.features?.join(", ") || "N/A"}`
).join("\n\n")}

CUSTOMER PAYMENTS (${payments.length} total):
${payments.length === 0 ? "No payments found." :
  payments.map((p, i) =>
    `${i + 1}. Project: ${p.project?.name || "N/A"}
   - Total Amount: ₹${p.totalAmount?.toLocaleString()}
   - Paid Amount: ₹${p.paidAmount?.toLocaleString()}
   - Pending Amount: ₹${p.pendingAmount?.toLocaleString()}
   - Monthly EMI: ₹${p.monthlyAmount?.toLocaleString()}
   - EMI Months: ${p.months}
   - Status: ${p.status}
   - Payment Requests: ${p.paymentRequests?.length || 0} request(s)`
  ).join("\n\n")}

CUSTOMER SITE VISITS (${visits.length} total):
${visits.length === 0 ? "No visits scheduled." :
  visits.map((v, i) =>
    `${i + 1}. Project: ${v.project?.name || "N/A"}
   - Date: ${v.date}
   - Time: ${v.time}
   - Status: ${v.status}
   - Notes: ${v.notes || "N/A"}`
  ).join("\n\n")}
`;

    const SYSTEM_PROMPT = `
You are RealtyBot, a helpful AI assistant for RealtyEngage — a real estate customer engagement platform.

You have access to the customer's real data shown below. Use this data to give accurate, specific answers.
NEVER say "check your dashboard" — always answer directly from the data provided.
If something is truly not in the data, say "I don't have that information right now."

${customerContext}

You help customers with:
- Questions about available projects and properties
- EMI payment plans and payment details
- Site visit scheduling and status
- Maintenance requests
- General platform navigation

Always be polite, concise, and professional.
Do not answer questions unrelated to real estate or this platform.
`;

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const chatHistory = history.map((msg) => ({
      role: msg.role === "assistant" ? "assistant" : "user",
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

  } catch (_error) {
    console.error("Bot error:", _error);
    res.status(500).json({ error: "Bot failed to respond. Please try again." });
  }
};