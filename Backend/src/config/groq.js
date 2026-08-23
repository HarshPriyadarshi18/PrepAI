import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();
console.log("GROQ KEY LOADED:", process.env.GROQ_API_KEY ? "yes (" + process.env.GROQ_API_KEY.slice(0,8) + "...)" : "NO - undefined");
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export default groq;