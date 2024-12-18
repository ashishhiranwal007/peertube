import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./reducers/userSlice.js";
import videoUploadReducer from "./reducers/videoUploadSlice.js";

const rootReducer = combineReducers({
  user: userReducer,
  video: videoUploadReducer
});

// Redux Persist configuration
const persistConfig = {
  key: "project-y1",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
