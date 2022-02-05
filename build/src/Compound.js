"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Compound = void 0;
const Elements_1 = require("./Elements");
const numMap = {
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
    "actinoid",
    "lanthanoid",
    "metal",
    "ion",
];
class Compound {
    constructor(compoundName) {
        try {
            return (0, Elements_1.getCompound)(compoundName);
        }
        catch (err) { }
        const parts = (compoundName.match(/(\(.*?\)\d*)|([A-z]{3,} ?\([IiVvXx]+\))|([A-Z][a-z]*\d*)|([A-z]{3,})/g) || [])
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
            const [_, symbol, n] = (el.match(/^([A-z]*)(\d*)$|^\((.*)\)(\d+)$|^([A-z]{3,} ?\([IiVvXx]+\))$/) || []).filter((el) => el);
            if (!symbol)
                throw new Error("Invalid compound: " + compoundName);
            return [symbol, Number(n) || 1];
        });
        if (!parts || parts.length < 2)
            throw new Error("Invalid compound: " + compoundName);
        const s = parts[0][0];
        const S = parts[0][0].toUpperCase();
        const s1 = parts[1][0];
        const n = parts[0][1];
        const n1 = parts[1][1];
        if (s === "H" ||
            S === "HYDROGEN" ||
            isAmmonium(s, s1, n, n1) ||
            S === "AMMONIUM" ||
            isCharged(s) ||
            METAL_TYPES.includes((0, Elements_1.getElement)(parts[0][0].replace(/ ?\([IiVvXx]+\)/, "")).type)) {
            return new IonicCompound(parts);
        }
        return new MolecularCompound(parts);
    }
}
exports.Compound = Compound;
class BaseCompound {
    constructor(parts) {
        this.parts = parts;
        this.name = "";
        this.atomicMass = this.parts.reduce((prev, [s, n]) => prev + s.atomicMass * n, 0);
        this.symbol = this.parts.reduce((prev, [el, n]) => prev +
            ((0, Elements_1.isIon)(el) && n > 1 ? "(" + el.symbol + ")" : el.symbol) +
            (n > 1 ? n : ""), "");
    }
    toString() {
        return JSON.stringify(this, (key, value) => {
            if (key === "parts") {
                value = value.map(([el, n]) => `${n} ${el.name}`);
            }
            return value;
        }, 2);
    }
}
class MolecularCompound extends BaseCompound {
    constructor(parts) {
        // TODO: parse mono, di, tri, etc.
        super(parts.map(([s, n]) => [(0, Elements_1.getElement)(s), n]));
        this.type = "molecular";
        this.name = molecularify(this.parts);
    }
}
class IonicCompound extends BaseCompound {
    constructor(parts) {
        super(balanceIonicCompound(ensureIonic(parts)));
        this.type = "ionic";
        this.cation = this.parts[0][0];
        this.anion = this.parts[1][0];
        const cationName = this.cation.name +
            (!(0, Elements_1.isIon)(this.cation) && isTransitionMetal(this.cation)
                ? "(" +
                    NUMERAL[Math.abs(this.parts[0][0].charge ||
                        this.parts[1][0].charge * this.parts[1][1] ||
                        this.parts[1][1])] +
                    ")"
                : "");
        const anionName = (0, Elements_1.isIon)(this.anion)
            ? this.anion.name
            : ionify(this.anion.name);
        this.name = cationName + " " + anionName.toLowerCase();
    }
    toString() {
        return JSON.stringify(this, (key, value) => {
            switch (key) {
                case "parts":
                    value = value.map(([el, n]) => `${n} ${el.name}`);
                    break;
                case "anion":
                case "cation":
                    value = value.name;
                default:
                    break;
            }
            return value;
        }, 2);
    }
}
function ensureIonic(parts) {
    // [["Al", 2], ["SO4", 3]] -> [[Aluminum, 2], [Sulfate, 3]]
    // [["H", 2], ["S", 1], ["O", 4]] -> [[Hydrogen, 2], [Sulfate, 1]]
    if (parts.length === 2)
        return parts.map(([s, n]) => [getIonicElement(s), n]);
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
        if (offset + 1 !== parts.length)
            n1 = 1;
    }
    const ion = (0, Elements_1.getElement)(symbol);
    const ion1 = (0, Elements_1.getElement)(symbol1);
    if (!ion)
        throw new Error("Invalid Ion: " + symbol1);
    if (!ion1)
        throw new Error("Invalid Ion: " + symbol1);
    return [
        [ion, n],
        [ion1, n1],
    ];
}
function balanceIonicCompound(parts) {
    const cation = parts[0][0];
    const anion = parts[1][0];
    const [reducedCationCharge, reducedAnionCharge] = reduceCharge(Math.abs(parts[0][1]), Math.abs(parts[1][1]));
    const cationCharge = getIonicCharge(cation, reducedCationCharge);
    const anionCharge = getIonicCharge(anion, reducedAnionCharge);
    const [cationAmt, anionAmt] = balance([
        [cation.name, cationCharge],
        [anion.name, anionCharge],
    ]);
    return [
        [cation, cationAmt],
        [anion, anionAmt],
    ];
}
function balance(parts, tryAgain = true) {
    const [[cation, cationCharge], [anion, anionCharge]] = parts;
    const cationChargeAbs = Math.abs(cationCharge);
    const anionChargeAbs = Math.abs(anionCharge);
    const sum = cationCharge + anionCharge;
    if (sum > Math.max(cationCharge, anionCharge) ||
        sum < Math.min(cationCharge, anionCharge)) {
        if (!tryAgain || (cationChargeAbs !== 4 && anionChargeAbs !== 4))
            throw new Error(`Unbalanceable Ionic Compound: ${cation} ${cationCharge} and ${anion} ${anionCharge}`);
        if (cationChargeAbs === 4) {
            return balance([
                [cation, cationCharge === 4 ? -4 : 4],
                [anion, anionCharge],
            ], false);
        }
        else {
            return balance([
                [cation, cationCharge],
                [anion, anionCharge === 4 ? -4 : 4],
            ], false);
        }
    }
    if (sum === 0)
        return [1, 1];
    return reduceCharge(cationChargeAbs, anionChargeAbs);
}
function getIonicCharge(el, suggested) {
    if ("charge" in el)
        return el.charge;
    // Group 1 or 2 (+1, +2)
    if (el.group <= 2)
        return el.group;
    // Group 13+ (+3, +-4, -3, -2, -1)
    if (el.group > 12) {
        // Group 15+ (-3, -2, -1)
        if (el.group > 14)
            return el.group - 18;
        // Group 13-14 (+3, +-4)
        return el.group - 10;
    }
    // Group 3-12 (Transition metals)
    const states = el.commonOxidationStates;
    if (states.length === 1)
        return states[0];
    if (suggested && states.includes(suggested))
        return suggested;
    return states.at(-2);
}
const vowels = ["a", "e", "i", "o", "u", "y"];
function ionify(name) {
    name = name.toUpperCase();
    const anion = Elements_1.REVERSED_ANION_MAP[name];
    if (anion)
        return anion.toLowerCase();
    const [f, ...rest] = [...name];
    let matches = 0;
    while (matches !== 2) {
        if (vowels.includes(rest.pop() || "a"))
            ++matches;
    }
    return f + rest.join("").toLowerCase() + "ide";
}
function molecularify(elements) {
    var _a;
    let compound = "";
    for (let x = 0; x < elements.length; x++) {
        const el = elements[x];
        const name = el[0].name.toLowerCase();
        const [f, ...prefix] = [...((_a = numMap[el[1]]) !== null && _a !== void 0 ? _a : "")];
        if (vowels.includes(name[0]))
            prefix.pop();
        if (x === 0) {
            const p = f.toUpperCase() + prefix.join("");
            compound += (p === "Mono" ? "" : p) + name;
            continue;
        }
        compound += " " + f + prefix.join("") + ionify(name);
    }
    return compound;
}
function isAmmonium(symbol, symbol1, n, n1) {
    return symbol === "N" && symbol1 === "H" && n === 1 && n1 === 4;
}
function isCharged(element) {
    return /([A-z]{3,}) ?\(([IiVvXx]+)\)/.test(element);
}
function getIonicElement(symbol) {
    let c;
    if (isCharged(symbol)) {
        const [_, name, __, charge] = symbol.match(/([A-z]{3,}) ?(\(([IiVvXx]+)\))?/) || [];
        if (name === symbol.replace(/ ?\([IiVvXx]+\)/, "")) {
            c = REVERSED_NUMERALS[charge.toUpperCase()];
        }
        symbol = name;
    }
    const element = (0, Elements_1.getElement)(symbol);
    if (typeof c === "number") {
        if (!isTransitionMetal(element)) {
            throw new Error(element.name +
                " only has one charge (+" +
                element.commonOxidationStates[0] +
                ")");
        }
        if (!element.oxidationStates.includes(c))
            throw new Error("Oxidation state is invalid " + symbol + "(" + NUMERAL[c] + ")");
        if (!element.commonOxidationStates.includes(c))
            // TODO: Make this an actual warning somehow
            console.warn("Uncommon oxidation state used " + symbol + "(" + NUMERAL[c] + ")");
        element.charge = c;
    }
    return element;
}
function isTransitionMetal(e) {
    const isElement = "commonOxidationStates" in e;
    if (!isElement)
        return false;
    return ((e.period > 4 || (e.group > 2 && e.group < 13)) &&
        e.commonOxidationStates.length > 1);
}
function reduceCharge(cationChargeAbs, anionChargeAbs) {
    const remainder = anionChargeAbs % cationChargeAbs;
    const remainder1 = cationChargeAbs % anionChargeAbs;
    if (remainder === 0 && remainder1 === 0)
        return [1, 1];
    if (remainder === 0) {
        return [anionChargeAbs / remainder1, cationChargeAbs / remainder1];
    }
    else if (remainder1 === 0) {
        return [anionChargeAbs / remainder, cationChargeAbs / remainder];
    }
    return [anionChargeAbs, cationChargeAbs];
}
