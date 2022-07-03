import { Cell } from "../../../features/cells/models/cell";
import { requests } from "./base";

export const Cells = {
  getAll: () => requests.get<Cell[]>("/cells"),
  saveAll: (cells: Cell[]) => requests.post<void>("/cells", { cells }),
};
