import { Ion } from "./Element";
export declare type IonString = keyof typeof IONS | keyof typeof ION_MAP;
export declare function getIon(ionString: IonString): Ion;
export declare const IONS: {
    [index: number]: Ion;
};
declare const ION_MAP: {
    [key: string]: number;
};
export {};
