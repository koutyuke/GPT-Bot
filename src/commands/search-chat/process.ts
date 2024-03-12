import { searchSystemMessage } from "@/openAI/message/system";
import { createChatModel } from "@/openAI/model";
import { convertToModelName } from "@/openAI/model/utils";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { ChatInputCommandInteraction, Client } from "discord.js";
import { AgentExecutor, createOpenAIToolsAgent } from "langchain/agents";

type Options = {
  interaction: ChatInputCommandInteraction;
  client: Client;
};

const searchCommandProcess = async ({ interaction }: Options) => {
  const channel = interaction.channel;

  if (channel === null) {
    await interaction.reply("チャンネルが見つかりません");
    return;
  }

  await interaction.deferReply();

  const options = {
    text: interaction.options.getString("text") ?? "",
    model: convertToModelName(interaction.options.getString("model")),
  };

  const chatModel = createChatModel(options.model);
  const systemMessage = searchSystemMessage();
  const humanMessageTemplate =
    HumanMessagePromptTemplate.fromTemplate("{text}");

  const agentScratchpadPlaceholder = new MessagesPlaceholder(
    "agent_scratchpad"
  );

  const tools = [new TavilySearchResults({ maxResults: 5 })];

  const prompt = ChatPromptTemplate.fromMessages([
    systemMessage,
    humanMessageTemplate,
    agentScratchpadPlaceholder,
  ]);

  const agent = await createOpenAIToolsAgent({
    llm: chatModel,
    tools,
    prompt,
  });

  const agentExecutor = new AgentExecutor({
    agent,
    tools,
  });

  const result = await agentExecutor
    .invoke({
      text: options.text,
    })
    .catch((e) => {
      console.error(e);
      return null;
    });

  if (result === null) {
    await interaction.editReply("エラーが発生しました");
    return;
  }

  await interaction.editReply(`> ${options.text}\n\n${result.output}`);
};

export { searchCommandProcess };
