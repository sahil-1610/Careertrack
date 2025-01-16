// @/helpers/geminiAIModel.js
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing in environment variables");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const safety_settings = [
  {
    category: HarmCategory.HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
];

const generationConfig = {
  temperature: 0.7,
  topP: 0.9,
  topK: 40,
  maxOutputTokens: 1000,
  responseMimeType: "text/plain",
};

/**
 * Sends a message to Gemini AI and returns the response
 * @param {string} prompt - The message to send
 * @returns {Promise<string>} - The AI's response
 */
export async function generateAIResponse(prompt) {
  try {
    // Input validation
    if (!prompt || typeof prompt !== "string") {
      throw new Error("Invalid prompt provided");
    }

    // Generate the response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini AI Error:", error);
    throw new Error(`AI Processing error: ${error.message}`);
  }
}

/**
 * Maintains a chat session with Gemini AI
 * @param {string} prompt - The message to send
 * @returns {Promise<string>} - The AI's response
 */
export async function chatWithAI(prompt) {
  try {
    // Input validation
    if (!prompt || typeof prompt !== "string") {
      throw new Error("Invalid prompt provided");
    }

    // Create a new chat session
    const chat = await model.startChat({
      generationConfig,
      safety_settings,
    });

    // Send message and get response
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    throw new Error(`Chat Processing error: ${error.message}`);
  }
}
