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
  fetchEventRequests,
  DeleteEventRequest,
  addEventRequest,
  updateEventRequest,
  getEventRequest,
} from "@/store/apps/eventRequests/EventRequestSlice";
import { IconTrash } from "@tabler/icons-react";
import { EventRequestType } from "@/app/(DashboardLayout)/types/apps/EvenyRequest";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomSelect from "../../forms/theme-elements/CustomSelect";
import ApiService from "@/services/apiService";
import { IconPencil } from "@tabler/icons-react";
import CustomTable from "@/app/components/shared/CustomTable";
import Loader from "@/app/components/shared/Loader";
import countries from "@/app/components/shared/Countries";
import Image from "next/image";
const EventRequestsListing = ({ toggleModal, onActionButtonClick }) => {
  const rowsHeaderText = ["Id", "Name", "Event", "Event Type","Event Presentation", "Job", "Org Type",
    "Phone", "Org Name","Headquarter Country","Event Country","Event Date"  ];
  const dispatch = useDispatch();
  const theme = useTheme();
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const [search, setSearch] = React.useState("");
  const [services, setServices] = React.useState([]);
  const [editModal, setEditModal] = React.useState(false);

  const toggle = () => {
    onActionButtonClick();
  };
  const toggleEdit = () => {
    setEditModal(!editModal);
  };

  const [editValues, setEditValues] = React.useState({
    id: null,
    status : "",

  });


  const handleEditEventRequest = async (pageId: number) => {
    try {
      const response = await ApiService(
        "get",
        "/admin/v1/event-requests/" + pageId,
        null,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      editEventRequest(response.data);
    } catch (e) {
      console.log(e);
    }
  };
  const editEventRequest = (eventRequestRow) => {
    setEditValues({
      id: eventRequestRow.id,
      status: eventRequestRow.status,
    });
    setEditModal(!editModal);
  };
  const handleUpdateEventRequests = (e: any) => {
    e.preventDefault();
    var payload = {
      id: editValues.id,
      status: editValues.status,
    };
    dispatch(updateEventRequest(payload));

    setEditModal(!editModal);
  };

  useEffect(() => {
    dispatch(
      fetchEventRequests(page, rowsPerPage, search)
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
        fetchEventRequests(newPage, rowsPerPage, search)
    );
  };

  const handleStatusChange = (status: number | null) => {
    // @ts-ignore
    setStatusFilter(status);
    dispatch(fetchEventRequests(page, rowsPerPage , search));
  };


  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    dispatch(
        fetchEventRequests(
        page,
        parseInt(event.target.value, 10),
        search
      )
    );
  };

  const getVisibleEventRequests = (
    eventRequests: EventRequestType[],
    EventRequestCount: number,
    EventRequestSearch: string,
    perPage: number,
    page: number
  ) => {
    return eventRequests;
  };
  const handelSearchKey = (eventRequestSearch: string) => {
    setSearch(eventRequestSearch);
    dispatch(
        fetchEventRequests(page, rowsPerPage, eventRequestSearch)
    );
  };
  const eventRequests = useSelector((state) =>
    getVisibleEventRequests(
      state.eventRequestReducer.eventRequests,
      state.eventRequestReducer.pageCount,
      state.eventRequestReducer.eventRequestSearch,
      rowsPerPage,
      page
    )
  );
  const totalRows = Math.ceil(
    useSelector((state) => state.eventRequestReducer.pageCount / rowsPerPage)
  );

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - eventRequests?.length) : 0;


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
      {eventRequests && eventRequests.length ? (
        <CustomTable
          rowsHeaderText={rowsHeaderText}
          totalRows={totalRows}
          handleChangePage={handleChangePage}
        >
          {eventRequests.map((eventRequest) => (
            <TableRow key={eventRequest.id} hover>
              <TableCell>{eventRequest.id}</TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {eventRequest.name}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {eventRequest.event?.name}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {eventRequest.event_type}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {eventRequest.event_presentation}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {eventRequest.job}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {eventRequest.org_type}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {eventRequest.phone}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {eventRequest.org_name}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {eventRequest.headquarter_country}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {eventRequest.event_country}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {eventRequest.event_date}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell align="right">
                <Tooltip title="Edit">
                  <IconButton onClick={(e) => handleEditEventRequest(eventRequest.id)}>
                    <IconPencil size="18" stroke={1.3} />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </CustomTable>
      ) : !eventRequests ? (
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
            No EventRequests
          </Typography>
        </TableBody>
      )}
      <Dialog
          open={editModal}
          onClose={toggleEdit}
          maxWidth="sm"
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" variant="h5">
          {"Edit EventRequest"}
        </DialogTitle>
        <DialogContent>
          <Box mt={3}>
            <form onSubmit={handleUpdateEventRequests}>
              <Grid spacing={3} container>


                {/* Expert ID */}
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
                        <MenuItem key="Pending" value="pending">Pending</MenuItem>
                        <MenuItem key="Pending" value="approved">Approved</MenuItem>
                        <MenuItem key="Pending" value="rejected">Rejected</MenuItem>
                  </CustomSelect>
                </Grid>

                {/* Submit and Cancel Buttons */}
                <Grid item xs={12} lg={12}>
                  <Button
                      variant="contained"
                      color="primary"
                      sx={{mr: 1}}
                      type="submit"
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

export default EventRequestsListing;
