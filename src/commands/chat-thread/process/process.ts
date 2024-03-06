import { ChatInputCommandInteraction, Client } from "discord.js";
import { ChatSubcommandProcess } from "./chat";
import { CloseSubcommandProcess } from "./close";
import { OpenSubcommandProcess } from "./open";

type Options = {
  interaction: ChatInputCommandInteraction;
  client: Client;
};

const chatThreadCommandProcess = async ({ interaction, client }: Options) => {
  const channel = interaction.channel;

  if (channel === null) {
    await interaction.reply("チャンネルが見つかりません");
    return;
  }

  if (interaction.options.getSubcommand() === "open") {
    await OpenSubcommandProcess({
      interaction,
      channel,
      client,
    });
  }

  if (interaction.options.getSubcommand() === "close") {
    await CloseSubcommandProcess({
      interaction,
      channel,
      client,
    });
  }

  if (interaction.options.getSubcommand() === "chat") {
    await ChatSubcommandProcess({
      interaction,
      channel,
      client,
    });
  }
};

export { chatThreadCommandProcess };
