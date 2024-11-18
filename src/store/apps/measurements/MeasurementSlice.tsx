import axios from "../../../utils/axios";
import { createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../../store";
import ApiService from "@/services/apiService";
const API_URL = "/admin/v1/opinion_measurements";

const initialState = {
  measurements: null,
  measurement: {},
  measurementSearch: "",
  perPage: 20,
  page: 1,
  pageCount: 0,
};

// @ts-ignore
export const MeasurementSlice = createSlice({
  name: "page",
  initialState,
  reducers: {
    getMeasurements: (state, action) => {
      state.measurements = action.payload;
    },
    getMeasurementCount: (state, action) => {
      state.pageCount = action.payload.total;
    },
    addMeasurement: async (state, action) => {
      const response = await ApiService(
        "post",
        "/admin/v1/opinion_measurements",
        action.payload,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      window.location.href = "/measurements";
      console.log(action.payload);
    },
    getMeasurement: async (state, action) => {
      const response = await ApiService(
        "get",
        "/admin/v1/opinion_measurements/" + action.payload,
        action.payload,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      state.measurement = response.data;
    },
    updateMeasurement: async (state, action) => {
      const response = await ApiService(
        "put",
        "/admin/v1/opinion_measurements/" + action.payload.id,
        action.payload,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      window.location.href = "/measurements";
      console.log(action.payload);
    },
    DeleteMeasurement: async (state, action) => {
      try {
        const response = await ApiService(
          "delete",
          "/admin/v1/opinion_measurements/" + action.payload,
          null,
          {
            Authorization: "Bearer " + localStorage.getItem("token"),
          }
        );
        window.location.href = "/measurements";
      } catch (e) {
        console.log(e);
      }
    },
  },
});

export const {
  getMeasurements,
  getMeasurementCount,
  DeleteMeasurement,
  addMeasurement,
  updateMeasurement,
  getMeasurement,
} = MeasurementSlice.actions;

export const fetchMeasurements =
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
      dispatch(getMeasurements(response.data));
      dispatch(getMeasurementCount(response.meta));
    } catch (err: any) {
      throw new Error(err);
    }
  };

export default MeasurementSlice.reducer;
