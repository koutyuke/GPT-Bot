import { PromptTemplate } from "@langchain/core/prompts";

type Options = {
  log?: string | undefined;
  question: string;
};

const chatBasePromptTemplate = async ({ log, question }: Options) => {
  const textTemplate = new PromptTemplate({
    template: "---chat log---\n{log}\n\n---question---\n{question}",
    inputVariables: ["log", "question"],
  });
  return await textTemplate.format({ log: log ?? "None", question });
};

export { chatBasePromptTemplate };
