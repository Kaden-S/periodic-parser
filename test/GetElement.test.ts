import { getElement } from "../src/Elements";
import { Compound } from "../src/Compound";

const [_, __, ...elements] = process.argv;

let compound: Compound | null = null;

switch (elements.length) {
  case 0:
    console.log("No compound specified");
    break;
  case 1:
    try {
      console.log(getElement(elements[0]));
      process.exit(0);
    } catch (error) {
      compound = new Compound(elements[0]);
    }
    break;
  default:
    compound = new Compound(elements.join(" "));
    break;
}

console.log(compound?.toString());
