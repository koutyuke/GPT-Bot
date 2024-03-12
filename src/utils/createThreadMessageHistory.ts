import { ChatMessageHistory } from "@langchain/community/stores/message/in_memory";
import {
  Client,
  Message,
  PrivateThreadChannel,
  PublicThreadChannel,
} from "discord.js";

type Props = {
  client: Client;
  channel: PrivateThreadChannel | PublicThreadChannel;
  maxMessageHistoryCount: number;
};

const userMessageReg = /^> .+/;

const createThreadMessageHistory = async ({
  channel,
  client,
  maxMessageHistoryCount,
}: Props) => {
  const botId = client.user!.id;
  const messages = await channel.messages
    .fetch()
    .then((messages) =>
      messages.filter((message) => message.author.id === botId)
    );

  const messageHistory = new ChatMessageHistory();

  let messageCount = 0;

  const addMessageHistory = (m: IterableIterator<Message>) => {
    const foo = m.next();
    if (messageCount > maxMessageHistoryCount || foo.done) {
      return;
    }

    const message = foo.value;
    const firstLine = message.content.split("\n")[0];
    const userInput = firstLine?.match(userMessageReg);
    const aiAnswer = message.content.replace(userMessageReg, "").trim();

    if (firstLine && userInput) {
      messageCount++;

      addMessageHistory(m);

      messageHistory.addUserMessage(userInput[0].replace(/^> /, ""));
      messageHistory.addAIMessage(aiAnswer);
    } else {
      addMessageHistory(m);
    }
  };

  addMessageHistory(messages.values());
  return messageHistory;
};

export { createThreadMessageHistory };
