import { baseSystemMessage } from "@/openAI/message/system";
import { createChatModel } from "@/openAI/model";
import { convertToModelName } from "@/openAI/model/utils";
import { createAIResponseMessage } from "@/openAI/utils";
import { createPreviousMessageHistory } from "@/utils";
import { ChatMessageHistory } from "@langchain/community/stores/message/in_memory";
import { HumanMessage } from "@langchain/core/messages";
import { ChatInputCommandInteraction, Client } from "discord.js";

type Options = {
  interaction: ChatInputCommandInteraction;
  client: Client;
};

const chatCommandProcess = async ({ interaction, client }: Options) => {
  await interaction.deferReply();

  const modelName = convertToModelName(interaction.options.getString("model"));
  const text = interaction.options.getString("text");

  const previousMessageId = interaction.options.getString(
    "previous_message_id"
  );

  let messageHistory: ChatMessageHistory | undefined = undefined;

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

    messageHistory = await createPreviousMessageHistory({
      firstPreviousMessage: previousMessage!,
    });
  }

  if (text === null) {
    await interaction.editReply("テキストが指定されていません");
    return;
  }

  const chatModel = createChatModel(modelName);
  const systemMessage = baseSystemMessage();
  const humanMessage = new HumanMessage(text);

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
