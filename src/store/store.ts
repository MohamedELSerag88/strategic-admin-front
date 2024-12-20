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
import CategoryReducer from "./apps/categories/CategorySlice";
import ExpertReducer from "./apps/experts/ExpertSlice";
import ConsultationReducer from "./apps/consultations/ConsultationSlice";
import EventReducer from "./apps/events/EventSlice";
import NewsReducer from "./apps/news/NewsSlice";
import StudyReducer from "./apps/studies/StudySlice";
import MeasurementReducer from "./apps/measurements/MeasurementSlice";
import ForumReducer from "./apps/forums/ForumSlice";
import MemberShipReducer from "./apps/memberships/MemberShipSlice";
import ConsultationRequestReducer from "./apps/consultationRequests/ConsultationRequestSlice";
import EventRequestReducer from "./apps/eventRequests/EventRequestSlice";

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
    userReducer: UserReducer,
    categoryReducer: CategoryReducer,
    expertReducer: ExpertReducer,
    consultationReducer: ConsultationReducer,
    eventReducer: EventReducer,
    newsReducer: NewsReducer,
    studyReducer: StudyReducer,
    measurementReducer: MeasurementReducer,
    membershipReducer: MemberShipReducer,
    forumReducer: ForumReducer,
    consultationRequestReducer: ConsultationRequestReducer,
    eventRequestReducer: EventRequestReducer

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
  pageReducer: PageReducer,
  categoryReducer: CategoryReducer,
  expertReducer: ExpertReducer,
  consultationReducer: ConsultationReducer,
  eventReducer: EventReducer,
  newsReducer: NewsReducer,
  studyReducer: StudyReducer,
  measurementReducer: MeasurementReducer,
  membershipReducer: MemberShipReducer,
  forumReducer: ForumReducer,
  consultationRequestReducer: ConsultationRequestReducer,
  eventRequestReducer: EventRequestReducer
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<typeof rootReducer>;
