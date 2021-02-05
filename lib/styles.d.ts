import React from "react";
import { Schema, Values } from "./interfaces.js";
export declare const defaultBlockHeaderStyle: React.CSSProperties;
export declare type getBlockHeaderStyle = <K extends string, V extends Values<K>>(block: Schema<K, V>[K]) => React.CSSProperties;
interface StyleContext {
    getBlockHeaderStyle: getBlockHeaderStyle;
}
export declare const defaultStyleContext: StyleContext;
export declare const StyleContext: React.Context<StyleContext>;
export {};