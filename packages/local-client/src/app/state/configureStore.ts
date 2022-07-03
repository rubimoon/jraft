import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { bundleSlice } from "../../features/cells/code-editor/state/bundleSlice";
import { cellsSlice } from "../../features/cells/state/cellsSlice";

export const store = configureStore({
  reducer: {
    cells: cellsSlice.reducer,
    bundles: bundleSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
