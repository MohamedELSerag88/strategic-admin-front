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
  fetchConsultations,
  DeleteConsultation,
  addConsultation,
  updateConsultation,
  getConsultation,
} from "@/store/apps/consultations/ConsultationSlice";
import { IconTrash } from "@tabler/icons-react";
import { ConsultationType } from "@/app/(DashboardLayout)/types/apps/Consultation";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomSelect from "../../forms/theme-elements/CustomSelect";
import ApiService from "@/services/apiService";
import { IconPencil } from "@tabler/icons-react";
import CustomTable from "@/app/components/shared/CustomTable";
import Loader from "@/app/components/shared/Loader";
import countries from "@/app/components/shared/Countries";

const ConsultationsListing = ({ toggleModal, onActionButtonClick }) => {
  const rowsHeaderText = ["Id", "Name", "Scope Of Work", "goal" ];
  const dispatch = useDispatch();
  const theme = useTheme();
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const [search, setSearch] = React.useState("");
  const [relatedConsultations, setRelatedConsultations] = React.useState([]);
  const [editModal, setEditModal] = React.useState(false);

  const toggle = () => {
    onActionButtonClick();
  };
  const toggleEdit = () => {
    setEditModal(!editModal);
  };
  const [values, setValues] = React.useState({
    name: "",
    scope_of_work:  "",
    goal:  "",
    summary:  "",
    stages:  "",
    duration:  "",
    relatedConsultations_id:[]
  });
  const [editValues, setEditValues] = React.useState({
    id: null,
    name: "",
    scope_of_work:  "",
    goal:  "",
    summary:  "",
    stages:  "",
    duration:  "",
    relatedConsultations_id:[]
  });

  const handleAddConsultation = (e: any) => {
    e.preventDefault();
    var payload = {
      name: values.name,
      scope_of_work:  values.scope_of_work,
      goal: values.goal,
      summary:  values.summary,
      stages:  values.stages,
      duration:  values.duration,
      relatedConsultations_id:  values.relatedConsultations_id,
    };
    dispatch(addConsultation(payload));
    onActionButtonClick();
  };
  const handleEditConsultation = async (pageId: number) => {
    try {
      const response = await ApiService(
        "get",
        "/admin/v1/consultations/" + pageId,
        null,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      editConsultation(response.data);
    } catch (e) {
      console.log(e);
    }
  };
  const editConsultation = (consultationRow) => {
    setEditValues({
      id: consultationRow.id,
      name: consultationRow.name,
      scope_of_work:  consultationRow.scope_of_work,
      goal: consultationRow.goal,
      summary:  consultationRow.summary,
      stages:  consultationRow.stages,
      duration:  consultationRow.duration,
      relatedConsultations_id:  consultationRow.relatedConsultations_id,
    });
    setEditModal(!editModal);
  };
  const handleUpdateConsultations = (e: any) => {
    e.preventDefault();
    var payload = {
      id: editValues.id,
      name: editValues.name,
      scope_of_work:  editValues.scope_of_work,
      goal: editValues.goal,
      summary:  editValues.summary,
      stages:  editValues.stages,
      duration:  editValues.duration,
      relatedConsultations_id:  editValues.relatedConsultations_id,
    };
    dispatch(updateConsultation(payload));

    setEditModal(!editModal);
  };

  useEffect(() => {
    dispatch(
      fetchConsultations(page, rowsPerPage, search)
    );
    const fetchClientsAsync = async () => {
      const data = await ApiService("get", "/admin/v1/dropdown/consultation", null, {
        Authorization: "Bearer " + localStorage.getItem("token"),
      });
      setRelatedConsultations(data.data);
    };
    fetchClientsAsync();

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
        fetchConsultations(newPage, rowsPerPage, search)
    );
  };

  const handleStatusChange = (status: number | null) => {
    // @ts-ignore
    setStatusFilter(status);
    dispatch(fetchConsultations(page, rowsPerPage , search));
  };


  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    dispatch(
        fetchConsultations(
        page,
        parseInt(event.target.value, 10),
        search
      )
    );
  };
  const getVisibleConsultations = (
    consultations: ConsultationType[],
    ConsultationCount: number,
    ConsultationSearch: string,
    perPage: number,
    page: number
  ) => {
    return consultations;
  };
  const handelSearchKey = (consultationSearch: string) => {
    setSearch(consultationSearch);
    dispatch(
        fetchConsultations(page, rowsPerPage, consultationSearch)
    );
  };
  const consultations = useSelector((state) =>
    getVisibleConsultations(
      state.consultationReducer.consultations,
      state.consultationReducer.pageCount,
      state.consultationReducer.consultationSearch,
      rowsPerPage,
      page
    )
  );
  const totalRows = Math.ceil(
    useSelector((state) => state.consultationReducer.pageCount / rowsPerPage)
  );

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - consultations?.length) : 0;


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
      {consultations && consultations.length ? (
        <CustomTable
          rowsHeaderText={rowsHeaderText}
          totalRows={totalRows}
          handleChangePage={handleChangePage}
        >
          {consultations.map((consultation) => (
            <TableRow key={consultation.id} hover>
              <TableCell>{consultation.id}</TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {consultation.name}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {consultation.scope_of_work}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {consultation.goal}
                  </Typography>
                </Box>
              </TableCell>


              <TableCell align="right">
                <Tooltip title="Delete Page">
                  <IconButton onClick={() => dispatch(DeleteConsultation(consultation.id))}>
                    <IconTrash size="18" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit">
                  <IconButton onClick={(e) => handleEditConsultation(consultation.id)}>
                    <IconPencil size="18" stroke={1.3} />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </CustomTable>
      ) : !consultations ? (
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
            No Consultations
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
          {"Add New Consultation"}
        </DialogTitle>
        <DialogContent>
          <Box mt={3}>
            <form onSubmit={handleAddConsultation}>
              <Grid spacing={3} container>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Name</FormLabel>
                  <TextField
                    id="name"
                    size="small"
                    variant="outlined"
                    fullWidth
                    value={values.name}
                    onChange={(e) =>
                      setValues({ ...values, name: e.target.value })
                    }
                  />
                </Grid>


                <Grid item xs={12} lg={6}>
                  <FormLabel>Duration</FormLabel>
                  <TextField
                      id="job"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={values.duration}
                      onChange={(e) =>
                          setValues({ ...values, duration: e.target.value })
                      }
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Scope Of Work</FormLabel>
                  <CustomSelect
                      id="resident_country"
                      value={values.scope_of_work}
                      onChange={(e) => setValues({ ...values, scope_of_work: e.target.value })}
                      fullWidth
                  >
                        <MenuItem key="Establish" value="Establish">Establish</MenuItem>
                        <MenuItem key="Develop" value="Develop">Develop</MenuItem>
                        <MenuItem key="Analysis" value="Analysis">Analysis</MenuItem>
                        <MenuItem key="Measurement" value="Measurement">Measurement</MenuItem>
                        <MenuItem key="Supervision" value="Supervision">Supervision</MenuItem>
                        <MenuItem key="Other" value="Other">Other</MenuItem>
                  </CustomSelect>
                </Grid>

                <Grid item xs={12} lg={6}>
                  <FormLabel>Summary</FormLabel>
                  <CustomTextField
                      id="about"
                      multiline
                      rows={6}
                      variant="outlined"
                      value={values.summary}
                      onChange={(e) =>
                          setValues({ ...values, summary: e.target.value })
                      }
                      fullWidth
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Goal</FormLabel>
                  <CustomTextField
                      id="about"
                      multiline
                      rows={6}
                      variant="outlined"
                      value={values.goal}
                      onChange={(e) =>
                          setValues({ ...values, goal: e.target.value })
                      }
                      fullWidth
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Stages</FormLabel>
                    <CustomTextField
                        id="specialization"
                        multiline
                        rows={6}
                        variant="outlined"
                        value={values.stages}
                        onChange={(e) =>
                            setValues({ ...values, stages: e.target.value })
                        }
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Related Consultations</FormLabel>
                  <CustomSelect
                      id="demo-simple-select-relatedConsultations"
                      multiple
                      value={values.relatedConsultations_id}
                      onChange={(e) =>
                          setValues({ ...values, relatedConsultations_id: e.target.value })
                      }
                      fullWidth
                  >
                    {relatedConsultations.map((related) => (
                        <MenuItem key={related?.id} value={related?.id}>
                          {related?.name}
                        </MenuItem>
                    ))}
                  </CustomSelect>
                </Grid>
                <Grid item xs={12} lg={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mr: 1 }}
                    type="submit"
                    disabled={
                      values.name.length === 0
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
          {"Edit Consultation"}
        </DialogTitle>
        <DialogContent>
          <Box mt={3}>
            <form onSubmit={handleUpdateConsultations}>
              <Grid spacing={3} container>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Name</FormLabel>
                  <TextField
                    id="name"
                    size="small"
                    variant="outlined"
                    fullWidth
                    value={editValues.name}
                    onChange={(e) =>
                      setEditValues({ ...editValues, name: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Duration</FormLabel>
                  <TextField
                      id="job"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={editValues.duration}
                      onChange={(e) =>
                          setEditValues({ ...editValues, duration: e.target.value })
                      }
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Scope Of Work</FormLabel>
                  <CustomSelect
                      id="resident_country"
                      value={editValues.scope_of_work}
                      onChange={(e) => setEditValues({ ...editValues, scope_of_work: e.target.value })}
                      fullWidth
                  >
                    <MenuItem key="Establish" value="Establish">Establish</MenuItem>
                    <MenuItem key="Develop" value="Develop">Develop</MenuItem>
                    <MenuItem key="Analysis" value="Analysis">Analysis</MenuItem>
                    <MenuItem key="Measurement" value="Measurement">Measurement</MenuItem>
                    <MenuItem key="Supervision" value="Supervision">Supervision</MenuItem>
                    <MenuItem key="Other" value="Other">Other</MenuItem>
                  </CustomSelect>
                </Grid>

                <Grid item xs={12} lg={6}>
                  <FormLabel>Summary</FormLabel>
                  <CustomTextField
                      id="about"
                      multiline
                      rows={6}
                      variant="outlined"
                      value={editValues.summary}
                      onChange={(e) =>
                          setEditValues({ ...editValues, summary: e.target.value })
                      }
                      fullWidth
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Goal</FormLabel>
                  <CustomTextField
                      id="about"
                      multiline
                      rows={6}
                      variant="outlined"
                      value={editValues.goal}
                      onChange={(e) =>
                          setEditValues({ ...editValues, goal: e.target.value })
                      }
                      fullWidth
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Stages</FormLabel>
                  <CustomTextField
                      id="specialization"
                      multiline
                      rows={6}
                      variant="outlined"
                      value={editValues.stages}
                      onChange={(e) =>
                          setEditValues({ ...editValues, stages: e.target.value })
                      }
                      fullWidth
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Related Consultations</FormLabel>
                  <CustomSelect
                      id="demo-simple-select-relatedConsultations"
                      multiple
                      value={editValues.relatedConsultations_id}
                      onChange={(e) =>
                          setEditValues({ ...editValues, relatedConsultations_id: e.target.value })
                      }
                      fullWidth
                  >
                    {relatedConsultations.map((related) => (
                        <MenuItem key={related?.id} value={related?.id}>
                          {related?.name}
                        </MenuItem>
                    ))}
                  </CustomSelect>
                </Grid>
                <Grid item xs={12} lg={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mr: 1 }}
                    type="submit"
                    disabled={
                      editValues.name.length === 0
                    }
                  >
                    Submit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={toggleEdit}
                  >
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

export default ConsultationsListing;
