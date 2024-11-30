import axios from "../../../utils/axios";
import { createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../../store";
import ApiService from "@/services/apiService";
const API_URL = "/admin/v1/event-requests";

const initialState = {
  eventRequests: null,
  eventRequest: {},
  eventRequestSearch: "",
  perPage: 20,
  page: 1,
  pageCount: 0,
};

// @ts-ignore
export const EventRequestSlice = createSlice({
  name: "page",
  initialState,
  reducers: {
    getEventRequests: (state, action) => {
      state.eventRequests = action.payload;
    },
    getEventRequestCount: (state, action) => {
      state.pageCount = action.payload.total;
    },
    addEventRequest: async (state, action) => {
      const response = await ApiService(
        "post",
        "/admin/v1/event-requests",
        action.payload,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      window.location.href = "/event-request";
      console.log(action.payload);
    },
    getEventRequest: async (state, action) => {
      const response = await ApiService(
        "get",
        "/admin/v1/event-requests/" + action.payload,
        action.payload,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      state.eventRequest = response.data;
    },
    updateEventRequest: async (state, action) => {
      const response = await ApiService(
        "put",
        "/admin/v1/event-requests/" + action.payload.id,
        action.payload,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      window.location.href = "/event-request";
      console.log(action.payload);
    },
    DeleteEventRequest: async (state, action) => {
      try {
        const response = await ApiService(
          "delete",
          "/admin/v1/event-requests/" + action.payload,
          null,
          {
            Authorization: "Bearer " + localStorage.getItem("token"),
          }
        );
        window.location.href = "/event-request";
      } catch (e) {
        console.log(e);
      }
    },
  },
});

export const {
  getEventRequests,
  getEventRequestCount,
  DeleteEventRequest,
  addEventRequest,
  updateEventRequest,
  getEventRequest,
} = EventRequestSlice.actions;

export const fetchEventRequests =
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
      dispatch(getEventRequests(response.data));
      dispatch(getEventRequestCount(response.meta));
    } catch (err: any) {
      throw new Error(err);
    }
  };

export default EventRequestSlice.reducer;
