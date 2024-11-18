import axios from "../../../utils/axios";
import { createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../../store";
import ApiService from "@/services/apiService";
const API_URL = "/admin/v1/studies";

const initialState = {
  studies: null,
  study: {},
  studySearch: "",
  perPage: 20,
  page: 1,
  pageCount: 0,
};

// @ts-ignore
export const StudySlice = createSlice({
  name: "page",
  initialState,
  reducers: {
    getStudies: (state, action) => {
      state.studies = action.payload;
    },
    getStudyCount: (state, action) => {
      state.pageCount = action.payload.total;
    },
    addStudy: async (state, action) => {
      const response = await ApiService(
        "post",
        "/admin/v1/studies",
        action.payload,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      window.location.href = "/studies";
      console.log(action.payload);
    },
    getStudy: async (state, action) => {
      const response = await ApiService(
        "get",
        "/admin/v1/studies/" + action.payload,
        action.payload,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      state.study = response.data;
    },
    updateStudy: async (state, action) => {
      const response = await ApiService(
        "put",
        "/admin/v1/studies/" + action.payload.id,
        action.payload,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      window.location.href = "/studies";
      console.log(action.payload);
    },
    DeleteStudy: async (state, action) => {
      try {
        const response = await ApiService(
          "delete",
          "/admin/v1/studies/" + action.payload,
          null,
          {
            Authorization: "Bearer " + localStorage.getItem("token"),
          }
        );
        window.location.href = "/studies";
      } catch (e) {
        console.log(e);
      }
    },
  },
});

export const {
  getStudies,
  getStudyCount,
  DeleteStudy,
  addStudy,
  updateStudy,
  getStudy,
} = StudySlice.actions;

export const fetchStudies =
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
      dispatch(getStudies(response.data));
      dispatch(getStudyCount(response.meta));
    } catch (err: any) {
      throw new Error(err);
    }
  };

export default StudySlice.reducer;
