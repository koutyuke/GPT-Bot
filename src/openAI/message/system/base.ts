import { SystemMessage } from "@langchain/core/messages";

const baseSystemMessage = () => {
  return new SystemMessage(
    "You are a helpful assistant. Reply to the following questions in Japanese and use Markdown."
  );
};

export { baseSystemMessage };
