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
  fetchExperts,
  DeleteExpert,
  addExpert,
  updateExpert,
  getExpert,
} from "@/store/apps/experts/ExpertSlice";
import { IconTrash } from "@tabler/icons-react";
import { ExpertType } from "@/app/(DashboardLayout)/types/apps/Expert";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomSelect from "../../forms/theme-elements/CustomSelect";
import ApiService from "@/services/apiService";
import { IconPencil } from "@tabler/icons-react";
import CustomTable from "@/app/components/shared/CustomTable";
import Loader from "@/app/components/shared/Loader";
import countries, {Countires} from "@/app/components/shared/Countries";

const ExpertListing = ({ toggleModal, onActionButtonClick }) => {
  const rowsHeaderText = ["Id", "Name", "Job", "Email" , "Phone"];
  const dispatch = useDispatch();
  const theme = useTheme();
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const [search, setSearch] = React.useState("");

  const [editModal, setEditModal] = React.useState(false);

  const toggle = () => {
    onActionButtonClick();
  };
  const toggleEdit = () => {
    setEditModal(!editModal);
  };
  const [values, setValues] = React.useState({
    name: "",
    about:  "",
    specialization:  "",
    job:  "",
    practical_experiences:  "",
    training_courses:  "",
    academic_qualifications:  "",
    research:  "",
    nationality:  "",
    resident_country:  "",
    phone:  "",
    email: "",
  });
  const [editValues, setEditValues] = React.useState({
    id: null,
    name: "",
    about:  "",
    specialization:  "",
    job:  "",
    practical_experiences:  "",
    training_courses:  "",
    academic_qualifications:  "",
    research:  "",
    nationality:  "",
    resident_country:  "",
    phone:  "",
    email: "",
  });

  const handleAddExpert = (e: any) => {
    e.preventDefault();
    var payload = {
      name: values.name,
      about:  values.about,
      specialization: values.specialization,
      job:  values.job,
      practical_experiences:  values.practical_experiences,
      training_courses:  values.training_courses,
      academic_qualifications:  values.academic_qualifications,
      research:  values.research,
      nationality:  values.nationality,
      resident_country:  values.resident_country,
      phone:  values.phone,
      email: values.email,
    };
    dispatch(addExpert(payload));
    onActionButtonClick();
  };
  const handleEditExpert = async (pageId: number) => {
    try {
      const response = await ApiService(
        "get",
        "/admin/v1/experts/" + pageId,
        null,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      editExpert(response.data);
    } catch (e) {
      console.log(e);
    }
  };
  const editExpert = (expertRow) => {
    setEditValues({
      id: expertRow.id,
      name: expertRow.name,
      about:  expertRow.about,
      specialization: expertRow.specialization,
      job:  expertRow.job,
      practical_experiences:  expertRow.practical_experiences,
      training_courses:  expertRow.training_courses,
      academic_qualifications:  expertRow.academic_qualifications,
      research:  expertRow.research,
      nationality:  expertRow.nationality,
      resident_country:  expertRow.resident_country,
      phone:  expertRow.phone,
      email: expertRow.email,
    });
    setEditModal(!editModal);
  };
  const handleUpdateExperts = (e: any) => {
    e.preventDefault();
    var payload = {
      id: editValues.id,
      name: editValues.name,
      about:  editValues.about,
      specialization: editValues.specialization,
      job:  editValues.job,
      practical_experiences:  editValues.practical_experiences,
      training_courses:  editValues.training_courses,
      academic_qualifications:  editValues.academic_qualifications,
      research:  editValues.research,
      nationality:  editValues.nationality,
      resident_country:  editValues.resident_country,
      phone:  editValues.phone,
      email: editValues.email,

    };
    dispatch(updateExpert(payload));

    setEditModal(!editModal);
  };

  useEffect(() => {
    dispatch(
      fetchExperts(page, rowsPerPage, search)
    );

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
        fetchExperts(newPage, rowsPerPage, search)
    );
  };

  const handleStatusChange = (status: number | null) => {
    // @ts-ignore
    setStatusFilter(status);
    dispatch(fetchExperts(page, rowsPerPage , search));
  };


  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    dispatch(
        fetchExperts(
        page,
        parseInt(event.target.value, 10),
        search
      )
    );
  };
  const getVisibleExperts = (
    experts: ExpertType[],
    ExpertCount: number,
    ExpertSearch: string,
    perPage: number,
    page: number
  ) => {
    return experts;
  };
  const handelSearchKey = (expertSearch: string) => {
    setSearch(expertSearch);
    dispatch(
        fetchExperts(page, rowsPerPage, expertSearch)
    );
  };
  const experts = useSelector((state) =>
    getVisibleExperts(
      state.expertReducer.experts,
      state.expertReducer.pageCount,
      state.expertReducer.expertSearch,
      rowsPerPage,
      page
    )
  );
  const totalRows = Math.ceil(
    useSelector((state) => state.expertReducer.pageCount / rowsPerPage)
  );

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - experts?.length) : 0;


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
      {experts && experts.length ? (
        <CustomTable
          rowsHeaderText={rowsHeaderText}
          totalRows={totalRows}
          handleChangePage={handleChangePage}
        >
          {experts.map((expert) => (
            <TableRow key={expert.id} hover>
              <TableCell>{expert.id}</TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {expert.name}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {expert.job}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {expert.email}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {expert.phone}
                  </Typography>
                </Box>
              </TableCell>

              <TableCell align="right">
                <Tooltip title="Delete Page">
                  <IconButton onClick={() => dispatch(DeleteExpert(expert.id))}>
                    <IconTrash size="18" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit">
                  <IconButton onClick={(e) => handleEditExpert(expert.id)}>
                    <IconPencil size="18" stroke={1.3} />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </CustomTable>
      ) : !experts ? (
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
            No Experts
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
          {"Add New Expert"}
        </DialogTitle>
        <DialogContent>
          <Box mt={3}>
            <form onSubmit={handleAddExpert}>
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
                  <FormLabel>Email</FormLabel>
                  <TextField
                      id="email"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={values.email}
                      onChange={(e) =>
                          setValues({ ...values, email: e.target.value })
                      }
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Phone</FormLabel>
                  <TextField
                      id="phone"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={values.phone}
                      onChange={(e) =>
                          setValues({ ...values, phone: e.target.value })
                      }
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Job</FormLabel>
                  <TextField
                      id="job"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={values.job}
                      onChange={(e) =>
                          setValues({ ...values, job: e.target.value })
                      }
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Resident Country</FormLabel>
                  <CustomSelect
                      id="resident_country"
                      value={values.resident_country}
                      onChange={(e) => setValues({ ...values, resident_country: e.target.value })}
                      fullWidth
                  >
                    {countries.map((country) => (
                        <MenuItem key={country} value={country}>
                          {country}
                        </MenuItem>
                    ))}
                  </CustomSelect>
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Nationality</FormLabel>
                  <CustomSelect
                      id="nationality"
                      value={values.nationality}
                      onChange={(e) => setValues({ ...values, nationality: e.target.value })}
                      fullWidth
                  >
                    {countries.map((country) => (
                        <MenuItem key={country} value={country}>
                          {country}
                        </MenuItem>
                    ))}
                  </CustomSelect>

                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>About</FormLabel>
                  <CustomTextField
                      id="about"
                      multiline
                      rows={6}
                      variant="outlined"
                      value={values.about}
                      onChange={(e) =>
                          setValues({ ...values, about: e.target.value })
                      }
                      fullWidth
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Specialization</FormLabel>
                    <CustomTextField
                        id="specialization"
                        multiline
                        rows={6}
                        variant="outlined"
                        value={values.specialization}
                        onChange={(e) =>
                            setValues({ ...values, specialization: e.target.value })
                        }
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Practical Experiences</FormLabel>
                  <CustomTextField
                      id="practical_experiences"
                      multiline
                      rows={6}
                      variant="outlined"
                      value={values.practical_experiences}
                      onChange={(e) =>
                          setValues({ ...values, practical_experiences: e.target.value })
                      }
                      fullWidth
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Training Courses</FormLabel>
                  <CustomTextField
                      id="training_courses"
                      multiline
                      rows={6}
                      variant="outlined"
                      value={values.training_courses}
                      onChange={(e) =>
                          setValues({ ...values, training_courses: e.target.value })
                      }
                      fullWidth
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Academic Qualifications</FormLabel>
                  <CustomTextField
                      id="academic_qualifications"
                      multiline
                      rows={6}
                      variant="outlined"
                      value={values.academic_qualifications}
                      onChange={(e) =>
                          setValues({ ...values, academic_qualifications: e.target.value })
                      }
                      fullWidth
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Research</FormLabel>
                  <CustomTextField
                      id="research"
                      multiline
                      rows={6}
                      variant="outlined"
                      value={values.research}
                      onChange={(e) =>
                          setValues({ ...values, research: e.target.value })
                      }
                      fullWidth
                  />
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
          {"Edit Expert"}
        </DialogTitle>
        <DialogContent>
          <Box mt={3}>
            <form onSubmit={handleUpdateExperts}>
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
                  <FormLabel>Email</FormLabel>
                  <TextField
                      id="email"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={editValues.email}
                      onChange={(e) =>
                          setEditValues({ ...editValues, email: e.target.value })
                      }
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Phone</FormLabel>
                  <TextField
                      id="phone"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={editValues.phone}
                      onChange={(e) =>
                          setEditValues({ ...editValues, phone: e.target.value })
                      }
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Job</FormLabel>
                  <TextField
                      id="job"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={editValues.job}
                      onChange={(e) =>
                          setEditValues({ ...editValues, job: e.target.value })
                      }
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Resident Country</FormLabel>
                  <CustomSelect
                      id="resident_country"
                      value={editValues.resident_country}
                      onChange={(e) => setEditValues({ ...editValues, resident_country: e.target.value })}
                      fullWidth
                  >
                    {countries.map((country) => (
                        <MenuItem key={country} value={country}>
                          {country}
                        </MenuItem>
                    ))}
                  </CustomSelect>
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Nationality</FormLabel>
                  <CustomSelect
                      id="nationality"
                      value={editValues.nationality}
                      onChange={(e) => setEditValues({ ...editValues, nationality: e.target.value })}
                      fullWidth
                  >
                    {countries.map((country) => (
                        <MenuItem key={country} value={country}>
                          {country}
                        </MenuItem>
                    ))}
                  </CustomSelect>

                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>About</FormLabel>
                  <CustomTextField
                      id="about"
                      multiline
                      rows={6}
                      variant="outlined"
                      value={editValues.about}
                      onChange={(e) =>
                          setEditValues({ ...editValues, about: e.target.value })
                      }
                      fullWidth
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Specialization</FormLabel>
                  <CustomTextField
                      id="specialization"
                      multiline
                      rows={6}
                      variant="outlined"
                      value={editValues.specialization}
                      onChange={(e) =>
                          setEditValues({ ...editValues, specialization: e.target.value })
                      }
                      fullWidth
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Practical Experiences</FormLabel>
                  <CustomTextField
                      id="practical_experiences"
                      multiline
                      rows={6}
                      variant="outlined"
                      value={editValues.practical_experiences}
                      onChange={(e) =>
                          setEditValues({ ...editValues, practical_experiences: e.target.value })
                      }
                      fullWidth
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Training Courses</FormLabel>
                  <CustomTextField
                      id="training_courses"
                      multiline
                      rows={6}
                      variant="outlined"
                      value={editValues.training_courses}
                      onChange={(e) =>
                          setEditValues({ ...editValues, training_courses: e.target.value })
                      }
                      fullWidth
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Academic Qualifications</FormLabel>
                  <CustomTextField
                      id="academic_qualifications"
                      multiline
                      rows={6}
                      variant="outlined"
                      value={editValues.academic_qualifications}
                      onChange={(e) =>
                          setEditValues({ ...editValues, academic_qualifications: e.target.value })
                      }
                      fullWidth
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Research</FormLabel>
                  <CustomTextField
                      id="research"
                      multiline
                      rows={6}
                      variant="outlined"
                      value={editValues.research}
                      onChange={(e) =>
                          setEditValues({ ...editValues, research: e.target.value })
                      }
                      fullWidth
                  />
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

export default ExpertListing;
