import { getElement } from "../src/Elements";
import { Compound } from "../src/Compound";

const [_, __, ...elements] = process.argv;

switch (elements.length) {
  case 0:
    console.log("No compound specified");
    break;
  case 1:
    try {
      console.log(getElement(elements[0]));
    } catch (error) {
      console.log(new Compound(elements[0]));
    }
    break;
  default:
    console.log(new Compound(elements.join(" ")));
    break;
}
