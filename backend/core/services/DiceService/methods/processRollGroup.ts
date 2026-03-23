import { Die, DiceFaces } from "../../../../shared/types";
import { DiceService } from "..";
import chroma from "chroma-js";

const PUMPKIN_COLOR_PAIRS = [
  ['#3B1A08', '#D2691E'], // dark espresso + chocolate
  ['#6B3A2A', '#F4A460'], // dark brown + sandy caramel
  ['#8B4513', '#DEB887'], // sienna + burlywood
  ['#4A2010', '#CD853F'], // deep brown + peru
  ['#2C1503', '#A0522D'], // almost black + sienna
];

const randomPumpkinPair = () => {
  const pair = PUMPKIN_COLOR_PAIRS[Math.floor(Math.random() * PUMPKIN_COLOR_PAIRS.length)];
  return { color: chroma(pair[0]), secondary: chroma(pair[1]) };
};

export function processRollGroup(
  this: DiceService,
  rollGroup: any,
  sides: number | string
): Die[] {
  if (!rollGroup || !rollGroup.rolls) {
    return [];
  }

  if (sides === 'F') {
    return rollGroup.rolls.map((currentRoll: any) => {
      if (!currentRoll) return null;

      const { color, secondary: secondaryColor } = randomPumpkinPair();
      const textColor = this.getTextColorFromColors(color, secondaryColor);
      const icon = this.generateIconArray(currentRoll.modifiers);
      const iconSpacing = this.getIconSpacing(icon);

      let value: number;
      const initialValue = currentRoll.initialValue;
      if (initialValue === '+' || initialValue === 1) value = 1;
      else if (initialValue === '-' || initialValue === -1) value = -1;
      else value = 0;

      return {
        sides: "F" as const,
        rolled: value as DiceFaces,
        icon,
        iconSpacing,
        color,
        secondaryColor,
        textColor,
        value,
      };
    }).filter(Boolean);
  }

  if (sides === undefined) {
    return rollGroup.rolls.map((currentRoll: any) => {
      if (!currentRoll) return null;

      const { color, secondary: secondaryColor } = randomPumpkinPair();
      const textColor = this.getTextColorFromColors(color, secondaryColor);
      const initialValue = 
        typeof currentRoll.initialValue === 'number' ? currentRoll.initialValue :
        typeof currentRoll.initialValue === 'string' ? parseInt(currentRoll.initialValue, 10) || 0 : 
        0;
        
      return {
        sides: 6,
        rolled: initialValue as DiceFaces,
        icon: null,
        iconSpacing: 0,
        color,
        secondaryColor,
        textColor,
        value: initialValue,
      };
    }).filter(Boolean);
  }

  if (sides === 100) {
    return rollGroup.rolls.reduce((acc: Die[], cur: any) => {
      if (!cur) return acc;

      const { color, secondary: secondaryColor } = randomPumpkinPair();
      const textColor = this.getTextColorFromColors(color, secondaryColor);
      const icon = this.generateIconArray(cur.modifiers);

      const initialValue = typeof cur.initialValue === 'string' ? parseInt(cur.initialValue, 10) : (cur.initialValue || 0);

      acc.push(
        {
          sides: "%",
          rolled: this.getDPercentRolled(initialValue) as DiceFaces,
          icon,
          iconSpacing: 0.89,
          color,
          secondaryColor,
          textColor,
          value: Number(initialValue),
        },
        {
          sides: 10,
          rolled: this.getD10PercentRolled(initialValue) as DiceFaces,
          color,
          secondaryColor,
          textColor,
          value: Number(initialValue),
        }
      );
      return acc;
    }, []);
  } else {
    return rollGroup.rolls.map((currentRoll: any) => {
      if (!currentRoll) return null;

      const { color, secondary: secondaryColor } = randomPumpkinPair();
      const textColor = this.getTextColorFromColors(color, secondaryColor);
      const icon = this.generateIconArray(currentRoll.modifiers);
      const iconSpacing = this.getIconSpacing(icon);

      const initialValue = currentRoll.initialValue || 0;

      return {
        sides,
        rolled: initialValue,
        icon,
        iconSpacing,
        color,
        secondaryColor,
        textColor,
        value: initialValue,
      };
    }).filter(Boolean);
  }
}