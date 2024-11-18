import axios from "../../../utils/axios";
import { createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../../store";
import ApiService from "@/services/apiService";
const API_URL = "/admin/v1/discussion_forums";

const initialState = {
  forums: null,
  forum: {},
  forumSearch: "",
  perPage: 20,
  page: 1,
  pageCount: 0,
};

// @ts-ignore
export const ForumSlice = createSlice({
  name: "page",
  initialState,
  reducers: {
    getForums: (state, action) => {
      state.forums = action.payload;
    },
    getForumCount: (state, action) => {
      state.pageCount = action.payload.total;
    },
    addForum: async (state, action) => {
      const response = await ApiService(
        "post",
        "/admin/v1/discussion_forums",
        action.payload,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      window.location.href = "/forums";
      console.log(action.payload);
    },
    getForum: async (state, action) => {
      const response = await ApiService(
        "get",
        "/admin/v1/discussion_forums/" + action.payload,
        action.payload,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      state.forum = response.data;
    },
    updateForum: async (state, action) => {
      const response = await ApiService(
        "put",
        "/admin/v1/discussion_forums/" + action.payload.id,
        action.payload,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      window.location.href = "/forums";
      console.log(action.payload);
    },
    DeleteForum: async (state, action) => {
      try {
        const response = await ApiService(
          "delete",
          "/admin/v1/discussion_forums/" + action.payload,
          null,
          {
            Authorization: "Bearer " + localStorage.getItem("token"),
          }
        );
        window.location.href = "/forums";
      } catch (e) {
        console.log(e);
      }
    },
  },
});

export const {
  getForums,
  getForumCount,
  DeleteForum,
  addForum,
  updateForum,
  getForum,
} = ForumSlice.actions;

export const fetchForums =
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
      dispatch(getForums(response.data));
      dispatch(getForumCount(response.meta));
    } catch (err: any) {
      throw new Error(err);
    }
  };

export default ForumSlice.reducer;
