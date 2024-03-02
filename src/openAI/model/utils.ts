import { ChatModel } from "./model";

const convertToModelName = (text: string | null): ChatModel => {
  switch (text) {
    case "GPT-3.5-turbo":
      return "gpt-3.5-turbo";
    case "GPT-4":
      return "gpt-4";
    case "GPT-4-turbo":
      return "gpt-4-turbo-preview";
    default:
      return "gpt-4-turbo-preview";
  }
};

export { convertToModelName };
