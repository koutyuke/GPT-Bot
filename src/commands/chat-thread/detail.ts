import {
  ApplicationCommandDataResolvable,
  ApplicationCommandOptionType,
} from "discord.js";

const chatThreadCommandDetail = {
  name: "chat-thread",
  description: "AI Chat Threadを操作するコマンドだぞ!",
  options: [
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: "open",
      description: "AI Chat Threadを新規作成するぞ!",
      options: [
        {
          name: "name",
          type: ApplicationCommandOptionType.String,
          description: "スレッドの名前を指定してください(最大20文字)",
        },
      ],
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: "close",
      description: "AI Chat Threadを終了(削除)するぞ!",
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: "chat",
      description: "Threadの履歴を元にAIとおしゃべりができるぞ!",
      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: "text",
          description: "AIに送るテキストを指定してください(必須)",
          required: true,
        },
        {
          type: ApplicationCommandOptionType.Boolean,
          name: "send_text_channel",
          description:
            "同一のメッセージをテキストチャンネルにも送信するかどうかを指定してください(デフォルト: false)",
        },
        {
          type: ApplicationCommandOptionType.String,
          name: "model",
          description: "モデル名を指定してください(デフォルト: GPT-4.5-turbo)",
          choices: [
            { name: "GPT-3.5-turbo", value: "gpt-3.5-turbo" },
            { name: "GPT-4", value: "gpt-4" },
            {
              name: "GPT-4-turbo",
              value: "gpt-4-turbo-preview",
            },
          ],
        },
        {
          name: "max_message_history_count",
          type: ApplicationCommandOptionType.Integer,
          description:
            "スレッド内の履歴を最大何件まで使用するかを指定してください(デフォルト: 10)",
          max_value: 10,
          min_value: 0,
        },
      ],
    },
  ],
} satisfies ApplicationCommandDataResolvable;

export { chatThreadCommandDetail };
