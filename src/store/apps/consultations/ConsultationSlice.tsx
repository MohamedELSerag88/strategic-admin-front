import axios from "../../../utils/axios";
import { createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../../store";
import ApiService from "@/services/apiService";
const API_URL = "/admin/v1/consultations";

const initialState = {
  consultations: null,
  consultation: {},
  consultationSearch: "",
  perPage: 20,
  page: 1,
  pageCount: 0,
};

// @ts-ignore
export const ConsultationSlice = createSlice({
  name: "page",
  initialState,
  reducers: {
    getConsultations: (state, action) => {
      state.consultations = action.payload;
    },
    getConsultationCount: (state, action) => {
      state.pageCount = action.payload.total;
    },
    addConsultation: async (state, action) => {
      const response = await ApiService(
        "post",
        "/admin/v1/consultations",
        action.payload,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      window.location.href = "/consultations";
      console.log(action.payload);
    },
    getConsultation: async (state, action) => {
      const response = await ApiService(
        "get",
        "/admin/v1/consultations/" + action.payload,
        action.payload,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      state.consultation = response.data;
    },
    updateConsultation: async (state, action) => {
      const response = await ApiService(
        "put",
        "/admin/v1/consultations/" + action.payload.id,
        action.payload,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      window.location.href = "/consultations";
      console.log(action.payload);
    },
    DeleteConsultation: async (state, action) => {
      try {
        const response = await ApiService(
          "delete",
          "/admin/v1/consultations/" + action.payload,
          null,
          {
            Authorization: "Bearer " + localStorage.getItem("token"),
          }
        );
        window.location.href = "/consultations";
      } catch (e) {
        console.log(e);
      }
    },
  },
});

export const {
  getConsultations,
  getConsultationCount,
  DeleteConsultation,
  addConsultation,
  updateConsultation,
  getConsultation,
} = ConsultationSlice.actions;

export const fetchConsultations =
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
      dispatch(getConsultations(response.data));
      dispatch(getConsultationCount(response.meta));
    } catch (err: any) {
      throw new Error(err);
    }
  };

export default ConsultationSlice.reducer;
