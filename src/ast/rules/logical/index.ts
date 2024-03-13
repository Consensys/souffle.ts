import { Node } from "../../node";
import { Atom } from "../atom";
import { Constraint } from "../constraints";
import { Disjunction } from "./disjunction";

export type Term = Atom | Constraint | Disjunction;

export abstract class Logical extends Node {}

export * from "./conjunction";
export * from "./disjunction";
export * from "./negation";
