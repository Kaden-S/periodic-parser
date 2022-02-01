import type { Element, Ion } from "./Element";
export interface Compound {
    name: string;
    type: "molecular" | "ionic";
    atomicMass: number;
    symbol: string;
    parts: [Element | Ion, number][];
}
export declare class Compound {
    constructor(compoundName: string);
}
