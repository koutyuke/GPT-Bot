import { ChatInputCommandInteraction } from "discord.js";

type Options = {
  interaction: ChatInputCommandInteraction;
};

const pingCommandProcess = async ({ interaction }: Options) => {
  await interaction.reply("Pong！");
  return;
};

export { pingCommandProcess };
