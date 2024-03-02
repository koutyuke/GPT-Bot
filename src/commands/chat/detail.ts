import { ChatModel } from "@/openAI/model";
import {
  type ApplicationCommandDataResolvable,
  ApplicationCommandOptionType,
} from "discord.js";

type ModelOption = {
  name: "GPT-3.5-turbo" | "GPT-4" | "GPT-4-turbo";
  value: ChatModel;
};

const chatCommandDetail = {
  name: "chat",
  description: "AIとおしゃべりができるぞ!",
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: "text",
      description: "AIに送るテキストを指定してください",
      required: true,
    },
    {
      type: ApplicationCommandOptionType.String,
      name: "previous_message_id",
      description:
        "前のメッセージのIDを指定してください(同一チャンネルである必要があります)",
    },
    {
      type: ApplicationCommandOptionType.String,
      name: "model",
      description: "モデル名を指定してください",
      choices: [
        { name: "GPT-3.5-turbo", value: "gpt-3.5-turbo" } satisfies ModelOption,
        { name: "GPT-4", value: "gpt-4" } satisfies ModelOption,
        {
          name: "GPT-4-turbo",
          value: "gpt-4-turbo-preview",
        } satisfies ModelOption,
      ],
    },
  ],
} satisfies ApplicationCommandDataResolvable;

export { chatCommandDetail };
