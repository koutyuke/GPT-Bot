import type { ApplicationCommandDataResolvable } from "discord.js";

const pingCommandDetail = {
  name: "ping",
  description: "Replies with Pong!",
} satisfies ApplicationCommandDataResolvable;

export { pingCommandDetail };
