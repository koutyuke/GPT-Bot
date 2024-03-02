import {
  ApplicationCommandType,
  Client,
  Events,
  GatewayIntentBits,
} from "discord.js";
import { commands, pingCommandDetail, pingCommandProcess } from "./commands";
import { chatCommandDetail } from "./commands/chat/detail";
import { chatCommandProcess } from "./commands/chat/process";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, async (c) => {
  await client.application?.commands.set(commands, "854266006738305050");
  await client.application?.commands.set(commands, "1102532790181953616");
  await client.application?.commands.set(commands, "1154660044802105344");

  // biome-ignore lint/suspicious/noConsoleLog: <explanation>
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  if (
    !interaction.isCommand() ||
    interaction.commandType !== ApplicationCommandType.ChatInput
  ) {
    return;
  }

  if (interaction.commandName === pingCommandDetail.name) {
    await pingCommandProcess({ interaction });
    return;
  }

  if (interaction.commandName === chatCommandDetail.name) {
    await chatCommandProcess({ interaction, client });
    return;
  }
});

client.login(process.env.DISCORD_TOKEN);
