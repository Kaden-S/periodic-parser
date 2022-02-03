"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Compound_1 = require("../src/Compound");
const compounds = [
    new Compound_1.Compound("NaCl2"),
    new Compound_1.Compound("MgI3"),
    new Compound_1.Compound("LiBr"),
    new Compound_1.Compound("Ca2S"),
    new Compound_1.Compound("KF"),
    new Compound_1.Compound("CaSO4"),
    new Compound_1.Compound("Calcium Chloride"),
    new Compound_1.Compound("Potassium carbide"),
    new Compound_1.Compound("Aluminum Sulfate"),
    new Compound_1.Compound("Al2(SO4)3"),
    new Compound_1.Compound("NH4Cl"),
    new Compound_1.Compound("(NH4)2S"),
];
function assert(expected, actual) {
    const condition = expected === actual;
    console.assert(condition, expected + " !== " + actual);
    if (!condition)
        throw new Error();
    console.log(" ", expected, "\u001b[32;1mtest passed\u001b[0m");
}
console.log("Symbol tests: ");
try {
    assert("NaCl", compounds[0].symbol);
    assert("MgI2", compounds[1].symbol);
    assert("LiBr", compounds[2].symbol);
    assert("CaS", compounds[3].symbol);
    assert("KF", compounds[4].symbol);
    assert("CaSO4", compounds[5].symbol);
    assert("CaCl2", compounds[6].symbol);
    assert("K4C", compounds[7].symbol);
    assert("Al2(SO4)3", compounds[8].symbol);
    assert("Al2(SO4)3", compounds[9].symbol);
    assert("NH4Cl", compounds[10].symbol);
    assert("(NH4)2S", compounds[11].symbol);
    console.log("Symbol tests \u001b[32;1msucceeded!\u001b[0m\n");
}
catch (error) {
    console.error("Symbol tests \u001b[31mfailed!\u001b[0m\n" +
        ((error === null || error === void 0 ? void 0 : error.message) ? error.stack : ""));
}
console.log("Name tests: ");
try {
    assert("Sodium chloride", compounds[0].name);
    assert("Magnesium iodide", compounds[1].name);
    assert("Lithium bromide", compounds[2].name);
    assert("Calcium sulfide", compounds[3].name);
    assert("Potassium fluoride", compounds[4].name);
    assert("Calcium sulfate", compounds[5].name);
    assert("Calcium chloride", compounds[6].name);
    assert("Potassium carbide", compounds[7].name);
    assert("Aluminum sulfate", compounds[8].name);
    assert("Aluminum sulfate", compounds[9].name);
    assert("Ammonium chloride", compounds[10].name);
    assert("Ammonium sulfide", compounds[11].name);
    console.log("Name tests \u001b[32;1msucceeded!\u001b[0m\n");
}
catch (error) {
    console.error("\u001b[31mName tests failed!\u001b[0m\n" +
        ((error === null || error === void 0 ? void 0 : error.message) ? error.stack : ""));
}
console.log("Transition Metal Name tests: ");
try {
    assert("Iron(II) chloride", new Compound_1.Compound("Iron chloride").name);
    assert("Copper(I) iodide", new Compound_1.Compound("Copper iodide").name);
    assert("Titanium(III) bromide", new Compound_1.Compound("Titanium bromide").name);
    assert("Manganese(III) sulfide", new Compound_1.Compound("Manganese sulfide").name);
    assert("Silver fluoride", new Compound_1.Compound("Silver fluoride").name);
    assert("Zinc sulfate", new Compound_1.Compound("Zinc sulfate").name);
    console.log();
    assert("Iron(II) chloride", new Compound_1.Compound("Iron(II) chloride").name);
    assert("Copper(I) iodide", new Compound_1.Compound("Copper(I) iodide").name);
    assert("Titanium(III) bromide", new Compound_1.Compound("Titanium(III) bromide").name);
    assert("Manganese(VI) sulfide", new Compound_1.Compound("Manganese(VI) sulfide").name);
    try {
        assert("Silver fluoride", new Compound_1.Compound("Silver(I) fluoride").name);
        assert("Zinc sulfate", new Compound_1.Compound("Zinc(I) sulfate").name);
        throw new Error("Should've failed");
    }
    catch (error) {
        if (error.message == "Should've failed")
            throw new Error();
        console.log(" ", "Silver fluoride", "\u001b[32;1mtest passed\u001b[0m");
        console.log(" ", "Zinc sulfate", "\u001b[32;1mtest passed\u001b[0m");
    }
    console.log();
    assert("Iron(III) chloride", new Compound_1.Compound("Iron(III) chloride").name);
    assert("Copper(II) iodide", new Compound_1.Compound("Copper(II) iodide").name);
    assert("Titanium(IV) bromide", new Compound_1.Compound("Titanium(IV) bromide").name);
    assert("Manganese(VII) sulfide", new Compound_1.Compound("Manganese(VII) sulfide").name);
    try {
        assert("Silver fluoride", new Compound_1.Compound("Silver(II) fluoride").name);
        assert("Zinc sulfate", new Compound_1.Compound("Zinc(II) sulfate").name);
        throw new Error("Should've failed");
    }
    catch (error) {
        if (error.message == "Should've failed")
            throw new Error();
        console.log(" ", "Silver fluoride", "\u001b[32;1mtest passed\u001b[0m");
        console.log(" ", "Zinc sulfate", "\u001b[32;1mtest passed\u001b[0m");
    }
    console.log("Transition Metal Name tests \u001b[32;1msucceeded!\u001b[0m\n");
}
catch (error) {
    console.error("Transition Metal Name tests \u001b[31mfailed!\u001b[0m\n" +
        ((error === null || error === void 0 ? void 0 : error.message) ? error.stack : ""));
}
console.log("Transition Metal Symbol tests: ");
try {
    assert("FeCl2", new Compound_1.Compound("Iron(II) chloride").symbol);
    assert("CuI", new Compound_1.Compound("Copper(I) iodide").symbol);
    assert("TiBr4", new Compound_1.Compound("Titanium(IV) bromide").symbol);
    assert("Mn2S7", new Compound_1.Compound("Manganese(VII) sulfide").symbol);
    assert("AgF", new Compound_1.Compound("Silver fluoride").symbol);
    assert("ZnSO4", new Compound_1.Compound("Zinc sulfate").symbol);
    try {
        assert("CuI5", new Compound_1.Compound("Copper(V) iodide").symbol);
        throw new Error("Didn't fail");
    }
    catch (error) {
        if (error.message === "Didn't fail")
            throw new Error();
        console.log(" ", "CuI5", "\u001b[32;1mtest passed\u001b[0m");
    }
    console.log("Transition Metal Symbol tests \u001b[32;1msucceeded!\u001b[0m\n");
}
catch (error) {
    console.error("Transition Metal Symbol tests \u001b[31mfailed!\u001b[0m\n" +
        ((error === null || error === void 0 ? void 0 : error.message) ? error.stack : ""));
}
console.log("Named Compound Symbol tests: ");
try {
    assert("NH3", new Compound_1.Compound("Ammonia").symbol);
    assert("H2O", new Compound_1.Compound("Water").symbol);
    assert("H2SO4", new Compound_1.Compound("Sulfuric Acid").symbol);
    assert("HCl", new Compound_1.Compound("Hydrochloric Acid").symbol);
    console.log("Named Compound Symbol tests \u001b[32;1msucceeded!\u001b[0m\n");
}
catch (error) {
    console.error("Named Compound Symbol tests \u001b[31mfailed!\u001b[0m\n" +
        ((error === null || error === void 0 ? void 0 : error.message) ? error.stack : ""));
}
