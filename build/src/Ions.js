"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IONS = exports.getIon = void 0;
const Elements_1 = require("./Elements");
function getIon(ionString) {
    const ion = exports.IONS[ionString];
    if (typeof ion === "undefined")
        return exports.IONS[ION_MAP[ionString]];
    return ion;
}
exports.getIon = getIon;
exports.IONS = {
    0: {
        atomicMass: 0,
        name: "Sulfate",
        symbol: "SO4",
        parts: [
            [(0, Elements_1.getElement)("Sulfur"), 1],
            [(0, Elements_1.getElement)("Oxygen"), 4],
        ],
        charge: -2,
        type: "ion",
    },
};
const ION_MAP = {
    SULFATE: 0,
    SO4: 0,
};
