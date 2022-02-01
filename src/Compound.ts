import { getCompound, getElement, isIon, REVERSED_ANION_MAP } from "./Elements";
import type { Element, Ion } from "./types";

export interface Compound {
  name: string;
  type: "molecular" | "ionic";
  atomicMass: number;
  symbol: string;
  parts: [Element | Ion, number][];
}

const numMap: { [i: number]: string } = {
  1: "mono",
  2: "di",
  3: "tri",
  4: "tetra",
  5: "penta",
  6: "hexa",
  7: "hepta",
  8: "octa",
  9: "nona",
  10: "deca",
  11: "undeca",
  12: "dodeca",
  13: "trideca",
  14: "tetradeca",
  15: "pentadeca",
  16: "hexadeca",
  17: "heptadeca",
  18: "octadeca",
  19: "nonadeca",
  20: "icosa",
  21: "henicosa",
  22: "docosa",
  23: "tricosa",
  30: "triaconta",
  31: "hentriaconta",
  32: "dotriaconta",
};

const NUMERAL = {
  1: "I",
  2: "II",
  3: "III",
  4: "IV",
  5: "V",
  6: "VI",
  7: "VII",
  8: "VIII",
  9: "IX",
  10: "X",
};

const REVERSED_NUMERALS = {
  I: 1,
  II: 2,
  III: 3,
  IV: 4,
  V: 5,
  VI: 6,
  VII: 7,
  VIII: 8,
  IX: 9,
  X: 10,
};

const METAL_TYPES = [
  "alkaline-earth-metal",
  "alkali-metal",
  "post-transition-metal",
  "transition-metal",
  "metal",
  "ion",
];

export class Compound {
  constructor(compoundName: string) {
    try {
      return getCompound(compoundName);
    } catch (err) {}
    const parts: [string, number][] = (
      compoundName.match(
        /(\(.*?\)\d*)|([A-z]{3,} ?\([IiVvXx]+\))|([A-Z][a-z]*\d*)|([A-z]{3,})/g
      ) || []
    )
      .filter((el) => el)
      //
      // CaCl2             ->  ["Ca", "Cl2"]
      // Li2S              ->  ["Li2", "S"]
      // Al2(SO4)3         ->  ["Al2", "(SO4)3"]
      // H2SO4             ->  ["H2", "S", "O4"]
      // Calcium Chloride  ->  ["Calcium", "Chloride"]
      //
      .map((el) => {
        //
        // ["Al2", "(SO4)3"]        -> [["Al", 2], ["SO4", 3]]
        // ["H2", "S", "O4"]        -> [["H", 2], ["S", 1], ["O", 4]]
        // ["Iron(II)", "Chloride"] -> [["Iron(II)", 1], ["Chloride", 1]]
        //
        const [_, symbol, n] = (
          el.match(
            /^([A-z]*)(\d*)$|^\((.*)\)(\d+)$|^([A-z]{3,} ?\([IiVvXx]+\))$/
          ) || []
        ).filter((el) => el);

        if (!symbol) throw new Error("Invalid compound: " + compoundName);

        return [symbol, Number(n) || 1];
      });

    if (!parts || parts.length < 2)
      throw new Error("Invalid compound: " + compoundName);

    const s = parts[0][0];
    const S = parts[0][0].toUpperCase();
    const s1 = parts[1][0];
    const n = parts[0][1];
    const n1 = parts[1][1];
    if (
      s === "H" ||
      S === "HYDROGEN" ||
      isAmmonium(s, s1, n, n1) ||
      S === "AMMONIUM" ||
      isCharged(s) ||
      METAL_TYPES.includes(
        getElement(parts[0][0].replace(/ ?\([IiVvXx]+\)/, "")).type
      )
      // TODO: Check for hydrogen bonds here
    ) {
      return new IonicCompound(parts);
    }

    return new MolecularCompound(parts);
  }
}

class BaseCompound implements Compound {
  atomicMass: number;
  name: string = "";
  symbol: string;
  type!: "molecular" | "ionic";
  constructor(readonly parts: [Element | Ion, number][]) {
    this.atomicMass = this.parts.reduce(
      (prev, [s, n]) => prev + s.atomicMass * n,
      0
    );

    this.symbol = this.parts.reduce(
      (prev, [el, n]) =>
        prev +
        (isIon(el) && n > 1 ? "(" + el.symbol + ")" : el.symbol) +
        (n > 1 ? n : ""),
      ""
    );
  }
}

class MolecularCompound extends BaseCompound {
  readonly type = "molecular";
  readonly name: string;
  constructor(parts: [string, number][]) {
    super(parts.map(([s, n]) => [getElement(s), n]));

    this.name = molecularify(this.parts);
  }
}

class IonicCompound extends BaseCompound {
  readonly type = "ionic";
  readonly name: string;
  constructor(parts: [string, number][]) {
    super(balanceIonicCompound(ensureIonic(parts)));

    const el = this.parts[0][0];
    const el1 = this.parts[1][0];

    const name =
      el.name +
      (!isIon(el) && isTransitionMetal(el as Element)
        ? "(" + NUMERAL[this.parts[1][1] as 1] + ")"
        : "");
    const name1 = isIon(el1) ? el1.name : ionify(el1.name);

    this.name = name + " " + name1.toLowerCase();
  }
}

