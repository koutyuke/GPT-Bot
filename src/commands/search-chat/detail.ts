import type { GPTModel } from "@/openAI/model";
import {
  type ApplicationCommandDataResolvable,
  ApplicationCommandOptionType,
} from "discord.js";

type ModelOption = {
  name: "GPT-3.5-turbo" | "GPT-4" | "GPT-4-turbo";
  value: GPTModel;
};

const searchCommandDetail = {
  name: "search-chat",
  description: "検索エンジンを使って回答をするぞ!",
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: "text",
      description: "AIに送るテキストを指定してください",
      required: true,
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

export { searchCommandDetail };
