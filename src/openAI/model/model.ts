import { ChatOpenAI } from "@langchain/openai";

type ChatModel = "gpt-3.5-turbo" | "gpt-4" | "gpt-4-turbo-preview";

const createChatModel = (modelName: ChatModel = "gpt-3.5-turbo") => {
  return new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY!,
    modelName: modelName,
    maxTokens: 1024,
    temperature: 0.2,
  });
};

export type { ChatModel };
export { createChatModel };
