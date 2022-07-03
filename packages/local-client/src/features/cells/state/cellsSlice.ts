import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { agent } from "../../../app/api/agent";
import { RootState } from "../../../app/state/configureStore";
import { delay, generateId } from "../../../app/utils";
import { Cell, CellTypes, InsertDirections } from "../models/cell";

export interface CellsState {
  loading: boolean;
  error: string | null;
  order: string[];
  data: {
    [key: string]: Cell;
  };
}

const initialState: CellsState = {
  loading: false,
  error: null,
  order: [],
  data: {},
};

export const fetchCellsAsync = createAsyncThunk<Cell[]>(
  "cells/fetchCellsAsync",
  async (_, thunkAPI) => {
    try {
      return await agent.Cells.getAll();
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const saveCellsAsync = createAsyncThunk<void>(
  "cells/saveCellsAsync",
  async (_, thunkAPI) => {
    const { data, order } = (thunkAPI.getState() as RootState).cells;
    const cells = order.map((id) => data[id]);
    try {
      return await agent.Cells.saveAll(cells);
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

const save = async (dispatch: any) => {
  await delay(250);
  dispatch(saveCellsAsync());
};

export const updateCellAsync = createAsyncThunk<
  void,
  { id: string; content: string }
>(
  "cells/updateCellAsync",
  async (_, thunkAPI) => await save(thunkAPI.dispatch)
);

export const deleteCellAsync = createAsyncThunk<void, { id: string }>(
  "cells/deleteCellAsync",
  async (_, thunkAPI) => await save(thunkAPI.dispatch)
);

export const insertCellAfterAsync = createAsyncThunk<
  void,
  { previousCellId?: string; cellType: CellTypes }
>(
  "cells/insertCellAfterAsync",
  async (_, thunkAPI) => await save(thunkAPI.dispatch)
);

export const moveCellAsync = createAsyncThunk<
  void,
  { id: string; direction: InsertDirections }
>("cells/moveCellAsync", async (_, thunkAPI) => await save(thunkAPI.dispatch));

export const cellsSlice = createSlice({
  name: "cells",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCellsAsync.pending, (state, action) => {
      state.loading = true;
      //   state.error = null;
    });
    builder.addCase(fetchCellsAsync.fulfilled, (state, action) => {
      state.loading = false;
      state.order = Object.values(action.payload).map((cell) => cell.id);
      state.data = Object.values(action.payload).reduce((acc, cell) => {
        acc[cell.id] = cell;
        return acc;
      }, {} as CellsState["data"]);
    });
    builder.addCase(fetchCellsAsync.rejected, (state, action) => {
      state.loading = false;
      //   state.error = action.payload.error.message;
    });
    builder.addCase(updateCellAsync.pending, (state, action) => {
      const { id, content } = action.meta.arg;
      state.data[id].content = content;
    });
    builder.addCase(deleteCellAsync.pending, (state, action) => {
      delete state.data[action.meta.arg.id];
      state.order = state.order.filter((id) => id !== action.meta.arg.id);
    });

    builder.addCase(moveCellAsync.pending, (state, action) => {
      const { direction } = action.meta.arg;
      const index = state.order.findIndex((id) => id === action.meta.arg.id);
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex > state.order.length - 1) return;
      state.order[index] = state.order[targetIndex];
      state.order[targetIndex] = action.meta.arg.id;
    });
    builder.addCase(insertCellAfterAsync.pending, (state, action) => {
      const cell: Cell = {
        id: generateId(),
        type: action.meta.arg.cellType,
        content: "",
      };
      state.data[cell.id] = cell;
      const foundIndex = state.order.findIndex(
        (id) => id === action.meta.arg.previousCellId
      );
      if (foundIndex < 0) {
        state.order.unshift(cell.id);
      } else {
        state.order.splice(foundIndex + 1, 0, cell.id);
      }
    });
  },
});
