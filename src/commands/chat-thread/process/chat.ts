import { baseSystemMessage } from "@/openAI/message/system";
import { createChatModel } from "@/openAI/model";
import { convertToModelName } from "@/openAI/model/utils";
import { createAIResponseMessage } from "@/openAI/utils";
import { createThreadMessageHistory } from "@/utils/createThreadMessageHistory";
import { HumanMessage } from "@langchain/core/messages";
import {
  ChannelType,
  ChatInputCommandInteraction,
  Client,
  TextBasedChannel,
} from "discord.js";

type Options = {
  interaction: ChatInputCommandInteraction;
  client: Client;
  channel: TextBasedChannel;
};

const ChatSubcommandProcess = async ({
  interaction,
  channel,
  client,
}: Options) => {
  if (
    channel.type !== ChannelType.PublicThread &&
    channel.type !== ChannelType.PrivateThread
  ) {
    await interaction.reply("このコマンドはスレッドでのみでしか使えないぞ!");
    return;
  }

  if (channel.ownerId !== client.user?.id) {
    await interaction.reply("このスレッドはAI Chat Threadではないぞ!");
    return;
  }

  await interaction.deferReply();

  const options = {
    text: interaction.options.getString("text") ?? "",
    model: convertToModelName(interaction.options.getString("model")),
    sendTextChannel:
      interaction.options.getBoolean("send_text_channel") ?? false,
    maxMessageHistoryCount:
      interaction.options.getInteger("max_message_history_count") ?? 10,
  };

  const chatModel = createChatModel(options.model);
  const systemMessage = baseSystemMessage();
  const humanMessage = new HumanMessage(options.text);

  const messageHistory = await createThreadMessageHistory({
    channel,
    client,
    maxMessageHistoryCount: options.maxMessageHistoryCount,
  });
  const messageHistoryContent = await messageHistory.getMessages();

  const parentId = channel.parentId;

  const res = await chatModel
    .invoke([systemMessage, ...messageHistoryContent, humanMessage])
    .catch(async () => {
      await interaction.editReply("AIとの会話中にエラーが発生しました");
      return null;
    });

  if (res === null) {
    return;
  }

  const resText = createAIResponseMessage(res.content);

  await interaction.editReply(`> ${options.text}\n\n${resText}`);

  if (options.sendTextChannel && parentId) {
    const parentChannel = await interaction.guild?.channels.fetch(parentId);
    if (parentChannel?.type === ChannelType.GuildText) {
      await parentChannel.send(`> ${options.text}\n\n${resText}`);
    }
  }
};

export { ChatSubcommandProcess };
