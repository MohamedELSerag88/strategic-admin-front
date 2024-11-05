import axios from "../../../utils/axios";
import { createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../../store";
import ApiService from "@/services/apiService";
const API_URL = "/admin/v1/experts";

const initialState = {
  experts: null,
  expert: {},
  expertSearch: "",
  perPage: 20,
  page: 1,
  pageCount: 0,
};

// @ts-ignore
export const ExpertSlice = createSlice({
  name: "page",
  initialState,
  reducers: {
    getExperts: (state, action) => {
      state.experts = action.payload;
    },
    getExpertCount: (state, action) => {
      state.pageCount = action.payload.total;
    },
    addExpert: async (state, action) => {
      const response = await ApiService(
        "post",
        "/admin/v1/experts",
        action.payload,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      window.location.href = "/experts";
      console.log(action.payload);
    },
    getExpert: async (state, action) => {
      const response = await ApiService(
        "get",
        "/admin/v1/experts/" + action.payload,
        action.payload,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      state.expert = response.data;
    },
    updateExpert: async (state, action) => {
      const response = await ApiService(
        "put",
        "/admin/v1/experts/" + action.payload.id,
        action.payload,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      window.location.href = "/experts";
      console.log(action.payload);
    },
    DeleteExpert: async (state, action) => {
      try {
        const response = await ApiService(
          "delete",
          "/admin/v1/experts/" + action.payload,
          null,
          {
            Authorization: "Bearer " + localStorage.getItem("token"),
          }
        );
        window.location.href = "/experts";
      } catch (e) {
        console.log(e);
      }
    },
  },
});

export const {
  getExperts,
  getExpertCount,
  DeleteExpert,
  addExpert,
  updateExpert,
  getExpert,
} = ExpertSlice.actions;

export const fetchExperts =
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
      dispatch(getExperts(response.data));
      dispatch(getExpertCount(response.meta));
    } catch (err: any) {
      throw new Error(err);
    }
  };

export default ExpertSlice.reducer;
