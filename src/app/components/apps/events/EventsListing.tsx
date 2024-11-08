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
  fetchEvents,
  DeleteEvent,
  addEvent,
  updateEvent,
  getEvent,
} from "@/store/apps/events/EventSlice";
import { IconTrash } from "@tabler/icons-react";
import { EventType } from "@/app/(DashboardLayout)/types/apps/Event";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomSelect from "../../forms/theme-elements/CustomSelect";
import ApiService from "@/services/apiService";
import { IconPencil } from "@tabler/icons-react";
import CustomTable from "@/app/components/shared/CustomTable";
import Loader from "@/app/components/shared/Loader";
import countries from "@/app/components/shared/Countries";

const EventsListing = ({ toggleModal, onActionButtonClick }) => {
  const rowsHeaderText = ["Id", "Title", "Category", "Expert","Price", "specialization" ];
  const dispatch = useDispatch();
  const theme = useTheme();
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const [search, setSearch] = React.useState("");
  const [categories, setCategories] = React.useState([]);
  const [experts, setExperts] = React.useState([]);
  const [services, setServices] = React.useState([]);
  const [editModal, setEditModal] = React.useState(false);

  const toggle = () => {
    onActionButtonClick();
  };
  const toggleEdit = () => {
    setEditModal(!editModal);
  };
  const [values, setValues] = React.useState({
    category_id : 0,
    title : "",
    specialization : "",
    objective : "",
    main_axes: "",
    main_knowledge: "",
    main_skills: "",
    presentation_format: "",
    duration: "",
    duration_type: "",
    price: "",
    expert_id: "",
    month:"",
    week_number:"",
    from_date : "",
    to_date : "",
    serviceable_data : []
  });
  const [editValues, setEditValues] = React.useState({
    id: null,
    category_id : 0,
    title : "",
    specialization : "",
    objective : "",
    main_axes: "",
    main_knowledge: "",
    main_skills: "",
    presentation_format: "",
    duration: "",
    duration_type: "",
    price: "",
    expert_id: "",
    month:"",
    week_number:"",
    from_date : "",
    to_date : "",
    serviceable_data : []
  });

  const handleAddEvent = (e: any) => {
    e.preventDefault();
    var payload = {
      category_id: values.category_id,
      title : values.title,
      specialization : values.specialization,
      objective : values.objective,
      main_axes: values.main_axes,
      main_knowledge: values.main_knowledge,
      main_skills: values.main_skills,
      presentation_format: values.presentation_format,
      duration: values.duration,
      duration_type: values.duration_type,
      price: values.price,
      expert_id: values.expert_id,
      month: values.month,
      week_number:values.week_number,
      from_date : values.from_date,
      to_date : values.to_date,
      serviceable_data : values.serviceable_data,
    };
    dispatch(addEvent(payload));
    onActionButtonClick();
  };
  const handleEditEvent = async (pageId: number) => {
    try {
      const response = await ApiService(
        "get",
        "/admin/v1/events/" + pageId,
        null,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      editEvent(response.data);
    } catch (e) {
      console.log(e);
    }
  };
  const editEvent = (eventRow) => {
    setEditValues({
      id: eventRow.id,
      category_id: eventRow.category_id,
      title : eventRow.title,
      specialization : eventRow.specialization,
      objective : eventRow.objective,
      main_axes: eventRow.main_axes,
      main_knowledge: eventRow.main_knowledge,
      main_skills: eventRow.main_skills,
      presentation_format: eventRow.presentation_format,
      duration: eventRow.duration,
      duration_type: eventRow.duration_type,
      price: eventRow.price,
      expert_id: eventRow.expert_id,
      month: eventRow.month,
      week_number:eventRow.week_number,
      from_date : eventRow.from_date,
      to_date : eventRow.to_date,
      serviceable_data : eventRow.related_services,
    });
    setEditModal(!editModal);
  };
  const handleUpdateEvents = (e: any) => {
    e.preventDefault();
    var payload = {
      id: editValues.id,
      category_id: editValues.category_id,
      title : editValues.title,
      specialization : editValues.specialization,
      objective : editValues.objective,
      main_axes: editValues.main_axes,
      main_knowledge: editValues.main_knowledge,
      main_skills: editValues.main_skills,
      presentation_format: editValues.presentation_format,
      duration: editValues.duration,
      duration_type: editValues.duration_type,
      price: editValues.price,
      expert_id: editValues.expert_id,
      month: editValues.month,
      week_number:editValues.week_number,
      from_date : editValues.from_date,
      to_date : editValues.to_date,
      serviceable_data : editValues.serviceable_data,
    };
    dispatch(updateEvent(payload));

    setEditModal(!editModal);
  };

  useEffect(() => {
    dispatch(
      fetchEvents(page, rowsPerPage, search)
    );
    const fetchCategoriesAsync = async () => {
      const data = await ApiService("get", "/admin/v1/dropdown/category", null, {
        Authorization: "Bearer " + localStorage.getItem("token"),
      });
      setCategories(data.data);
    };
    const fetchExpertsAsync = async () => {
      const data = await ApiService("get", "/admin/v1/dropdown/expert", null, {
        Authorization: "Bearer " + localStorage.getItem("token"),
      });
      setExperts(data.data);
    };
    const fetchServicesAsync = async () => {
      const data = await ApiService("get", "/admin/v1/serviceable", null, {
        Authorization: "Bearer " + localStorage.getItem("token"),
      });
      setServices(data.data);
    };
    fetchExpertsAsync();
    fetchServicesAsync();
    fetchCategoriesAsync();

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
        fetchEvents(newPage, rowsPerPage, search)
    );
  };

  const handleStatusChange = (status: number | null) => {
    // @ts-ignore
    setStatusFilter(status);
    dispatch(fetchEvents(page, rowsPerPage , search));
  };


  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    dispatch(
        fetchEvents(
        page,
        parseInt(event.target.value, 10),
        search
      )
    );
  };
  const getVisibleEvents = (
    events: EventType[],
    EventCount: number,
    EventSearch: string,
    perPage: number,
    page: number
  ) => {
    return events;
  };
  const handelSearchKey = (eventSearch: string) => {
    setSearch(eventSearch);
    dispatch(
        fetchEvents(page, rowsPerPage, eventSearch)
    );
  };
  const events = useSelector((state) =>
    getVisibleEvents(
      state.eventReducer.events,
      state.eventReducer.pageCount,
      state.eventReducer.eventSearch,
      rowsPerPage,
      page
    )
  );
  const totalRows = Math.ceil(
    useSelector((state) => state.eventReducer.pageCount / rowsPerPage)
  );

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - events?.length) : 0;


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
      {events && events.length ? (
        <CustomTable
          rowsHeaderText={rowsHeaderText}
          totalRows={totalRows}
          handleChangePage={handleChangePage}
        >
          {events.map((event) => (
            <TableRow key={event.id} hover>
              <TableCell>{event.id}</TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {event.title}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {event.category?.name}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {event.expert?.name}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {event.price}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {event.specialization}
                  </Typography>
                </Box>
              </TableCell>


              <TableCell align="right">
                <Tooltip title="Delete Page">
                  <IconButton onClick={() => dispatch(DeleteEvent(event.id))}>
                    <IconTrash size="18" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit">
                  <IconButton onClick={(e) => handleEditEvent(event.id)}>
                    <IconPencil size="18" stroke={1.3} />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </CustomTable>
      ) : !events ? (
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
            No Events
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
          {"Add New Event"}
        </DialogTitle>
        <DialogContent>
          <Box mt={3}>
            <form onSubmit={handleAddEvent}>
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

                {/* Category */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>Category</FormLabel>
                  <CustomSelect
                      id="category_id"
                      value={values.category_id}
                      onChange={(e) =>
                          setValues({ ...values, category_id: e.target.value })
                      }
                      fullWidth
                  >
                    {categories.map((category) => (
                        <MenuItem key={category?.id} value={category?.id}>
                          {category?.name}
                        </MenuItem>
                    ))}
                  </CustomSelect>
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

                {/* Objective */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>Objective</FormLabel>
                  <CustomTextField
                      id="objective"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={3}
                      value={values.objective}
                      onChange={(e) =>
                          setValues({...values, objective: e.target.value})
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
                      value={values.main_axes}
                      onChange={(e) =>
                          setValues({...values, main_axes: e.target.value})
                      }
                  />
                </Grid>

                {/* Main Knowledge */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>Main Knowledge</FormLabel>
                  <CustomTextField
                      id="main_knowledge"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={3}
                      value={values.main_knowledge}
                      onChange={(e) =>
                          setValues({...values, main_knowledge: e.target.value})
                      }
                  />
                </Grid>

                {/* Main Skills */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>Main Skills</FormLabel>
                  <CustomTextField
                      id="main_skills"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={3}
                      value={values.main_skills}
                      onChange={(e) =>
                          setValues({...values, main_skills: e.target.value})
                      }
                  />
                </Grid>

                {/* Presentation Format */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>Presentation Format</FormLabel>
                  <CustomSelect
                      id="presentation_format"
                      value={values.presentation_format}
                      onChange={(e) =>
                          setValues({...values, presentation_format: e.target.value})
                      }
                      fullWidth
                  >
                    <MenuItem value="Online">Online</MenuItem>
                    <MenuItem value="In-person">In-person</MenuItem>
                  </CustomSelect>
                </Grid>

                {/* Duration */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>Duration</FormLabel>
                  <TextField
                      id="duration"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={values.duration}
                      onChange={(e) =>
                          setValues({...values, duration: e.target.value})
                      }
                  />
                </Grid>

                {/* Duration Type */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>Duration Type</FormLabel>
                  <CustomSelect
                      id="duration_type"
                      value={values.duration_type}
                      onChange={(e) =>
                          setValues({...values, duration_type: e.target.value})
                      }
                      fullWidth
                  >
                    <MenuItem value="Days">Days</MenuItem>
                    <MenuItem value="Weeks">Weeks</MenuItem>
                    <MenuItem value="Months">Months</MenuItem>
                  </CustomSelect>
                </Grid>

                {/* Price */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>Price</FormLabel>
                  <TextField
                      id="price"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={values.price}
                      onChange={(e) =>
                          setValues({...values, price: e.target.value})
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

                {/* Month */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>Month</FormLabel>
                  <TextField
                      id="month"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={values.month}
                      onChange={(e) =>
                          setValues({...values, month: e.target.value})
                      }
                  />
                </Grid>

                {/* Week Number */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>Week Number</FormLabel>
                  <TextField
                      id="week_number"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={values.week_number}
                      onChange={(e) =>
                          setValues({...values, week_number: e.target.value})
                      }
                  />
                </Grid>

                {/* From Date */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>From Date</FormLabel>
                  <TextField
                      id="from_date"
                      type="date"
                      variant="outlined"
                      fullWidth
                      value={values.from_date}
                      onChange={(e) =>
                          setValues({...values, from_date: e.target.value})
                      }
                  />
                </Grid>

                {/* To Date */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>To Date</FormLabel>
                  <TextField
                      id="to_date"
                      type="date"
                      variant="outlined"
                      fullWidth
                      value={values.to_date}
                      onChange={(e) =>
                          setValues({...values, to_date: e.target.value})
                      }
                  />
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
          {"Edit Event"}
        </DialogTitle>
        <DialogContent>
          <Box mt={3}>
            <form onSubmit={handleUpdateEvents}>
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

                {/* Category */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>Category</FormLabel>
                  <CustomSelect
                      id="category_id"
                      value={editValues.category_id}
                      onChange={(e) =>
                          setEditValues({ ...editValues, category_id: e.target.value })
                      }
                      fullWidth
                  >
                    {categories.map((category) => (
                        <MenuItem key={category?.id} value={category?.id}>
                          {category?.name}
                        </MenuItem>
                    ))}
                  </CustomSelect>
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

                {/* Objective */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>Objective</FormLabel>
                  <CustomTextField
                      id="objective"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={3}
                      value={editValues.objective}
                      onChange={(e) =>
                          setEditValues({...editValues, objective: e.target.value})
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
                      value={editValues.main_axes}
                      onChange={(e) =>
                          setEditValues({...editValues, main_axes: e.target.value})
                      }
                  />
                </Grid>

                {/* Main Knowledge */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>Main Knowledge</FormLabel>
                  <CustomTextField
                      id="main_knowledge"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={3}
                      value={editValues.main_knowledge}
                      onChange={(e) =>
                          setEditValues({...editValues, main_knowledge: e.target.value})
                      }
                  />
                </Grid>

                {/* Main Skills */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>Main Skills</FormLabel>
                  <CustomTextField
                      id="main_skills"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={3}
                      value={editValues.main_skills}
                      onChange={(e) =>
                          setEditValues({...editValues, main_skills: e.target.value})
                      }
                  />
                </Grid>

                {/* Presentation Format */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>Presentation Format</FormLabel>
                  <CustomSelect
                      id="presentation_format"
                      value={editValues.presentation_format}
                      onChange={(e) =>
                          setEditValues({...editValues, presentation_format: e.target.value})
                      }
                      fullWidth
                  >
                    <MenuItem value="Online">Online</MenuItem>
                    <MenuItem value="In-person">In-person</MenuItem>
                  </CustomSelect>
                </Grid>

                {/* Duration */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>Duration</FormLabel>
                  <TextField
                      id="duration"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={editValues.duration}
                      onChange={(e) =>
                          setEditValues({...editValues, duration: e.target.value})
                      }
                  />
                </Grid>

                {/* Duration Type */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>Duration Type</FormLabel>
                  <CustomSelect
                      id="duration_type"
                      value={editValues.duration_type}
                      onChange={(e) =>
                          setEditValues({...editValues, duration_type: e.target.value})
                      }
                      fullWidth
                  >
                    <MenuItem value="Days">Days</MenuItem>
                    <MenuItem value="Weeks">Weeks</MenuItem>
                    <MenuItem value="Months">Months</MenuItem>
                  </CustomSelect>
                </Grid>

                {/* Price */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>Price</FormLabel>
                  <TextField
                      id="price"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={editValues.price}
                      onChange={(e) =>
                          setEditValues({...editValues, price: e.target.value})
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

                {/* Month */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>Month</FormLabel>
                  <TextField
                      id="month"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={editValues.month}
                      onChange={(e) =>
                          setEditValues({...editValues, month: e.target.value})
                      }
                  />
                </Grid>

                {/* Week Number */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>Week Number</FormLabel>
                  <TextField
                      id="week_number"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={editValues.week_number}
                      onChange={(e) =>
                          setEditValues({...editValues, week_number: e.target.value})
                      }
                  />
                </Grid>

                {/* From Date */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>From Date</FormLabel>
                  <TextField
                      id="from_date"
                      type="date"
                      variant="outlined"
                      fullWidth
                      value={editValues.from_date}
                      onChange={(e) =>
                          setEditValues({...editValues, from_date: e.target.value})
                      }
                  />
                </Grid>

                {/* To Date */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>To Date</FormLabel>
                  <TextField
                      id="to_date"
                      type="date"
                      variant="outlined"
                      fullWidth
                      value={editValues.to_date}
                      onChange={(e) =>
                          setEditValues({...editValues, to_date: e.target.value})
                      }
                  />
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

export default EventsListing;
