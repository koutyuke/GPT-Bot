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

const CloseSubcommandProcess = async ({
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

  await interaction.reply("スレッドを修了したぞ!");
  await channel.delete("AI Chat Thread Close!");
};

export { CloseSubcommandProcess };
