import { baseHumanMessage } from "@/openAI/message/human";
import { baseSystemMessage } from "@/openAI/message/system";
import { createChatModel } from "@/openAI/model";
import { convertToModelName } from "@/openAI/model/utils";
import { createAIResponseMessage } from "@/openAI/utils";
import { createMessageLog } from "@/utils";
import { ChatInputCommandInteraction, Client } from "discord.js";

type Options = {
  interaction: ChatInputCommandInteraction;
  client: Client;
};

const chatCommandProcess = async ({ interaction, client }: Options) => {
  await interaction.deferReply();

  const model = convertToModelName(interaction.options.getString("model"));
  const text = interaction.options.getString("text");

  const previousMessageId = interaction.options.getString(
    "previous_message_id"
  );

  let messageLog: string | undefined = undefined;

  if (previousMessageId !== null) {
    const previousMessage = await interaction.channel?.messages.fetch(
      previousMessageId
    );
    if (previousMessage === null) {
      await interaction.editReply("前のメッセージが見つかりません");
      return;
    }
    if (previousMessage!.author.id !== client.user?.id) {
      await interaction.editReply(
        "前のメッセージがAIのメッセージではありません"
      );
      return;
    }
    messageLog = await createMessageLog({
      firstPreviousMessage: previousMessage!,
    });
  }

  if (text === null) {
    await interaction.editReply("テキストが指定されていません");
    return;
  }

  const chatModel = createChatModel(model);
  const systemMessage = baseSystemMessage();
  const humanMessage = await baseHumanMessage({
    question: text,
    log: messageLog,
  });

  const res = await chatModel.invoke([systemMessage, humanMessage]);

  const resText = createAIResponseMessage(res.content);

  await interaction.editReply(
    `${
      previousMessageId === null
        ? ""
        : `Previous Message: https://discord.com/channels/${interaction.guildId}/${interaction.channelId}/${previousMessageId}\n\n`
    }> ${text}\n\n${resText}`
  );
};

export { chatCommandProcess };
