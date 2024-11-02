import axios from "../../../utils/axios";
import { createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../../store";
import ApiService from "@/services/apiService";
const API_URL = "/admin/v1/admins";

const initialState = {
  admins: null,
  admin: {},
  adminSearch: "",
  perPage: 20,
  page: 1,
  pageCount: 0,
};

// @ts-ignore
export const AdminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    getAdmins: (state, action) => {
      state.admins = action.payload;
    },
    getPageCount: (state, action) => {
      state.pageCount = action.payload.total;
    },
    addAdmin: async (state, action) => {
      const response = await ApiService(
        "post",
        "/admin/v1/admins",
        action.payload,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      window.location.href = "/admins";
      console.log(action.payload);
    },
    getAdmin: async (state, action) => {
      const response = await ApiService(
        "get",
        "/admin/v1/admins/" + action.payload,
        action.payload,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      state.admin = response.data;
    },
    updateAdmin: async (state, action) => {
      const response = await ApiService(
        "put",
        "/admin/v1/admins/" + action.payload.id,
        action.payload,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      window.location.href = "/admins";
      console.log(action.payload);
    },
    DeleteAdmin: async (state, action) => {
      try {
        const response = await ApiService(
          "delete",
          "/admin/v1/admins/" + action.payload,
          null,
          {
            Authorization: "Bearer " + localStorage.getItem("token"),
          }
        );
        window.location.href = "/admins";
      } catch (e) {
        console.log(e);
      }
    },
  },
});

export const {
  getAdmins,
  getPageCount,
  DeleteAdmin,
  addAdmin,
  updateAdmin,
  getAdmin,
} = AdminSlice.actions;

export const fetchAdmins =
  (
    page: number,
    rowsPerPage: number,
    status: number | null,
    roleId: number | null,
    search: string
  ) =>
  async (dispatch: AppDispatch) => {
    try {
      let appUrl = `${API_URL}` + "?page=" + page + "&per_page=" + rowsPerPage;
      if (search) appUrl = appUrl + "&keyword=" + search;
      if (status === 1 || status === 0) appUrl = appUrl + "&status=" + status;
      if (roleId > 0) appUrl = appUrl + "&role_ids=" + roleId;
      const response = await ApiService("get", appUrl, null, {
        Authorization: "Bearer " + localStorage.getItem("token"),
      });
      dispatch(getAdmins(response.data));
      dispatch(getPageCount(response.meta));
    } catch (err: any) {
      throw new Error(err);
    }
  };

export default AdminSlice.reducer;
