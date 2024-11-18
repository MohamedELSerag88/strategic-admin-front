import React, { useEffect } from "react";
import { useDispatch, useSelector } from "@/store/hooks";
import {
  Grid,
  MenuItem,
  Button,
  FormLabel,
  Box,
  Chip,
  IconButton,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  useTheme, TextareaAutosize,
} from "@mui/material";
import {
  fetchMeasurements,
  DeleteMeasurement,
  addMeasurement,
  updateMeasurement,
  getMeasurement,
} from "@/store/apps/measurements/MeasurementSlice";
import { IconTrash } from "@tabler/icons-react";
import { MeasurementType } from "@/app/(DashboardLayout)/types/apps/Measurement";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomSelect from "../../forms/theme-elements/CustomSelect";
import ApiService from "@/services/apiService";
import { IconPencil } from "@tabler/icons-react";
import CustomTable from "@/app/components/shared/CustomTable";
import Loader from "@/app/components/shared/Loader";
import countries from "@/app/components/shared/Countries";
import Image from "next/image";

const MeasurementsListing = ({ toggleModal, onActionButtonClick }) => {
  const rowsHeaderText = ["Id", "Title", "Subject", "Expert","Participants", "Start Date" ,"End Date"];
  const dispatch = useDispatch();
  const theme = useTheme();
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const [search, setSearch] = React.useState("");
  const [categories, setCategories] = React.useState([]);
  const [experts, setExperts] = React.useState([]);
  const [relatedMeasurements, setRelatedMeasurements] = React.useState([]);
  const [services, setServices] = React.useState([]);
  const [editModal, setEditModal] = React.useState(false);

  const toggle = () => {
    onActionButtonClick();
  };
  const toggleEdit = () => {
    setEditModal(!editModal);
  };
  const [values, setValues] = React.useState({

    title : "",
    subject : "",
    domain: "",
    targeted_segment: "",
    geographical_scope: "",
    participants: "",
    start_date: "",
    end_date: "",
    expert_id: "",
    opinion_ids : [],
    serviceable_data :[]
  });
  const [editValues, setEditValues] = React.useState({
    id: null,
    title : "",
    subject : "",
    domain: "",
    targeted_segment: "",
    geographical_scope: "",
    participants: "",
    start_date: "",
    end_date: "",
    expert_id: "",
    opinion_ids : [],
    serviceable_data :[]
  });

  const handleAddMeasurement = (e: any) => {
    e.preventDefault();
    var payload = {
      title : values.title,
      subject : values.subject,
      domain : values.domain,
      targeted_segment: values.targeted_segment,
      geographical_scope: values.geographical_scope,
      participants: values.participants,
      start_date: values.start_date,
      end_date: values.end_date,
      expert_id: values.expert_id,
      opinion_ids : values.opinion_ids,
      serviceable_data : values.serviceable_data,
    };
    dispatch(addMeasurement(payload));
    onActionButtonClick();
  };
  const handleEditMeasurement = async (pageId: number) => {
    try {
      const response = await ApiService(
        "get",
        "/admin/v1/opinion_measurements/" + pageId,
        null,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      editMeasurement(response.data);
    } catch (e) {
      console.log(e);
    }
  };
  const editMeasurement = (measurementRow) => {
    setEditValues({
      id: measurementRow.id,
      title : measurementRow.title,
      subject : measurementRow.subject,
      domain : measurementRow.domain,
      targeted_segment: measurementRow.targeted_segment,
      geographical_scope: measurementRow.geographical_scope,
      participants: measurementRow.participants,
      start_date: measurementRow.start_date,
      end_date: measurementRow.end_date,
      expert_id: measurementRow.expert_id,
      opinion_ids : measurementRow.opinion_ids,
      serviceable_data : measurementRow.related_services,
    });
    setEditModal(!editModal);
  };
  const handleUpdateMeasurements = (e: any) => {
    e.preventDefault();
    var payload = {
      id: editValues.id,
      title : editValues.title,
      subject : editValues.subject,
      domain : editValues.domain,
      targeted_segment: editValues.targeted_segment,
      geographical_scope: editValues.geographical_scope,
      participants: editValues.participants,
      start_date: editValues.start_date,
      end_date: editValues.end_date,
      expert_id: editValues.expert_id,
      opinion_ids : editValues.opinion_ids,
      serviceable_data : editValues.serviceable_data,
    };
    dispatch(updateMeasurement(payload));

    setEditModal(!editModal);
  };

  useEffect(() => {
    dispatch(
      fetchMeasurements(page, rowsPerPage, search)
    );

    const fetchExpertsAsync = async () => {
      const data = await ApiService("get", "/admin/v1/dropdown/expert", null, {
        Authorization: "Bearer " + localStorage.getItem("token"),
      });
      setExperts(data.data);
    };
    const fetchMeasurementsAsync = async () => {
      const data = await ApiService("get", "/admin/v1/dropdown/OpinionMeasurement", null, {
        Authorization: "Bearer " + localStorage.getItem("token"),
      });
      setRelatedMeasurements(data.data);
    };
    const fetchServicesAsync = async () => {
      const data = await ApiService("get", "/admin/v1/serviceable", null, {
        Authorization: "Bearer " + localStorage.getItem("token"),
      });
      setServices(data.data);
    };
    fetchExpertsAsync();
    fetchServicesAsync();
    fetchMeasurementsAsync();

  }, [dispatch, page, rowsPerPage, search]);

  const handleChangePage = (event: any) => {
    var newPage = event.target.textContent;
    if (!newPage) {
      var clieckedPage = event.target.getAttribute("data-testid");
      if (clieckedPage == "NavigateNextIcon") {
        newPage = page + 1;
      } else {
        newPage = page - 1;
      }
    }
    setPage(newPage);
    dispatch(
        fetchMeasurements(newPage, rowsPerPage, search)
    );
  };

  const handleStatusChange = (status: number | null) => {
    // @ts-ignore
    setStatusFilter(status);
    dispatch(fetchMeasurements(page, rowsPerPage , search));
  };


  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    dispatch(
        fetchMeasurements(
        page,
        parseInt(event.target.value, 10),
        search
      )
    );
  };

  const getVisibleMeasurements = (
    measurements: MeasurementType[],
    MeasurementCount: number,
    MeasurementSearch: string,
    perPage: number,
    page: number
  ) => {
    return measurements;
  };
  const handelSearchKey = (measurementSearch: string) => {
    setSearch(measurementSearch);
    dispatch(
        fetchMeasurements(page, rowsPerPage, measurementSearch)
    );
  };
  const measurements = useSelector((state) =>
    getVisibleMeasurements(
      state.measurementReducer.measurements,
      state.measurementReducer.pageCount,
      state.measurementReducer.measurementSearch,
      rowsPerPage,
      page
    )
  );
  const totalRows = Math.ceil(
    useSelector((state) => state.measurementReducer.pageCount / rowsPerPage)
  );

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - measurements?.length) : 0;


  return (
    <Box mt={4}>
      <Box sx={{ ml: "auto" }} mb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4} sx={{ pt: "0 !important" }}>
            <CustomFormLabel htmlFor="search">Search</CustomFormLabel>
            <CustomTextField
              id="search"
              placeholder="Search Text"
              variant="outlined"
              onChange={(e) => handelSearchKey(e.target.value)}
              fullWidth
            />
          </Grid>

        </Grid>
      </Box>
      {measurements && measurements.length ? (
        <CustomTable
          rowsHeaderText={rowsHeaderText}
          totalRows={totalRows}
          handleChangePage={handleChangePage}
        >
          {measurements.map((measurement) => (
            <TableRow key={measurement.id} hover>
              <TableCell>{measurement.id}</TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {measurement.title}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {measurement.subject}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {measurement.expert?.name}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {measurement.participants}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {measurement.start_date}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {measurement.end_date}
                  </Typography>
                </Box>
              </TableCell>



              <TableCell align="right">
                <Tooltip title="Delete Page">
                  <IconButton onClick={() => dispatch(DeleteMeasurement(measurement.id))}>
                    <IconTrash size="18" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit">
                  <IconButton onClick={(e) => handleEditMeasurement(measurement.id)}>
                    <IconPencil size="18" stroke={1.3} />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </CustomTable>
      ) : !measurements ? (
        <TableBody
          sx={{
            width: "100%",
            height: "200px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Loader />
        </TableBody>
      ) : (
        <TableBody
          sx={{
            width: "100%",
            height: "200px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h3" fontWeight={"400"}>
            No Measurements
          </Typography>
        </TableBody>
      )}
      <Dialog
        open={toggleModal}
        onClose={toggle}
        maxWidth="sm"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" variant="h5">
          {"Add New Measurement"}
        </DialogTitle>
        <DialogContent>
          <Box mt={3}>
            <form onSubmit={handleAddMeasurement}>
              <Grid spacing={3} container>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Title</FormLabel>
                  <TextField
                      id="subject"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={values.title}
                      onChange={(e) => setValues({ ...values, title: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Subject</FormLabel>
                  <TextField
                      id="subject"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={values.subject}
                      onChange={(e) => setValues({ ...values, subject: e.target.value })}
                  />
                </Grid>

                {/* Domain */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>Domain</FormLabel>
                  <TextField
                      id="domain"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={values.domain}
                      onChange={(e) => setValues({ ...values, domain: e.target.value })}
                  />
                </Grid>

                {/* Targeted Segment */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>Targeted Segment</FormLabel>
                  <TextField
                      id="targeted_segment"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={values.targeted_segment}
                      onChange={(e) => setValues({ ...values, targeted_segment: e.target.value })}
                  />
                </Grid>

                {/* Geographical Scope */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>Geographical Scope</FormLabel>
                  <TextField
                      id="geographical_scope"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={values.geographical_scope}
                      onChange={(e) => setValues({ ...values, geographical_scope: e.target.value })}
                  />
                </Grid>

                {/* Participants */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>Participants</FormLabel>
                  <TextField
                      id="participants"
                      size="small"
                      type="number"
                      variant="outlined"
                      fullWidth
                      value={values.participants}
                      onChange={(e) => setValues({ ...values, participants: e.target.value })}
                  />
                </Grid>

                {/* Start Date */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>Start Date</FormLabel>
                  <TextField
                      id="start_date"
                      type="date"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={values.start_date}
                      onChange={(e) => setValues({ ...values, start_date: e.target.value })}
                  />
                </Grid>

                {/* End Date */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>End Date</FormLabel>
                  <TextField
                      id="end_date"
                      type="date"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={values.end_date}
                      onChange={(e) => setValues({ ...values, end_date: e.target.value })}
                  />
                </Grid>


                {/* Expert ID */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>Expert </FormLabel>
                  <CustomSelect
                      id="expert_id"
                      value={values.expert_id}
                      onChange={(e) =>
                          setValues({ ...values, expert_id: e.target.value })
                      }
                      fullWidth
                  >
                    {experts.map((expert) => (
                        <MenuItem key={expert?.id} value={expert?.id}>
                          {expert?.name}
                        </MenuItem>
                    ))}
                  </CustomSelect>
                </Grid>


                {/* Related Measurements */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>Related Measurements </FormLabel>
                  <CustomSelect
                      id="measurement_ids"
                      multiple
                      value={values.opinion_ids}
                      onChange={(e) =>
                          setValues({ ...values, opinion_ids: e.target.value })
                      }
                      fullWidth
                  >
                    {relatedMeasurements.map((relatedMeasurement) => (
                        <MenuItem key={relatedMeasurement?.id} value={relatedMeasurement?.id}>
                          {relatedMeasurement?.name}
                        </MenuItem>
                    ))}
                  </CustomSelect>
                </Grid>


                {/* Serviceable Data */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>Serviceable Data</FormLabel>
                  <CustomSelect
                      id="serviceable_data"
                      multiple
                      value={values.serviceable_data.map(service => service.serviceable_id)}
                      onChange={(e) => {
                        const selectedIds = e.target.value;
                        const selectedServices = selectedIds.map(id => {
                          const service = services.find(s => s.id === id);
                          return {
                            serviceable_type: service?.type,
                            serviceable_id: service?.id,
                          };
                        });
                        setValues({ ...values, serviceable_data: selectedServices });
                      }}
                      fullWidth
                  >
                    {services.map((related) => (
                        <MenuItem key={related?.id} value={related?.id}>
                          {related?.name}
                        </MenuItem>
                    ))}
                  </CustomSelect>
                </Grid>

                {/* Submit and Cancel Buttons */}
                <Grid item xs={12} lg={12}>
                  <Button
                      variant="contained"
                      color="primary"
                      sx={{mr: 1}}
                      type="submit"
                      disabled={
                          values.title.length === 0
                      }
                  >
                    Submit
                  </Button>
                  <Button variant="contained" color="error" onClick={toggle}>
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </DialogContent>
      </Dialog>
      <Dialog
          open={editModal}
          onClose={toggleEdit}
          maxWidth="sm"
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" variant="h5">
          {"Edit Measurement"}
        </DialogTitle>
        <DialogContent>
          <Box mt={3}>
            <form onSubmit={handleUpdateMeasurements}>
              <Grid spacing={3} container>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Title</FormLabel>
                  <TextField
                      id="subject"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={editValues.title}
                      onChange={(e) => setEditValues({ ...editValues, title: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Subject</FormLabel>
                  <TextField
                      id="subject"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={editValues.subject}
                      onChange={(e) => setEditValues({ ...editValues, subject: e.target.value })}
                  />
                </Grid>

                {/* Domain */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>Domain</FormLabel>
                  <TextField
                      id="domain"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={editValues.domain}
                      onChange={(e) => setEditValues({ ...editValues, domain: e.target.value })}
                  />
                </Grid>

                {/* Targeted Segment */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>Targeted Segment</FormLabel>
                  <TextField
                      id="targeted_segment"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={editValues.targeted_segment}
                      onChange={(e) => setEditValues({ ...editValues, targeted_segment: e.target.value })}
                  />
                </Grid>

                {/* Geographical Scope */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>Geographical Scope</FormLabel>
                  <TextField
                      id="geographical_scope"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={editValues.geographical_scope}
                      onChange={(e) => setEditValues({ ...editValues, geographical_scope: e.target.value })}
                  />
                </Grid>

                {/* Participants */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>Participants</FormLabel>
                  <TextField
                      id="participants"
                      size="small"
                      type="number"
                      variant="outlined"
                      fullWidth
                      value={editValues.participants}
                      onChange={(e) => setEditValues({ ...editValues, participants: e.target.value })}
                  />
                </Grid>

                {/* Start Date */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>Start Date</FormLabel>
                  <TextField
                      id="start_date"
                      type="date"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={editValues.start_date}
                      onChange={(e) => setEditValues({ ...editValues, start_date: e.target.value })}
                  />
                </Grid>

                {/* End Date */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>End Date</FormLabel>
                  <TextField
                      id="end_date"
                      type="date"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={editValues.end_date}
                      onChange={(e) => setEditValues({ ...editValues, end_date: e.target.value })}
                  />
                </Grid>


                {/* Expert ID */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>Expert </FormLabel>
                  <CustomSelect
                      id="expert_id"
                      value={editValues.expert_id}
                      onChange={(e) =>
                          setEditValues({ ...editValues, expert_id: e.target.value })
                      }
                      fullWidth
                  >
                    {experts.map((expert) => (
                        <MenuItem key={expert?.id} value={expert?.id}>
                          {expert?.name}
                        </MenuItem>
                    ))}
                  </CustomSelect>
                </Grid>


                {/* Related Measurements */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>Related Measurements </FormLabel>
                  <CustomSelect
                      id="measurement_ids"
                      multiple
                      value={editValues.opinion_ids}
                      onChange={(e) =>
                          setEditValues({ ...editValues, opinion_ids: e.target.value })
                      }
                      fullWidth
                  >
                    {relatedMeasurements.map((relatedMeasurement) => (
                        <MenuItem key={relatedMeasurement?.id} value={relatedMeasurement?.id}>
                          {relatedMeasurement?.name}
                        </MenuItem>
                    ))}
                  </CustomSelect>
                </Grid>


                {/* Serviceable Data */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>Serviceable Data</FormLabel>
                  <CustomSelect
                      id="serviceable_data"
                      multiple
                      value={editValues.serviceable_data.map(service => service.serviceable_id)}
                      onChange={(e) => {
                        const selectedIds = e.target.value;
                        const selectedServices = selectedIds.map(id => {
                          const service = services.find(s => s.id === id);
                          return {
                            serviceable_type: service?.type,
                            serviceable_id: service?.id,
                          };
                        });
                        setEditValues({ ...editValues, serviceable_data: selectedServices });
                      }}
                      fullWidth
                  >
                    {services.map((related) => (
                        <MenuItem key={related?.id} value={related?.id}>
                          {related?.name}
                        </MenuItem>
                    ))}
                  </CustomSelect>
                </Grid>

                {/* Submit and Cancel Buttons */}
                <Grid item xs={12} lg={12}>
                  <Button
                      variant="contained"
                      color="primary"
                      sx={{mr: 1}}
                      type="submit"
                      disabled={
                          editValues.title.length === 0
                      }
                  >
                    Submit
                  </Button>
                  <Button variant="contained" color="error" onClick={toggle}>
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default MeasurementsListing;
