import { Message } from "discord.js";

type Options = {
  firstPreviousMessage: Message;
};

const maxMessageLogCount =
  parseInt(process.env.MAX_MESSAGE_LOG_COUNT ?? "5") - 1;

// Previous Message: https://discord.com/channels/guildId/channelId/messageId
const messageInPreviousMessageIdRegex =
  /^Previous Message: https:\/\/discord\.com\/channels\/(\d+)\/(\d+)\/(\d+)/;

const previousMessageContentRegex =
  /^Previous Message: https:\/\/discord\.com\/channels\/(\d+)\/(\d+)\/(\d+)/;

const createMessageLog = async ({ firstPreviousMessage }: Options) => {
  const messageLog: string[] = [];
  const channelId = firstPreviousMessage.channelId;
  const guildId = firstPreviousMessage.guildId;

  const fetchMessageLog = async (message: Message, messageCount: number) => {
    const match = message.content.match(messageInPreviousMessageIdRegex);

    const contentBody = message.content
      // 参照部分を削除
      .replace(previousMessageContentRegex, "")
      // 先頭の改行を削除
      .replace(/^\s*\n/, "")
      // 行の先頭にある空白を削除
      .replace(/^[ \t]+/gm, "");

    messageLog.splice(0, 0, contentBody);

    if (match === null || messageCount <= 0) {
      return;
    }

    const messageId = match[3] as string[number];
    const previousMessage = await message.channel.messages
      .fetch(messageId)
      .catch(() => null);
    if (
      previousMessage === null ||
      previousMessage.author.id !== message.author.id ||
      previousMessage.guildId !== guildId ||
      previousMessage.channelId !== channelId
    ) {
      return;
    }

    await fetchMessageLog(previousMessage, messageCount - 1);
  };

  await fetchMessageLog(firstPreviousMessage, maxMessageLogCount);

  return messageLog.join("\n");
};

export { createMessageLog };
