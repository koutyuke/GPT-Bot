import { MessageContent } from "@langchain/core/messages";

const createAIResponseMessage = (messageContent: MessageContent): string => {
  if (typeof messageContent === "string") {
    return messageContent;
  }
  return messageContent.reduce(
    (acc, c) =>
      acc +
      (c.type === "text"
        ? c.text
        : typeof c.image_url === "string"
        ? `\n${c.image_url}\n`
        : `\n${c.image_url.url}\n`),
    ""
  );
};

export { createAIResponseMessage };
