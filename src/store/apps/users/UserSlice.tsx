import axios from "../../../utils/axios";
import { createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../../store";
import ApiService from "@/services/apiService";
const API_URL = "/admin/v1/users";

const initialState = {
  users: null,
  user: {},
  userSearch: "",
  perPage: 20,
  page: 1,
  pageCount: 0,
};

export const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    getUsers: (state, action) => {
      state.users = action.payload;
    },
    getPageCount: (state, action) => {
      state.pageCount = action.payload.total;
    },
    addUser: async (state, action) => {
      const response = await ApiService(
        "post",
        "/admin/v1/users",
        action.payload,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      window.location.href = "/users";
      console.log(action.payload);
    },
    getUser: async (state, action) => {
      const response = await ApiService(
        "get",
        "/admin/v1/users/" + action.payload,
        action.payload,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      state.user = response.data;
    },
    updateUser: async (state, action) => {
      const response = await ApiService(
        "put",
        "/admin/v1/users/" + action.payload.id,
        action.payload,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      window.location.href = "/users";
      console.log(action.payload);
    },
    DeleteUser: async (state, action) => {
      try {
        const response = await ApiService(
          "delete",
          "/admin/v1/users/" + action.payload,
          null,
          {
            Authorization: "Bearer " + localStorage.getItem("token"),
          }
        );
        window.location.href = "/users";
      } catch (e) {
        console.log(e);
      }
    },
  },
});

export const {
  getUsers,
  getPageCount,
  DeleteUser,
  addUser,
  updateUser,
  getUser,
} = UserSlice.actions;

export const fetchUsers =
  (
    page: number,
    rowsPerPage: number,
    status: number | null,
    clientId: number | null,
    search: string
  ) =>
  async (dispatch: AppDispatch) => {
    try {
      let appUrl = `${API_URL}` + "?page=" + page + "&per_page=" + rowsPerPage;
      if (search) appUrl = appUrl + "&keyword=" + search;
      if (status === 1 || status === 0) appUrl = appUrl + "&status=" + status;
      if (clientId > 0) appUrl = appUrl + "&client_id=" + clientId;
      const response = await ApiService("get", appUrl, null, {
        Authorization: "Bearer " + localStorage.getItem("token"),
      });
      dispatch(getUsers(response.data));
      dispatch(getPageCount(response.meta));
    } catch (err: any) {
      throw new Error(err);
    }
  };

export default UserSlice.reducer;
