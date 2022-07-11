import { configureStore } from "@reduxjs/toolkit";

import snackBarReducer from "./reducers";

export default configureStore({
  reducer: {
    snackBar: snackBarReducer,
  },
});
