const { GoogleGenerativeAI } = require("@google/generative-ai");
const { analyzeEmotion } = require("./emotionUtils");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.askAI = async (req, res) => {
  try {
    const { message } = req.body;

    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    // Analyze emotion
    const { emotion, score } = analyzeEmotion(message);
    console.log("Emotion:", emotion, "Score:", score); 

    res.json({
      reply: text,
      emotion,
      score,
    });
  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({ reply: "I'm here for you." });
  }
};