function ensureIonic(parts: [string, number][]): [Element | Ion, number][] {
  // [["Al", 2], ["SO4", 3]] -> [[Aluminum, 2], [Sulfate, 3]]
  // [["H", 2], ["S", 1], ["O", 4]] -> [[Hydrogen, 2], [Sulfate, 1]]
  if (parts.length === 2) return parts.map(([s, n]) => [getIonicElement(s), n]);
  let symbol = parts[0][0];
  let symbol1 = "";
  let n = parts[0][1];
  let n1 = parts[1][1];
  let offset = 1;

  if (isAmmonium(parts[0][0], parts[1][0], parts[0][1], parts[1][1])) {
    offset++;
    symbol = "NH4";
    n = 1;
  }

  for (let x = offset; x < parts.length; x++) {
    const [el, n] = parts[x];
    symbol1 += el + (n === 1 ? "" : n);
    if (offset + 1 !== parts.length) n1 = 1;
  }

  const ion = getElement(symbol);
  const ion1 = getElement(symbol1);

  if (!ion) throw new Error("Invalid Ion: " + symbol1);
  if (!ion1) throw new Error("Invalid Ion: " + symbol1);

  return [
    [ion, n],
    [ion1, n1],
  ];
}

function balanceIonicCompound(parts: [Element | Ion, number][]) {
  const el: Element | Ion = parts[0][0];
  const el1: Element | Ion = parts[1][0];

  let charge = getIonicCharge(el);
  let charge1 = getIonicCharge(el1);

  const [a, b] = balance([
    [el.name, charge],
    [el1.name, charge1],
  ]);

  parts[0][1] = a;
  parts[1][1] = b;

  return parts;
}
function balance(parts: [string, number][], tryAgain = true): [number, number] {
  const [[name, charge], [name1, charge1]] = parts;
  const abs = Math.abs(charge);
  const abs1 = Math.abs(charge1);

  const sum = charge + charge1;

  if (sum > Math.max(charge, charge1) || sum < Math.min(charge, charge1)) {
    if (!tryAgain || (abs !== 4 && abs1 !== 4))
      throw new Error(
        `Unbalanceable Ionic Compound: ${name} ${charge} and ${name1} ${charge1}`
      );
    if (abs === 4) {
      return balance(
        [
          [name, charge === 4 ? -4 : 4],
          [name1, charge1],
        ],
        false
      );
    } else {
      return balance(
        [
          [name, charge],
          [name1, charge1 === 4 ? -4 : 4],
        ],
        false
      );
    }
  }

  if (sum === 0) return [1, 1];

  return [abs1, abs];
}

function getIonicCharge(el: Element | Ion): number {
  if ("charge" in el) return el.charge;

  // Group 1 or 2 (+1, +2)
  if (el.group <= 2) return el.group;

  // Group 13+ (+3, +-4, -3, -2, -1)
  if (el.group > 12) {
    // Group 15+ (-3, -2, -1)
    if (el.group > 14) return el.group - 18;
    // Group 13-14 (+3, +-4)
    return el.group - 10;
  }

  // Group 3-12 (Transition metals)
  const states: any = el.commonOxidationStates;
  if (states.length === 1) return states[0];
  return states.at(-2);
}

const vowels = ["a", "e", "i", "o", "u", "y"];
function ionify(name: string): string {
  name = name.toUpperCase();

  const anion = REVERSED_ANION_MAP[name as "HYDROGEN"];
  if (anion) return anion.toLowerCase();

  const [f, ...rest] = [...name];

  let matches = 0;

  while (matches !== 2) {
    if (vowels.includes(rest.pop() || "a")) ++matches;
  }

  return f + rest.join("").toLowerCase() + "ide";
}

function molecularify(elements: [Element | Ion, number][]): string {
  let compound = "";

  for (let x = 0; x < elements.length; x++) {
    const el = elements[x];

    const name = el[0].name.toLowerCase();
    const [f, ...prefix] = [...(numMap[el[1]] ?? "")];

    if (vowels.includes(name[0])) prefix.pop();

    if (x === 0) {
      const p = f.toUpperCase() + prefix.join("");
      compound += (p === "Mono" ? "" : p) + name;
      continue;
    }

    compound += " " + f + prefix.join("") + ionify(name);
  }

  return compound;
}

function isAmmonium(
  symbol: string,
  symbol1: string,
  n: number,
  n1: number
): boolean {
  return symbol === "N" && symbol1 === "H" && n === 1 && n1 === 4;
}

function isCharged(element: string): boolean {
  return /([A-z]{3,}) ?\(([IiVvXx]+)\)/.test(element);
}

function getIonicElement(symbol: string): Element | Ion {
  let c;
  if (isCharged(symbol)) {
    const [_, name, __, charge] =
      symbol.match(/([A-z]{3,}) ?(\(([IiVvXx]+)\))?/) || [];

    if (name === symbol.replace(/ ?\([IiVvXx]+\)/, "")) {
      c = REVERSED_NUMERALS[charge.toUpperCase() as "I"];
    }

    symbol = name;
  }

  const element = getElement(symbol);
  if (typeof c === "number") {
    if (!isTransitionMetal(element))
      throw new Error(
        element.name +
          " only has one charge (+" +
          (element as Element).commonOxidationStates[0] +
          ")"
      );

    if (!(element as Element).oxidationStates.includes(c))
      throw new Error(
        "Oxidation state is invalid " + symbol + "(" + NUMERAL[c as 1] + ")"
      );

    if (!(element as Element).commonOxidationStates.includes(c))
      console.warn(
        "Uncommon oxidation state used " + symbol + "(" + NUMERAL[c as 1] + ")"
      );
    (element as Ion).charge = c;
  }
  return element;
}

function isTransitionMetal(e: Element | Ion): boolean {
  return (
    "commonOxidationStates" in e &&
    e.group > 2 &&
    e.group < 13 &&
    e.commonOxidationStates.length > 1
  );
}
