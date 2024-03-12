import { ChatMessageHistory } from "@langchain/community/stores/message/in_memory";
import { Message } from "discord.js";

type Options = {
  firstPreviousMessage: Message;
};

const maxMessageLogCount = parseInt(process.env.MAX_MESSAGE_LOG_COUNT ?? "5");

// Previous Message: https://discord.com/channels/guildId/channelId/messageId
const messageInPreviousMessageIdRegex =
  /^Previous Message: https:\/\/discord\.com\/channels\/(\d+)\/(\d+)\/(\d+)/;

const createPreviousMessageHistory = async ({
  firstPreviousMessage,
}: Options) => {
  const messageHistory = new ChatMessageHistory();
  const channelId = firstPreviousMessage.channelId;

  const fetchMessageLog = async (message: Message, messageCount: number) => {
    const previousMessageIds = message.content.match(
      messageInPreviousMessageIdRegex
    );

    const contentBody = message.content
      // 参照部分を削除
      .replace(messageInPreviousMessageIdRegex, "")
      // 先頭の改行を削除
      .replace(/^\s*\n/, "")
      // 行の先頭にある空白を削除
      .replace(/^[ \t]+/g, "");

    console.log(contentBody);

    if (previousMessageIds !== null && messageCount > 0) {
      // messageHistory.splice(0, 0, contentBody);

      const messageId = previousMessageIds[3] as string[number];
      const previousMessage = await message.channel.messages
        .fetch(messageId)
        .catch(() => null);

      if (
        previousMessage !== null &&
        previousMessage.author.id === message.author.id &&
        previousMessage.channelId === channelId
      ) {
        await fetchMessageLog(previousMessage, messageCount - 1);
      }
    }

    messageHistory.addUserMessage(contentBody);
  };

  await fetchMessageLog(firstPreviousMessage, maxMessageLogCount);

  return messageHistory;
};

export { createPreviousMessageHistory };
