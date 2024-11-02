import axios from "../../../utils/axios";
import { createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../../store";
import ApiService from "@/services/apiService";
const API_URL = "/admin/v1/roles";

const initialState = {
  roles: null,
  role: {},
  roleSearch: "",
  perPage: 20,
  page: 1,
  pageCount: 0,
};

export const RoleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    getRoles: (state, action) => {
      state.roles = action.payload;
    },
    getPageCount: (state, action) => {
      state.pageCount = action.payload.total;
    },
    addRole: async (state, action) => {
      const response = await ApiService(
        "post",
        "/admin/v1/roles",
        action.payload,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      window.location.href = "/roles";
    },
    getRole: async (state, action) => {
      const response = await ApiService(
        "get",
        "/admin/v1/roles/" + action.payload,
        action.payload,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      state.role = response.data;
    },
    updateRole: async (state, action) => {
      const response = await ApiService(
        "put",
        "/admin/v1/roles/" + action.payload.id,
        action.payload,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      window.location.href = "/roles";
    },
    DeleteRole: async (state, action) => {
      try {
        const response = await ApiService(
          "delete",
          "/admin/v1/roles/" + action.payload,
          null,
          {
            Authorization: "Bearer " + localStorage.getItem("token"),
          }
        );
        window.location.href = "/roles";
      } catch (e) {
        console.log(e);
      }
    },
  },
});

export const {
  getRoles,
  getPageCount,
  DeleteRole,
  addRole,
  updateRole,
  getRole,
} = RoleSlice.actions;

export const fetchRoles =
  (page: number, rowsPerPage: number, status: number | null, search: string) =>
  async (dispatch: AppDispatch) => {
    try {
      let appUrl = `${API_URL}` + "?page=" + page + "&per_page=" + rowsPerPage;
      if (search) appUrl = appUrl + "&keyword=" + search;
      if (status === 1 || status === 0) appUrl = appUrl + "&status=" + status;
      const response = await ApiService("get", appUrl, null, {
        Authorization: "Bearer " + localStorage.getItem("token"),
      });
      dispatch(getRoles(response.data));
      dispatch(getPageCount(response.meta));
    } catch (err: any) {
      throw new Error(err);
    }
  };

export default RoleSlice.reducer;
