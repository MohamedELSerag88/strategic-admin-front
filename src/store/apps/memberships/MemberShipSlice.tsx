import axios from "../../../utils/axios";
import { createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../../store";
import ApiService from "@/services/apiService";
const API_URL = "/admin/v1/memberships";

const initialState = {
  memberships: null,
  membership: {},
  membershipSearch: "",
  perPage: 20,
  page: 1,
  pageCount: 0,
};

// @ts-ignore
export const MemberShipSlice = createSlice({
  name: "page",
  initialState,
  reducers: {
    getMemberships: (state, action) => {
      state.memberships = action.payload;
    },
    getMembershipCount: (state, action) => {
      state.pageCount = action.payload.total;
    },
    addMembership: async (state, action) => {
      const response = await ApiService(
        "post",
        "/admin/v1/memberships",
        action.payload,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      window.location.href = "/membership";
      console.log(action.payload);
    },
    getMembership: async (state, action) => {
      const response = await ApiService(
        "get",
        "/admin/v1/memberships/" + action.payload,
        action.payload,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      state.membership = response.data;
    },
    updateMembership: async (state, action) => {
      const response = await ApiService(
        "put",
        "/admin/v1/memberships/" + action.payload.id,
        action.payload,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      window.location.href = "/membership";
      console.log(action.payload);
    },
    DeleteMembership: async (state, action) => {
      try {
        const response = await ApiService(
          "delete",
          "/admin/v1/memberships/" + action.payload,
          null,
          {
            Authorization: "Bearer " + localStorage.getItem("token"),
          }
        );
        window.location.href = "/membership";
      } catch (e) {
        console.log(e);
      }
    },
  },
});

export const {
  getMemberships,
  getMembershipCount,
  DeleteMembership,
  addMembership,
  updateMembership,
  getMembership,
} = MemberShipSlice.actions;

export const fetchMemberships =
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
      dispatch(getMemberships(response.data));
      dispatch(getMembershipCount(response.meta));
    } catch (err: any) {
      throw new Error(err);
    }
  };

export default MemberShipSlice.reducer;
