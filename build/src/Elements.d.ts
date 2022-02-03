import type { Element, Ion, Elements, Ions, Compounds, AnionMap, AtomicNumberMap, ReversedAnionMap, SymbolMap, Compound } from "./types";
export declare type ElementString = keyof Elements | keyof typeof ELEMENT_MAP;
export declare type IonString = keyof Ions | keyof typeof ION_MAP;
export declare type CompoundString = keyof Compounds | keyof typeof COMPOUND_MAP;
export declare function isIon(el: Element | Ion): boolean;
export declare function getIon(ionString: IonString): Ion | null;
export declare function getElement(key: ElementString | IonString): Element | Ion;
export declare function getCompound(compound: CompoundString): Compound;
export declare const ELEMENTS: Elements;
export declare const ANION_MAP: AnionMap;
export declare const REVERSED_ANION_MAP: ReversedAnionMap;
export declare const SYMBOL_MAP: SymbolMap;
export declare const ATOMIC_NUMBER_MAP: AtomicNumberMap;
declare const ELEMENT_MAP: {
    [index: number | string]: keyof Elements;
};
export declare const IONS: Ions;
declare const ION_MAP: {
    [key: string | number]: keyof Ions;
};
export declare const COMPOUNDS: Compounds;
export declare const COMPOUND_MAP: {
    [key: string]: keyof Compounds;
};
export {};
