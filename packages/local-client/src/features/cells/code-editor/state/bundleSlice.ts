import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BundleResult } from "../models/bundle";
import bundle from "../services/bundler";

interface BundlesState {
  [key: string]:
    | undefined
    | {
        loading: boolean;
        result: BundleResult;
      };
}

export const createBundleAsync = createAsyncThunk<
  BundleResult,
  { cellId: string; input: string }
>("bundle/createBundleAsync", async ({ cellId, input }, thunkAPI) => {
  try {
    return await bundle(input);
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

const initialState: BundlesState = {};

export const bundleSlice = createSlice({
  name: "bundle",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createBundleAsync.pending, (state, { meta }) => {
      state[meta.arg.cellId] = {
        loading: true,
        result: {
          code: "",
          err: "",
        },
      };
    });
    builder.addCase(createBundleAsync.fulfilled, (state, { payload, meta }) => {
      state[meta.arg.cellId] = {
        loading: false,
        result: {
          code: payload.code,
          err: payload.err,
        },
      };
    });
  },
});
