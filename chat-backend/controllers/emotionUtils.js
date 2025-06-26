const Sentiment = require("sentiment");
const sentiment = new Sentiment();

const analyzeEmotion = (text) => {
  const result = sentiment.analyze(text);
  const score = result.score;

  let emotion = "neutral";
  if (score > 2) emotion = "happy";
  else if (score < -2) emotion = "sad";
  else if (score < 0) emotion = "frustrated";

  return { emotion, score };
};

module.exports = { analyzeEmotion };
