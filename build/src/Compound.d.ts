import type { Element, Ion } from "./types";
export interface Compound {
    name: string;
    type: "molecular" | "ionic";
    atomicMass: number;
    symbol: string;
    parts: [Element | Ion, number][];
    toString(): string;
}
export declare class Compound {
    constructor(compoundName: string);
}
