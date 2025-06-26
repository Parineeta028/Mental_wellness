const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.getSuggestions = async (req, res) => {
  const { emotion } = req.body;

  if (!emotion) {
    return res.status(400).json({ error: "Emotion is required" });
  }

  const prompt = `A user is feeling "${emotion}". Suggest 4 helpful and soothing actions. Include ideas like journal prompts, relaxing activities, grounding techniques, or gentle reminders. Respond with a plain list.`;

  try {
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Convert Gemini output into array (bullet points or new lines)
    const suggestions = text
      .split("\n")
      .map((line) => line.replace(/^[-•\d.]\s*/, "").trim())
      .filter((line) => line.length > 0);

    res.json({ emotion, suggestions });
  } catch (error) {
    console.error("Error getting suggestions:", error);
    res.status(500).json({ error: "Failed to generate suggestions" });
  }
};
