import { ChatGoogle } from "@langchain/google";
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatCohere } from "@langchain/cohere";
import config from "../config/config.js";

export const modelFactory = (provider: any, modelName: any) => {
  switch (provider) {
    case "mistral":
      return new ChatMistralAI({
        model: modelName || "mistral-small-latest", // Latest 2026 Unified Model
        apiKey: config.MISTRAL_API_KEY,
      });
    case "google":
      return new ChatGoogle({
        model: modelName || "gemini-3-flash-preview",
        apiKey: config.GEMINI_API_KEY,
      });
    case "cohere":
      return new ChatCohere({
        model: modelName || "command-a", // 2026 High-throughput flagship
        apiKey: config.COHERE_API_KEY,
      });
    default:
      return new ChatGoogle({
        model: "gemini-3-flash",
        apiKey: config.GEMINI_API_KEY,
      });
  }
};

export const judgeModel = new ChatGoogle({
  model: "gemini-3-flash-preview",
  apiKey: config.GEMINI_API_KEY,
});
