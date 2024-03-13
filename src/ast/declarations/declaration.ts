import { Node } from "../node";

export type Program = Declaration[];

// Abstrat base for all top-level declrations
export abstract class Declaration extends Node {}
