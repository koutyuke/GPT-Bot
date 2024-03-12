import { type ApplicationCommandDataResolvable } from "discord.js";
import { chatCommandDetail } from "./chat";
import { chatThreadCommandDetail } from "./chat-thread";
import { pingCommandDetail } from "./ping";
import { searchCommandDetail } from "./search-chat";

const commands: ApplicationCommandDataResolvable[] = [
  pingCommandDetail,
  chatCommandDetail,
  searchCommandDetail,
  chatThreadCommandDetail,
];

export { commands };
