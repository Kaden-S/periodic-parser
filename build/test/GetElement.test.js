"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Elements_1 = require("../src/Elements");
const Compound_1 = require("../src/Compound");
const [_, __, ...elements] = process.argv;
switch (elements.length) {
    case 0:
        console.log("No compound specified");
        break;
    case 1:
        try {
            console.log((0, Elements_1.getElement)(elements[0]));
        }
        catch (error) {
            console.log(new Compound_1.Compound(elements[0]));
        }
        break;
    default:
        console.log(new Compound_1.Compound(elements.join(" ")));
        break;
}
