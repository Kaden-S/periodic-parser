"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Elements_1 = require("../src/Elements");
const ions = [
    ["Ammonium", 1, [Elements_1.ELEMENTS.NITROGEN, 1], [Elements_1.ELEMENTS.HYDROGEN, 4]],
    [
        "Acetate",
        -1,
        [Elements_1.ELEMENTS.CARBON, 2],
        [Elements_1.ELEMENTS.HYDROGEN, 3],
        [Elements_1.ELEMENTS.OXYGEN, 2],
    ],
    ["Carbonate", -2, [Elements_1.ELEMENTS.CARBON, 1], [Elements_1.ELEMENTS.OXYGEN, 3]],
    [
        "Hydrogen carbonate",
        -1,
        [Elements_1.ELEMENTS.HYDROGEN, 1],
        [Elements_1.ELEMENTS.CARBON, 1],
        [Elements_1.ELEMENTS.OXYGEN, 3],
    ],
    ["Hydroxide", -1, [Elements_1.ELEMENTS.OXYGEN, 1], [Elements_1.ELEMENTS.HYDROGEN, 1]],
    ["Nitrate", -1, [Elements_1.ELEMENTS.NITROGEN, 1], [Elements_1.ELEMENTS.OXYGEN, 3]],
    ["Nitrite", -1, [Elements_1.ELEMENTS.NITROGEN, 1], [Elements_1.ELEMENTS.OXYGEN, 2]],
    ["Chromate", -2, [Elements_1.ELEMENTS.CHROMIUM, 1], [Elements_1.ELEMENTS.OXYGEN, 4]],
    ["Dichromate", -2, [Elements_1.ELEMENTS.CHROMIUM, 2], [Elements_1.ELEMENTS.OXYGEN, 7]],
    ["Phosphate", -3, [Elements_1.ELEMENTS.PHOSPHORUS, 1], [Elements_1.ELEMENTS.OXYGEN, 4]],
    ["Phosphite", -3, [Elements_1.ELEMENTS.PHOSPHORUS, 1], [Elements_1.ELEMENTS.OXYGEN, 3]],
    [
        "Hydrogen phosphate",
        -2,
        [Elements_1.ELEMENTS.HYDROGEN, 1],
        [Elements_1.ELEMENTS.PHOSPHORUS, 1],
        [Elements_1.ELEMENTS.OXYGEN, 4],
    ],
    ["Hypochlorite", -1, [Elements_1.ELEMENTS.CHLORINE, 1], [Elements_1.ELEMENTS.OXYGEN, 1]],
    ["Chlorite", -1, [Elements_1.ELEMENTS.CHLORINE, 1], [Elements_1.ELEMENTS.OXYGEN, 2]],
    ["Chlorate", -1, [Elements_1.ELEMENTS.CHLORINE, 1], [Elements_1.ELEMENTS.OXYGEN, 3]],
    ["Perchlorate", -1, [Elements_1.ELEMENTS.CHLORINE, 1], [Elements_1.ELEMENTS.OXYGEN, 4]],
    ["Sulfate", -2, [Elements_1.ELEMENTS.SULFUR, 1], [Elements_1.ELEMENTS.OXYGEN, 4]],
    ["Sulfite", -2, [Elements_1.ELEMENTS.SULFUR, 1], [Elements_1.ELEMENTS.OXYGEN, 3]],
    [
        "Hydrogen sulfate",
        -1,
        [Elements_1.ELEMENTS.HYDROGEN, 1],
        [Elements_1.ELEMENTS.SULFUR, 1],
        [Elements_1.ELEMENTS.OXYGEN, 4],
    ],
    [
        "Hydrogen sulfite",
        -1,
        [Elements_1.ELEMENTS.HYDROGEN, 1],
        [Elements_1.ELEMENTS.SULFUR, 1],
        [Elements_1.ELEMENTS.OXYGEN, 3],
    ],
    ["Permanganate", -1, [Elements_1.ELEMENTS.MANGANESE, 1], [Elements_1.ELEMENTS.OXYGEN, 4]],
    ["Cyanide", -1, [Elements_1.ELEMENTS.CARBON, 1], [Elements_1.ELEMENTS.NITROGEN, 1]],
    ["Bromate", -1, [Elements_1.ELEMENTS.BROMINE, 1], [Elements_1.ELEMENTS.OXYGEN, 3]],
    ["Borate", -3, [Elements_1.ELEMENTS.BORON, 1], [Elements_1.ELEMENTS.OXYGEN, 3]],
    [
        "Hydrogen borate",
        -2,
        [Elements_1.ELEMENTS.HYDROGEN, 1],
        [Elements_1.ELEMENTS.BORON, 1],
        [Elements_1.ELEMENTS.OXYGEN, 3],
    ],
    [
        "Dihydrogen phosphate",
        -2,
        [Elements_1.ELEMENTS.HYDROGEN, 2],
        [Elements_1.ELEMENTS.PHOSPHORUS, 1],
        [Elements_1.ELEMENTS.OXYGEN, 4],
    ],
    ["Hydrogen sulfide", -1, [Elements_1.ELEMENTS.SULFUR, 1], [Elements_1.ELEMENTS.HYDROGEN, 1]],
    ["Iodate", -1, [Elements_1.ELEMENTS.IODINE, 1], [Elements_1.ELEMENTS.OXYGEN, 3]],
    ["Silicate", -2, [Elements_1.ELEMENTS.SILICON, 1], [Elements_1.ELEMENTS.OXYGEN, 3]],
]
    .filter(([name], i, arr) => arr.findIndex(([name1]) => name == name1) === i)
    .sort(([a], [b]) => a.localeCompare(b));
console.log(`interface Ion {}
const ELEMENTS: any = {};
`);
console.log(`export type Ions = {${ions.reduce((prev, [name]) => prev + "\n  " + getElement(name) + ": Ion;", "")}
}`);
console.log(`
export const IONS: Ions = {${ions.reduce((prev, [ionName, charge, ...parts]) => prev +
    `\n  ${getElement(ionName)}: {
    atomicMass: ${parts
        .reduce((p, [{ name }, n]) => p +
        `ELEMENTS.${getElement(name)}.atomicMass${n > 1 ? ` * ${n}` : ""} + `, "")
        .slice(0, -3)},
    name: "${ionName}",
    symbol: "${getSymbol(...parts)}",
    parts: [${parts.reduce((p, [{ name }, n]) => p + `\n      [ELEMENTS.${getElement(name)}, ${n}],`, "")}
    ],
    charge: ${charge},
    type: "ion",
  },`, "")}
};
`);
console.log(`const ION_MAP: { [key: string]: keyof Ions } = {
  ${ions.reduce((prev, [name, charge, ...parts], i, arr) => {
    prev += `${i}: "${getElement(name)}",\n  `;
    prev += `${getSymbol(...parts)}: "${getElement(name)}",\n  `;
    if (/^Hydrogen /i.test(name)) {
        prev += `${name.replace(/^Hydrogen /i, "Bi")}: "${getElement(name)}",\n  `;
    }
    return prev;
}, 'CH3COO: "ACETATE"')}
};`);
function getSymbol(...parts) {
    return parts.reduce((p, [e, n]) => p + e.symbol + (n > 1 ? n : ""), "");
}
function getElement(s) {
    return s.toUpperCase().trim().replace(/\s/, "_");
}
