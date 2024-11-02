import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import counterReducer from "./counter/counterSlice";
import CustomizerReducer from "./customizer/CustomizerSlice";
import AdminReducer from "./apps/admins/AdminSlice";
import RoleReducer from "./apps/roles/RoleSlice";
import UserReducer from "./apps/users/UserSlice";
import PageReducer from "./apps/pages/PageSlice";

const persistConfig = {
  key: "root",
  storage,
};

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    customizer: persistReducer<any>(persistConfig, CustomizerReducer),
    adminReducer: AdminReducer,
    roleReducer: RoleReducer,
    pageReducer: PageReducer,
    userReducer: UserReducer

  },
  devTools: process.env.NODE_ENV !== "develop",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false, immutableCheck: false }),
});

const rootReducer = combineReducers({
  counter: counterReducer,
  customizer: CustomizerReducer,
  adminReducer: AdminReducer,
  roleReducer: RoleReducer,
  userReducer: UserReducer,
  pageReducer: PageReducer
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<typeof rootReducer>;
