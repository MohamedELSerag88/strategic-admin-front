import axios from "../../../utils/axios";
import { createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../../store";
import ApiService from "@/services/apiService";
const API_URL = "/admin/v1/consultation-requests";

const initialState = {
  consultationRequests: null,
  consultationRequest: {},
  consultationRequestSearch: "",
  perPage: 20,
  page: 1,
  pageCount: 0,
};

// @ts-ignore
export const ConsultationRequestSlice = createSlice({
  name: "page",
  initialState,
  reducers: {
    getConsultationRequests: (state, action) => {
      state.consultationRequests = action.payload;
    },
    getConsultationRequestCount: (state, action) => {
      state.pageCount = action.payload.total;
    },
    addConsultationRequest: async (state, action) => {
      const response = await ApiService(
        "post",
        "/admin/v1/consultation-requests",
        action.payload,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      window.location.href = "/consultation-request";
      console.log(action.payload);
    },
    getConsultationRequest: async (state, action) => {
      const response = await ApiService(
        "get",
        "/admin/v1/consultation-requests/" + action.payload,
        action.payload,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      state.consultationRequest = response.data;
    },
    updateConsultationRequest: async (state, action) => {
      const response = await ApiService(
        "put",
        "/admin/v1/consultation-requests/" + action.payload.id,
        action.payload,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      window.location.href = "/consultation-request";
      console.log(action.payload);
    },
    DeleteConsultationRequest: async (state, action) => {
      try {
        const response = await ApiService(
          "delete",
          "/admin/v1/consultation-requests/" + action.payload,
          null,
          {
            Authorization: "Bearer " + localStorage.getItem("token"),
          }
        );
        window.location.href = "/consultation-request";
      } catch (e) {
        console.log(e);
      }
    },
  },
});

export const {
  getConsultationRequests,
  getConsultationRequestCount,
  DeleteConsultationRequest,
  addConsultationRequest,
  updateConsultationRequest,
  getConsultationRequest,
} = ConsultationRequestSlice.actions;

export const fetchConsultationRequests =
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
      dispatch(getConsultationRequests(response.data));
      dispatch(getConsultationRequestCount(response.meta));
    } catch (err: any) {
      throw new Error(err);
    }
  };

export default ConsultationRequestSlice.reducer;
