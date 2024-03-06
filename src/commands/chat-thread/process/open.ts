import {
  ChannelType,
  ChatInputCommandInteraction,
  Client,
  TextBasedChannel,
  ThreadAutoArchiveDuration,
} from "discord.js";

type Options = {
  interaction: ChatInputCommandInteraction;
  client: Client;
  channel: TextBasedChannel;
};

const OpenSubcommandProcess = async ({ interaction, channel }: Options) => {
  if (channel.type !== ChannelType.GuildText) {
    await interaction.reply(
      "このコマンドはテキストチャンネルでのみ使用でしか使えないぞ!"
    );
    return;
  }

  const threadName = interaction.options.getString("name");

  const createThread = await channel.threads
    .create({
      name: threadName ?? "new thread",
      autoArchiveDuration: ThreadAutoArchiveDuration.OneDay,
      reason: "AI Chat Thread Create!",
    })
    .catch((e) => {
      throw e;
    });

  await createThread.send(
    "AI Chat Thread Create🎉🎉\n\nこのスレッド内では以下のコマンドを使用してくれ!\n\n* `/chat-thread chat` AIとおしゃべりができるぞ!\n* `/chat-thread close` このスレッドを修了(削除)するぞ\n\nこのスレッドをテキストチャンネルの下に表示させたい場合は何かしらのコメントをスレッド内で入力してください。(GPTへの履歴には含まれません)"
  );
  await interaction.reply("スレッドを作成したぞ!");
};

export { OpenSubcommandProcess };
