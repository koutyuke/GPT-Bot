import { ChatOpenAI } from "@langchain/openai";
import { GPTModel } from "./type";

const createChatModel = (modelName: GPTModel = "gpt-3.5-turbo") => {
  return new ChatOpenAI({
    modelName: modelName,
    maxTokens: 1024,
    temperature: 0.2,
  });
};

export { createChatModel };
