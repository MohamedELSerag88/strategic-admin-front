import axios from "../../../utils/axios";
import { createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../../store";
import ApiService from "@/services/apiService";
const API_URL = "/admin/v1/news";

const initialState = {
  news: null,
  newsItem: {},
  newsSearch: "",
  perPage: 20,
  page: 1,
  pageCount: 0,
};

// @ts-ignore
export const NewsSlice = createSlice({
  name: "page",
  initialState,
  reducers: {
    getNews: (state, action) => {
      state.news = action.payload;
    },
    getNewsCount: (state, action) => {
      state.pageCount = action.payload.total;
    },
    addNews: async (state, action) => {
      const response = await ApiService(
        "post",
        "/admin/v1/news",
        action.payload,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      window.location.href = "/news";
      console.log(action.payload);
    },
    getNewsItem: async (state, action) => {
      const response = await ApiService(
        "get",
        "/admin/v1/news/" + action.payload,
        action.payload,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      state.newsItem = response.data;
    },
    updateNews: async (state, action) => {
      const response = await ApiService(
        "put",
        "/admin/v1/news/" + action.payload.id,
        action.payload,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      window.location.href = "/news";
      console.log(action.payload);
    },
    DeleteNews: async (state, action) => {
      try {
        const response = await ApiService(
          "delete",
          "/admin/v1/news/" + action.payload,
          null,
          {
            Authorization: "Bearer " + localStorage.getItem("token"),
          }
        );
        window.location.href = "/news";
      } catch (e) {
        console.log(e);
      }
    },
  },
});

export const {
  getNews,
  getNewsCount,
  DeleteNews,
  addNews,
  updateNews,
  getNewItem,
} = NewsSlice.actions;

export const fetchNews =
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
      dispatch(getNews(response.data));
      dispatch(getNewsCount(response.meta));
    } catch (err: any) {
      throw new Error(err);
    }
  };

export default NewsSlice.reducer;
