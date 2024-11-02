import axios from "../../../utils/axios";
import { createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../../store";
import ApiService from "@/services/apiService";
const API_URL = "/admin/v1/pages";

const initialState = {
  pages: null,
  pageItem: {},
  pageSearch: "",
  perPage: 20,
  page: 1,
  pageCount: 0,
};

// @ts-ignore
export const PageSlice = createSlice({
  name: "page",
  initialState,
  reducers: {
    getPages: (state, action) => {
      state.pages = action.payload;
    },
    getPageCount: (state, action) => {
      state.pageCount = action.payload.total;
    },
    addPage: async (state, action) => {
      const response = await ApiService(
        "post",
        "/admin/v1/pages",
        action.payload,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      window.location.href = "/pages";
      console.log(action.payload);
    },
    getPage: async (state, action) => {
      const response = await ApiService(
        "get",
        "/admin/v1/pages/" + action.payload,
        action.payload,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      state.pageItem = response.data;
    },
    updatePage: async (state, action) => {
      const response = await ApiService(
        "put",
        "/admin/v1/pages/" + action.payload.id,
        action.payload,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      window.location.href = "/pages";
      console.log(action.payload);
    },
    DeletePage: async (state, action) => {
      try {
        const response = await ApiService(
          "delete",
          "/admin/v1/pages/" + action.payload,
          null,
          {
            Authorization: "Bearer " + localStorage.getItem("token"),
          }
        );
        window.location.href = "/pages";
      } catch (e) {
        console.log(e);
      }
    },
  },
});

export const {
  getPages,
  getPageCount,
  DeletePage,
  addPage,
  updatePage,
  getPage,
} = PageSlice.actions;

export const fetchPages =
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
      dispatch(getPages(response.data));
      dispatch(getPageCount(response.meta));
    } catch (err: any) {
      throw new Error(err);
    }
  };

export default PageSlice.reducer;
