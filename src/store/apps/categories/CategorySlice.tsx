import axios from "../../../utils/axios";
import { createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../../store";
import ApiService from "@/services/apiService";
const API_URL = "/admin/v1/categories";

const initialState = {
  categories: null,
  category: {},
  categorySearch: "",
  perPage: 20,
  page: 1,
  pageCount: 0,
};

// @ts-ignore
export const CategorySlice = createSlice({
  name: "page",
  initialState,
  reducers: {
    getCategories: (state, action) => {
      state.categories = action.payload;
    },
    getCategoryCount: (state, action) => {
      state.pageCount = action.payload.total;
    },
    addCategory: async (state, action) => {
      const response = await ApiService(
        "post",
        "/admin/v1/categories",
        action.payload,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      window.location.href = "/categories";
      console.log(action.payload);
    },
    getCategory: async (state, action) => {
      const response = await ApiService(
        "get",
        "/admin/v1/categories/" + action.payload,
        action.payload,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      state.category = response.data;
    },
    updateCategory: async (state, action) => {
      const response = await ApiService(
        "put",
        "/admin/v1/categories/" + action.payload.id,
        action.payload,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      window.location.href = "/categories";
      console.log(action.payload);
    },
    DeleteCategory: async (state, action) => {
      try {
        const response = await ApiService(
          "delete",
          "/admin/v1/categories/" + action.payload,
          null,
          {
            Authorization: "Bearer " + localStorage.getItem("token"),
          }
        );
        window.location.href = "/categories";
      } catch (e) {
        console.log(e);
      }
    },
  },
});

export const {
  getCategories,
  getCategoryCount,
  DeleteCategory,
  addCategory,
  updateCategory,
  getCategory,
} = CategorySlice.actions;

export const fetchCategories =
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
      dispatch(getCategories(response.data));
      dispatch(getCategoryCount(response.meta));
    } catch (err: any) {
      throw new Error(err);
    }
  };

export default CategorySlice.reducer;
