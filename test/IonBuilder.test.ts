import { ELEMENTS } from "../src/Elements";
import type { Element } from "./Element";

const ions = [
  ["Ammonium", 1, [ELEMENTS.NITROGEN, 1], [ELEMENTS.HYDROGEN, 4]],
  [
    "Acetate",
    -1,
    [ELEMENTS.CARBON, 2],
    [ELEMENTS.HYDROGEN, 3],
    [ELEMENTS.OXYGEN, 2],
  ],
  ["Carbonate", -2, [ELEMENTS.CARBON, 1], [ELEMENTS.OXYGEN, 3]],
  [
    "Hydrogen carbonate",
    -1,
    [ELEMENTS.HYDROGEN, 1],
    [ELEMENTS.CARBON, 1],
    [ELEMENTS.OXYGEN, 3],
  ],
  ["Hydroxide", -1, [ELEMENTS.OXYGEN, 1], [ELEMENTS.HYDROGEN, 1]],
  ["Nitrate", -1, [ELEMENTS.NITROGEN, 1], [ELEMENTS.OXYGEN, 3]],
  ["Nitrite", -1, [ELEMENTS.NITROGEN, 1], [ELEMENTS.OXYGEN, 2]],
  ["Chromate", -2, [ELEMENTS.CHROMIUM, 1], [ELEMENTS.OXYGEN, 4]],
  ["Dichromate", -2, [ELEMENTS.CHROMIUM, 2], [ELEMENTS.OXYGEN, 7]],
  ["Phosphate", -3, [ELEMENTS.PHOSPHORUS, 1], [ELEMENTS.OXYGEN, 4]],
  ["Phosphite", -3, [ELEMENTS.PHOSPHORUS, 1], [ELEMENTS.OXYGEN, 3]],
  [
    "Hydrogen phosphate",
    -2,
    [ELEMENTS.HYDROGEN, 1],
    [ELEMENTS.PHOSPHORUS, 1],
    [ELEMENTS.OXYGEN, 4],
  ],
  ["Hypochlorite", -1, [ELEMENTS.CHLORINE, 1], [ELEMENTS.OXYGEN, 1]],
  ["Chlorite", -1, [ELEMENTS.CHLORINE, 1], [ELEMENTS.OXYGEN, 2]],
  ["Chlorate", -1, [ELEMENTS.CHLORINE, 1], [ELEMENTS.OXYGEN, 3]],
  ["Perchlorate", -1, [ELEMENTS.CHLORINE, 1], [ELEMENTS.OXYGEN, 4]],
  ["Sulfate", -2, [ELEMENTS.SULFUR, 1], [ELEMENTS.OXYGEN, 4]],
  ["Sulfite", -2, [ELEMENTS.SULFUR, 1], [ELEMENTS.OXYGEN, 3]],
  [
    "Hydrogen sulfate",
    -1,
    [ELEMENTS.HYDROGEN, 1],
    [ELEMENTS.SULFUR, 1],
    [ELEMENTS.OXYGEN, 4],
  ],
  [
    "Hydrogen sulfite",
    -1,
    [ELEMENTS.HYDROGEN, 1],
    [ELEMENTS.SULFUR, 1],
    [ELEMENTS.OXYGEN, 3],
  ],
  ["Permanganate", -1, [ELEMENTS.MANGANESE, 1], [ELEMENTS.OXYGEN, 4]],
  ["Cyanide", -1, [ELEMENTS.CARBON, 1], [ELEMENTS.NITROGEN, 1]],
  ["Bromate", -1, [ELEMENTS.BROMINE, 1], [ELEMENTS.OXYGEN, 3]],
  ["Borate", -3, [ELEMENTS.BORON, 1], [ELEMENTS.OXYGEN, 3]],
  [
    "Hydrogen borate",
    -2,
    [ELEMENTS.HYDROGEN, 1],
    [ELEMENTS.BORON, 1],
    [ELEMENTS.OXYGEN, 3],
  ],
  [
    "Dihydrogen phosphate",
    -2,
    [ELEMENTS.HYDROGEN, 2],
    [ELEMENTS.PHOSPHORUS, 1],
    [ELEMENTS.OXYGEN, 4],
  ],
  ["Hydrogen sulfide", -1, [ELEMENTS.SULFUR, 1], [ELEMENTS.HYDROGEN, 1]],
  ["Iodate", -1, [ELEMENTS.IODINE, 1], [ELEMENTS.OXYGEN, 3]],
  ["Silicate", -2, [ELEMENTS.SILICON, 1], [ELEMENTS.OXYGEN, 3]],
]
  .filter(([name], i, arr) => arr.findIndex(([name1]) => name == name1) === i)
  .sort(([a], [b]) => (a as string).localeCompare(b as string)) as [
  string,
  number,
  ...[Element, number][]
][];

console.log(`interface Ion {}
const ELEMENTS: any = {};
`);

console.log(`export type Ions = {${ions.reduce(
  (prev, [name]) => prev + "\n  " + getElement(name) + ": Ion;",
  ""
)}
}`);

console.log(`
export const IONS: Ions = {${ions.reduce(
  (prev, [ionName, charge, ...parts]) =>
    prev +
    `\n  ${getElement(ionName)}: {
    atomicMass: ${parts
      .reduce(
        (p, [{ name }, n]) =>
          p +
          `ELEMENTS.${getElement(name)}.atomicMass${n > 1 ? ` * ${n}` : ""} + `,
        ""
      )
      .slice(0, -3)},
    name: "${ionName}",
    symbol: "${getSymbol(...parts)}",
    parts: [${parts.reduce(
      (p, [{ name }, n]) => p + `\n      [ELEMENTS.${getElement(name)}, ${n}],`,
      ""
    )}
    ],
    charge: ${charge},
    type: "ion",
  },`,
  ""
)}
};
`);

console.log(
  `const ION_MAP: { [key: string]: keyof Ions } = {
  ${ions.reduce((prev, [name, charge, ...parts], i, arr) => {
    prev += `${i}: "${getElement(name)}",\n  `;
    prev += `${getSymbol(...parts)}: "${getElement(name)}",\n  `;
    if (/^Hydrogen /i.test(name)) {
      prev += `${name.replace(/^Hydrogen /i, "Bi")}: "${getElement(
        name
      )}",\n  `;
    }

    return prev;
  }, 'CH3COO: "ACETATE"')}
};`
);

function getSymbol(...parts: [Element, number][]): string {
  return parts.reduce((p, [e, n]) => p + e.symbol + (n > 1 ? n : ""), "");
}

function getElement(s: string): string {
  return s.toUpperCase().trim().replace(/\s/, "_");
}
