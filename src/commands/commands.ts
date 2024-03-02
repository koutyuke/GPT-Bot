import { type ApplicationCommandDataResolvable } from "discord.js";
import { chatCommandDetail } from "./chat";
import { pingCommandDetail } from "./ping";
import { searchCommandDetail } from "./search";

const commands: ApplicationCommandDataResolvable[] = [
  pingCommandDetail,
  chatCommandDetail,
  searchCommandDetail,
];

export { commands };
