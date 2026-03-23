import {
  ButtonInteraction,
  ColorResolvable,
  CommandInteraction,
  EmbedBuilder
} from "discord.js";
import { CommandProps, KnowledgeBase } from "../../shared/types";
import { footerButtonRow, infoColor } from "../../core/constants/index";

const kb: KnowledgeBase = {
  minmax: [
    {
      name: "Min/Max",
      value:
        "Cause any rolls above/below the value to be treated as equal to the minimum/maximum value.\n\n`/roll liczba_kości:4d6min3`: Roll four d6 where values less than three are treated as equal to three.\n`/roll liczba_kości:4d6max5`: Roll four d6 where values greater than five are treated as equal to five.",
      inline: false,
    },
  ],
  exploding: [
    {
      name: "Exploding dice",
      value:
        "Allows one or more dice to be re-rolled (Usually when it rolls the highest possible number on the die), with each successive roll being added to the total.\n\n`/roll liczba_kości:2d6!=5`: Roll two d6 and explode on any roll equal to five.\n`/roll liczba_kości:2d6!>4`: Roll two d6 and explode on any roll greater than four.\n`/roll liczba_kości:2d6!<=3`: Roll two d6 and explode on any roll less than or equal to three.",
      inline: false,
    },
    {
      name: "Compounding",
      value:
        "Just like exploding, but exploded dice will be combined together in a single roll instead of being re-rolled. You can mark exploding dice to compound by using `!!` instead of `!`\n\n`/roll liczba_kości:2d6!!=5`: Roll two d6 and explode and compound on any roll equal to five.",
      inline: false,
    },
    {
      name: "Penetrating",
      value:
        "A type of exploding dice most commonly used in the Hackmaster system. From the rules:\n`Should you roll the maximum value on this particular die, you may re-roll and add the result of the extra die, less one point, to the total (penetration can actually result in simply the maximum die value if a 1 is subsequently rolled, since any fool knows that 1-1=0). This process continues indefinitely as long as the die in question continues to come up maximum (but there's always only a –1 subtracted from the extra die, even if it's, say, the third die of penetration)`\n\nYou can mark exploding dice to penetrate by using `!p` instead of `!`.\n\n`/roll liczba_kości:2d6!p=5`: Roll two d6 and explode and penetrate on any roll equal to five.",
      inline: false,
    },
  ],
  unique: [
    {
      name: "Unique Dice",
      value:
        "Re-rolls duplicate dice values, ensuring all dice in the roll have unique values.\n\n`/roll liczba_kości:8d6u`: Roll eight d6 and reroll any duplicates.\n`/roll liczba_kości:8d6u=5`: Roll eight d6 and reroll only duplicates that equal 5.",
      inline: false,
    },
  ],
  reroll: [
    {
      name: "Re-roll",
      value:
        "Rerolls a die that rolls the lowest possible number on that die, until a number greater than the minimum is rolled.\n\n`/roll liczba_kości:1d6r`: Roll 1d6 and reroll on one.\n`/roll liczba_kości:4d6r<=3`: Roll 4d6 and reroll on any result less than or equal to three.",
      inline: false,
    },
  ],
  keepdrop: [
    {
      name: "Keep/Drop AKA Advantage",
      value:
        "Disregard or keep all dice above or below a certain threshold.\n\n`/roll liczba_kości:4d6k2`: Roll 4d6 and keep the highest two rolls.\n`/roll liczba_kości:4d6kl2`: Roll 4d6 and keep the lowest two rolls.\n`/roll liczba_kości:4d6d1`: Roll 4d6 and disregard the lowest roll.\n`/roll liczba_kości:4d6dh1`: Roll 4d6 and disregard the highest roll.",
      inline: false,
    },
  ],
  target: [
    {
      name: "Target success/failure AKA Dice pool",
      value:
        "Counts the number of dice that meet a criterion.\n\n`/roll liczba_kości:2d6=6`: Roll 2d6 and count the number of dice that equal six.\n`/roll liczba_kości:6d6<=4`: Roll 6d6 and count the number of dice that are less than or equal to four.",
      inline: false,
    },
  ],
  crit: [
    {
      name: "Critical success/failure",
      value:
        "This is an aesthetic feature that makes it super clear when a die has rolled the highest or lowest possible value. It makes no difference to the roll or its value.\n\n`/roll liczba_kości:1d6cs=6`: Roll 1d6 and highlight if result is 6.\n`/roll liczba_kości:5d6cs>=5`: Roll 5d6 and highlight if result is greater than 5.\n`/roll liczba_kości:1d6cf=1`: Roll 1d6 and highlight result is 1.",
      inline: false,
    },
  ],
  sort: [
    {
      name: "Sorting",
      value:
        "Sorts the results of any of your rolls in ascending or descending numerical order.\n\n`/roll liczba_kości:4d6`: Roll 4d6 and do not sort.\n`/roll liczba_kości:4d6s`: Roll 4d6 and sort results in ascending order.\n`/roll liczba_kości:4d6sa`: Same as above.\n`/roll liczba_kości:4d6sd`: Roll 4d6 and sort results in descending order.",
      inline: false,
    },
  ],
  math: [
    {
      name: "Math",
      value:
        "You can use add, subtract, multiply, divide, reduce, and parenthesis in most places inside dice notation. You can also use the following JS math functions: `abs, ceil, cos, exp, floor, log, max, min, pow, round, sign, sin, sqrt, tan`\n\n`/roll liczba_kości:1d6*5`: Roll a d6 and multiply the result by 5.\n`/roll liczba_kości:2d6/3`: Roll 2d6 and divide the total by 3.\n`/roll liczba_kości:(4-2)d6`: Subtract 2 from 4 and then roll a d6 that many times.\n`/roll liczba_kości:sqrt(4d6)`: Roll 4d6 and calculate the square root.",
      inline: false,
    },
  ],
  repeating: [
    {
      name: "Repeating rolls",
      value:
        "You can repeat any roll by entering the notation multiple times.\n\n`/roll liczba_kości:3d6`: Roll 3d6 once.\n`/roll liczba_kości:3d6 3d6 3d6`: Roll 3d6 three times.",
      inline: false,
    },
  ],
  fudge: [
    {
      name: "Fudge Dice",
      value:
        "Fudge dice (also called Fate dice) have 6 faces: 2 plus (+), 2 minus (-), and 2 blank (0). Each + adds 1, each - subtracts 1, and blanks are 0.\n\n`/roll notation:4dF`: Roll 4 fudge dice (standard for Fate/Fudge systems).\n`/roll notation:4dF+2`: Roll 4 fudge dice and add 2 to the result.",
      inline: false,
    },
    {
      name: "Reading Results",
      value:
        "Results range from -4 to +4 when rolling 4dF.\n\nExample: [+, -, 0, +] = +1 total\nExample: [-, -, +, 0] = -1 total",
      inline: false,
    },
  ],
};

const generateAndSendEmbed = async (
  content: KnowledgeBase[keyof KnowledgeBase],
  color: ColorResolvable,
  title: string,
  interaction?: CommandInteraction | ButtonInteraction
) => {
  const newEmbed = new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .addFields(content);

  const response = {
    embeds: [newEmbed],
    components: [footerButtonRow],
  };

  if (interaction) {
    if (!interaction.deferred) {
      await interaction.deferReply();
    }
    await interaction.editReply(response);
  }
};

const command = {
  name: "knowledgebase",
  description: "Browse the knowledge base",
  aliases: ["kb"],
  usage: "[topic]",
  async execute({
    args,
    interaction,
  }: CommandProps) {
    if (!args.length || !kb[args[0]]) {
      await generateAndSendEmbed(
        [
          {
            name: "Available topics",
            value: `Type \`/knowledgebase <topic>\` to learn more\n\n\`${Object.keys(kb).join("\n")}\``,
            inline: false,
          },
        ],
        infoColor,
        "👩‍🎓 Knowledge base",
        interaction
      );
      return;
    }

    const article = kb[args[0]];
    await generateAndSendEmbed(
      article,
      infoColor,
      "👩‍🎓 Knowledge base",
      interaction
    );
  },
};

export default command;
