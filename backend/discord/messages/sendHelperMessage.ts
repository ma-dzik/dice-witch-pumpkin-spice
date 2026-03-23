import {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
} from "discord.js";
import { availableDice, footerButtonRow, maxImageDice } from "../../core/constants";
import { sendLogEventMessage } from ".";
import { EventType } from "../../shared/types";
import { SendHelperMessageParams } from "../../shared/types";

const createButton = (id: string, label: string) =>
  new ButtonBuilder()
    .setCustomId(id)
    .setLabel(label)
    .setStyle(1);

const createEmbed = (title: string, description: string) =>
  new EmbedBuilder()
    .setColor("#0000ff")
    .addFields({ name: title, value: description });

const sendHelperMessage = async ({
  interaction,
}: Omit<SendHelperMessageParams, 'discord'>) => {

  const kbButtonRow = new ActionRowBuilder()
    .addComponents(
      createButton("knowledgebase-exploding", "Exploding 💥"),
      createButton("knowledgebase-reroll", "Re-roll ♻"),
      createButton("knowledgebase-keepdrop", "Keep/drop 🚮"),
      createButton("knowledgebase-target", "Targets 🎯"),
      createButton("knowledgebase-crit", "Criticals ⚔")
    ) as ActionRowBuilder<ButtonBuilder>;

  const kbButtonRow2 = new ActionRowBuilder()
    .addComponents(
      createButton("knowledgebase-math", "Math 🧮"),
      createButton("knowledgebase-sort", "Sorting ↕"),
      createButton("knowledgebase-repeating", "Repeating 👯‍♀️"),
      createButton("knowledgebase-unique", "Unique ❄️"),
      createButton("knowledgebase-fudge", "Fudge 🎲")
    ) as ActionRowBuilder<ButtonBuilder>;

  const embed = createEmbed(
    `Potrzebujesz pomocy? 😅`,
    `Użyj komendy \`/roll\` z argumentem \`liczba_kości\`, np. \`3\` rzuca 3d6.\nMożesz rzucać tylko kośćmi **d6** — to system esencji!\nMożesz rzucić maksymalnie **${maxImageDice}** kości na raz 😈\n\n`
  );

  const publicHelperMessage = ` 🚫🎲 Invalid dice notation! DMing you some help 😉`;

  try {
    if (!interaction.deferred && !interaction.replied) {
      await interaction.reply(publicHelperMessage);
    } else {
      await interaction.followUp(publicHelperMessage);
    }

    await interaction.user.send({
      embeds: [embed],
      components: [kbButtonRow, kbButtonRow2, footerButtonRow],
    });
  } catch (err) {
    console.error("Error sending helper message:", err);
  }

  sendLogEventMessage({
    eventType: EventType.SENT_HELPER_MESSAGE,
    interaction
  });
};

export default sendHelperMessage;