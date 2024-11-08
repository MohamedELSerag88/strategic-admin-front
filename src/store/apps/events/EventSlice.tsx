import axios from "../../../utils/axios";
import { createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../../store";
import ApiService from "@/services/apiService";
const API_URL = "/admin/v1/events";

const initialState = {
  events: null,
  event: {},
  eventSearch: "",
  perPage: 20,
  page: 1,
  pageCount: 0,
};

// @ts-ignore
export const EventSlice = createSlice({
  name: "page",
  initialState,
  reducers: {
    getEvents: (state, action) => {
      state.events = action.payload;
    },
    getEventCount: (state, action) => {
      state.pageCount = action.payload.total;
    },
    addEvent: async (state, action) => {
      const response = await ApiService(
        "post",
        "/admin/v1/events",
        action.payload,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      window.location.href = "/events";
      console.log(action.payload);
    },
    getEvent: async (state, action) => {
      const response = await ApiService(
        "get",
        "/admin/v1/events/" + action.payload,
        action.payload,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      state.event = response.data;
    },
    updateEvent: async (state, action) => {
      const response = await ApiService(
        "put",
        "/admin/v1/events/" + action.payload.id,
        action.payload,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      window.location.href = "/events";
      console.log(action.payload);
    },
    DeleteEvent: async (state, action) => {
      try {
        const response = await ApiService(
          "delete",
          "/admin/v1/events/" + action.payload,
          null,
          {
            Authorization: "Bearer " + localStorage.getItem("token"),
          }
        );
        window.location.href = "/events";
      } catch (e) {
        console.log(e);
      }
    },
  },
});

export const {
  getEvents,
  getEventCount,
  DeleteEvent,
  addEvent,
  updateEvent,
  getEvent,
} = EventSlice.actions;

export const fetchEvents =
  (
    page: number,
    rowsPerPage: number,
    search: string
  ) =>
  async (dispatch: AppDispatch) => {
    try {
      let appUrl = `${API_URL}` + "?page=" + page + "&per_page=" + rowsPerPage;
      if (search) appUrl = appUrl + "&keyword=" + search;

      const response = await ApiService("get", appUrl, null, {
        Authorization: "Bearer " + localStorage.getItem("token"),
      });
      dispatch(getEvents(response.data));
      dispatch(getEventCount(response.meta));
    } catch (err: any) {
      throw new Error(err);
    }
  };

export default EventSlice.reducer;
