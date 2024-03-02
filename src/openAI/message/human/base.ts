import { chatBasePromptTemplate } from "@/openAI/promptTemplate/base";
import { HumanMessage } from "@langchain/core/messages";

type Options = Parameters<typeof chatBasePromptTemplate>[0];

const baseHumanMessage = async ({ ...options }: Options) => {
  return new HumanMessage(await chatBasePromptTemplate(options));
};

export { baseHumanMessage };
