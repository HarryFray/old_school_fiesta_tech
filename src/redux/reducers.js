import { createSlice } from "@reduxjs/toolkit";

export const snackBarSlice = createSlice({
  name: "snackBar",
  initialState: {
    open: false,
    message: "",
    status: "success",
  },
  reducers: {
    openSnackBar: (state, action) => {
      return { ...state, ...action?.payload, open: true };
    },
    closeSnackBar: (state) => {
      return { ...state, open: false };
    },
  },
});

export const { openSnackBar, closeSnackBar } = snackBarSlice.actions;

export default snackBarSlice.reducer;
