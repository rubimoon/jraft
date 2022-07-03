export type CellTypes = "code" | "text";

export type InsertDirections = "up" | "down";

export interface Cell {
  id: string;
  type: CellTypes;
  content: string;
}
