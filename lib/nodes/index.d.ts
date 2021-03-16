import { Selection, EnterElement } from "d3-selection";
import { Schema, Node, ReadonlyCanvasRef } from "../interfaces.js";
import { AttachPorts } from "../utils.js";
export declare const appendNodes: <S extends Schema>(ref: ReadonlyCanvasRef<S>, enter: Selection<EnterElement, Node<S, keyof S>, SVGGElement | null, unknown>, attachInputs: AttachPorts<S>, attachOutputs: AttachPorts<S>) => Selection<SVGGElement, Node<S, keyof S>, SVGGElement | null, unknown>;
