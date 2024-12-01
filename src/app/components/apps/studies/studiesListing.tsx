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
  fetchStudies,
  DeleteStudy,
  addStudy,
  updateStudy,
  getStudy,
} from "@/store/apps/studies/StudySlice";
import { IconTrash } from "@tabler/icons-react";
import { StudyType } from "@/app/(DashboardLayout)/types/apps/Study";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomSelect from "../../forms/theme-elements/CustomSelect";
import ApiService from "@/services/apiService";
import { IconPencil } from "@tabler/icons-react";
import CustomTable from "@/app/components/shared/CustomTable";
import Loader from "@/app/components/shared/Loader";
import countries from "@/app/components/shared/Countries";
import Image from "next/image";

const StudiesListing = ({ toggleModal, onActionButtonClick }) => {
  const rowsHeaderText = ["Id", "Title","Status", "type", "Expert","Specialization" ];
  const dispatch = useDispatch();
  const theme = useTheme();
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const [search, setSearch] = React.useState("");
  const [categories, setCategories] = React.useState([]);
  const [experts, setExperts] = React.useState([]);
  const [relatedStudies, setRelatedStudies] = React.useState([]);
  const [services, setServices] = React.useState([]);
  const [editModal, setEditModal] = React.useState(false);

  const toggle = () => {
    onActionButtonClick();
  };
  const toggleEdit = () => {
    setEditModal(!editModal);
  };
  const [values, setValues] = React.useState({
    type : "",
    title : "",
    expert_id : "",
    specialization: "",
    page_numbers: "",
    publication_date: "",
    main_topics: "",
    summary: "",
    file: "",
    status: "",
    study_ids: [],
    serviceable_data : []
  });
  const [editValues, setEditValues] = React.useState({
    id: null,
    type : "",
    title : "",
    expert_id : "",
    specialization: "",
    page_numbers: "",
    publication_date: "",
    main_topics: "",
    summary: "",
    file: "",
    status: "",
    study_ids: [],
    serviceable_data : []
  });

  const handleAddStudy = (e: any) => {
    e.preventDefault();
    var payload = {
      type: values.type,
      title : values.title,
      expert_id : values.expert_id,
      specialization : values.specialization,
      page_numbers: values.page_numbers,
      publication_date: values.publication_date,
      main_topics: values.main_topics,
      summary: values.summary,
      file: values.file,
      study_ids: values.study_ids,
      serviceable_data : values.serviceable_data,
    };
    dispatch(addStudy(payload));
    onActionButtonClick();
  };
  const handleEditStudy = async (pageId: number) => {
    try {
      const response = await ApiService(
        "get",
        "/admin/v1/studies/" + pageId,
        null,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      editStudy(response.data);
    } catch (e) {
      console.log(e);
    }
  };
  const editStudy = (studyRow) => {
    setEditValues({
      id: studyRow.id,
      type: studyRow.type,
      title : studyRow.title,
      expert_id : studyRow.expert_id,
      specialization : studyRow.specialization,
      page_numbers: studyRow.page_numbers,
      publication_date: studyRow.publication_date,
      main_topics: studyRow.main_topics,
      summary: studyRow.summary,
      file: studyRow.file,
      status: studyRow.status,
      study_ids: studyRow.study_ids,
      serviceable_data : studyRow.related_services,
    });
    setEditModal(!editModal);
  };
  const handleUpdateStudies = (e: any) => {
    e.preventDefault();
    var payload = {
      id: editValues.id,
      type: editValues.type,
      title : editValues.title,
      expert_id : editValues.expert_id,
      specialization : editValues.specialization,
      page_numbers: editValues.page_numbers,
      publication_date: editValues.publication_date,
      main_topics: editValues.main_topics,
      summary: editValues.summary,
      file: editValues.file,
      status: editValues.status,
      study_ids: editValues.study_ids,
      serviceable_data : editValues.serviceable_data,
    };
    dispatch(updateStudy(payload));

    setEditModal(!editModal);
  };

  useEffect(() => {
    dispatch(
      fetchStudies(page, rowsPerPage, search)
    );

    const fetchExpertsAsync = async () => {
      const data = await ApiService("get", "/admin/v1/dropdown/expert", null, {
        Authorization: "Bearer " + localStorage.getItem("token"),
      });
      setExperts(data.data);
    };
    const fetchStudiesAsync = async () => {
      const data = await ApiService("get", "/admin/v1/dropdown/study", null, {
        Authorization: "Bearer " + localStorage.getItem("token"),
      });
      setRelatedStudies(data.data);
    };
    const fetchServicesAsync = async () => {
      const data = await ApiService("get", "/admin/v1/serviceable", null, {
        Authorization: "Bearer " + localStorage.getItem("token"),
      });
      setServices(data.data);
    };
    fetchExpertsAsync();
    fetchServicesAsync();
    fetchStudiesAsync();

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
        fetchStudies(newPage, rowsPerPage, search)
    );
  };

  const handleStatusChange = (status: number | null) => {
    // @ts-ignore
    setStatusFilter(status);
    dispatch(fetchStudies(page, rowsPerPage , search));
  };


  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    dispatch(
        fetchStudies(
        page,
        parseInt(event.target.value, 10),
        search
      )
    );
  };
  const handleUpoadFile = async (fileInput) => {
    const file = fileInput.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await ApiService(
          "post",
          "/admin/v1/upload-file",
          formData,
          {
            Authorization: "Bearer " + localStorage.getItem("token"),
          }
      );
      const imageUrl = response.data.path;
      setEditValues({ ...editValues, file: imageUrl });
      setValues({ ...values, file: imageUrl });
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  const getVisibleStudies = (
    studies: StudyType[],
    StudyCount: number,
    StudySearch: string,
    perPage: number,
    page: number
  ) => {
    return studies;
  };
  const handelSearchKey = (studySearch: string) => {
    setSearch(studySearch);
    dispatch(
        fetchStudies(page, rowsPerPage, studySearch)
    );
  };
  const studies = useSelector((state) =>
    getVisibleStudies(
      state.studyReducer.studies,
      state.studyReducer.pageCount,
      state.studyReducer.studySearch,
      rowsPerPage,
      page
    )
  );
  const totalRows = Math.ceil(
    useSelector((state) => state.studyReducer.pageCount / rowsPerPage)
  );

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - studies?.length) : 0;


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
      {studies && studies.length ? (
        <CustomTable
          rowsHeaderText={rowsHeaderText}
          totalRows={totalRows}
          handleChangePage={handleChangePage}
        >
          {studies.map((study) => (
            <TableRow key={study.id} hover>
              <TableCell>{study.id}</TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {study.title}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {study.status ? "Published": "UnPublished"}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {study.type}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {study.expert?.name}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {study.specialization}
                  </Typography>
                </Box>
              </TableCell>



              <TableCell align="right">
                <Tooltip title="Delete Page">
                  <IconButton onClick={() => dispatch(DeleteStudy(study.id))}>
                    <IconTrash size="18" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit">
                  <IconButton onClick={(e) => handleEditStudy(study.id)}>
                    <IconPencil size="18" stroke={1.3} />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </CustomTable>
      ) : !studies ? (
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
            No Studies
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
          {"Add New Study"}
        </DialogTitle>
        <DialogContent>
          <Box mt={3}>
            <form onSubmit={handleAddStudy}>
              <Grid spacing={3} container>
                {/* Title */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>Title</FormLabel>
                  <TextField
                      id="title"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={values.title}
                      onChange={(e) =>
                          setValues({...values, title: e.target.value})
                      }
                  />
                </Grid>
                {/* Status */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>Status </FormLabel>
                  <CustomSelect
                      id="expert_id"
                      value={values.status}
                      onChange={(e) =>
                          setValues({ ...values, status: e.target.value })
                      }
                      fullWidth
                  >
                        <MenuItem key="Published" value="1">Published</MenuItem>
                        <MenuItem key="UnPublished" value="0">UnPublished</MenuItem>
                  </CustomSelect>
                </Grid>
                {/* Type */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>Type</FormLabel>
                  <TextField
                      id="type"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={values.type}
                      onChange={(e) =>
                          setValues({...values, type: e.target.value})
                      }
                  />
                </Grid>

                {/* Specialization */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>Specialization</FormLabel>
                  <CustomTextField
                      id="specialization"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={3}
                      value={values.specialization}
                      onChange={(e) =>
                          setValues({...values, specialization: e.target.value})
                      }
                  />
                </Grid>

                {/* Price */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>Page Numbers</FormLabel>
                  <TextField
                      id="page_numbers"
                      size="small"
                      variant="outlined"
                      type="number"
                      fullWidth
                      value={values.page_numbers}
                      onChange={(e) =>
                          setValues({...values, page_numbers: e.target.value})
                      }
                  />
                </Grid>

                {/* Main Axes */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>Main Axes</FormLabel>
                  <CustomTextField
                      id="main_axes"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={3}
                      value={values.main_topics}
                      onChange={(e) =>
                          setValues({...values, main_topics: e.target.value})
                      }
                  />
                </Grid>

                {/* Main Knowledge */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>Summary</FormLabel>
                  <CustomTextField
                      id="main_knowledge"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={3}
                      value={values.summary}
                      onChange={(e) =>
                          setValues({...values, summary: e.target.value})
                      }
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

                <Grid item xs={12} lg={6}>
                  <FormLabel>Editing Date</FormLabel>
                  <TextField
                      id="editing_date"
                      type="date"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={values.publication_date}
                      onChange={(e) => setValues({...values, publication_date: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Attach File</FormLabel>
                  <input
                      type="file"
                      onChange={(e) => handleUpoadFile(e.target)}
                  />
                </Grid>
                {/* Related Studies */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>Related Studies </FormLabel>
                  <CustomSelect
                      id="study_ids"
                      multiple
                      value={values.study_ids}
                      onChange={(e) =>
                          setValues({ ...values, study_ids: e.target.value })
                      }
                      fullWidth
                  >
                    {relatedStudies.map((relatedStudy) => (
                        <MenuItem key={relatedStudy?.id} value={relatedStudy?.id}>
                          {relatedStudy?.name}
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
          {"Edit Study"}
        </DialogTitle>
        <DialogContent>
          <Box mt={3}>
            <form onSubmit={handleUpdateStudies}>
              <Grid spacing={3} container>
                {/* Title */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>Title</FormLabel>
                  <TextField
                      id="title"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={editValues.title}
                      onChange={(e) =>
                          setEditValues({...editValues, title: e.target.value})
                      }
                  />
                </Grid>
                {/* Status */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>Status </FormLabel>
                  <CustomSelect
                      id="expert_id"
                      value={editValues.status}
                      onChange={(e) =>
                          setEditValues({ ...editValues, status: e.target.value })
                      }
                      fullWidth
                  >
                    <MenuItem key="Published" value="1">Published</MenuItem>
                    <MenuItem key="UnPublished" value="0">UnPublished</MenuItem>
                  </CustomSelect>
                </Grid>
                {/* Type */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>Type</FormLabel>
                  <TextField
                      id="title"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={editValues.type}
                      onChange={(e) =>
                          setEditValues({...editValues, type: e.target.value})
                      }
                  />
                </Grid>

                {/* Specialization */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>Specialization</FormLabel>
                  <CustomTextField
                      id="specialization"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={3}
                      value={editValues.specialization}
                      onChange={(e) =>
                          setEditValues({...editValues, specialization: e.target.value})
                      }
                  />
                </Grid>

                {/* Price */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>Page Numbers</FormLabel>
                  <TextField
                      id="page_numbers"
                      size="small"
                      variant="outlined"
                      type="number"
                      fullWidth
                      value={editValues.page_numbers}
                      onChange={(e) =>
                          setEditValues({...editValues, page_numbers: e.target.value})
                      }
                  />
                </Grid>

                {/* Main Axes */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>Main Axes</FormLabel>
                  <CustomTextField
                      id="main_axes"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={3}
                      value={editValues.main_topics}
                      onChange={(e) =>
                          setEditValues({...editValues, main_topics: e.target.value})
                      }
                  />
                </Grid>

                {/* Main Knowledge */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>Summary</FormLabel>
                  <CustomTextField
                      id="main_knowledge"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={3}
                      value={editValues.summary}
                      onChange={(e) =>
                          setEditValues({...editValues, summary: e.target.value})
                      }
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

                <Grid item xs={12} lg={6}>
                  <FormLabel>Editing Date</FormLabel>
                  <TextField
                      id="editing_date"
                      type="date"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={editValues.publication_date}
                      onChange={(e) => setEditValues({...editValues, publication_date: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Attach File</FormLabel>
                  <input
                      type="file"
                      onChange={(e) => handleUpoadFile(e.target)}
                  />
                </Grid>
                {/* Related Studies */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>Related Studies </FormLabel>
                  <CustomSelect
                      id="study_ids"
                      multiple
                      value={editValues.study_ids}
                      onChange={(e) =>
                          setEditValues({ ...editValues, study_ids: e.target.value })
                      }
                      fullWidth
                  >
                    {relatedStudies.map((relatedStudy) => (
                        <MenuItem key={relatedStudy?.id} value={relatedStudy?.id}>
                          {relatedStudy?.name}
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

export default StudiesListing;
