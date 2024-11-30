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
  fetchConsultationRequests,
  updateConsultationRequest,
} from "@/store/apps/consultationRequests/ConsultationRequestSlice";
import { IconTrash } from "@tabler/icons-react";
import { ConsultationRequestType } from "@/app/(DashboardLayout)/types/apps/ConsultationRequest";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomSelect from "../../forms/theme-elements/CustomSelect";
import ApiService from "@/services/apiService";
import { IconPencil } from "@tabler/icons-react";
import CustomTable from "@/app/components/shared/CustomTable";
import Loader from "@/app/components/shared/Loader";
import countries from "@/app/components/shared/Countries";
import Image from "next/image";
const ConsultationRequestsListing = ({ toggleModal, onActionButtonClick }) => {
  const rowsHeaderText = ["Id", "Name", "Job Position", "Email","Phone", "Org Status","Org Name",  "Org Type",
    "Establishment Date", "Ownership Type", "Means Type","Headquarter Country","Employees Number",
    "External Offices Number","Annual Budget","Suffers Area"  ];
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


  const handleEditConsultationRequest = async (pageId: number) => {
    try {
      const response = await ApiService(
        "get",
        "/admin/v1/consultation-requests/" + pageId,
        null,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      editConsultationRequest(response.data);
    } catch (e) {
      console.log(e);
    }
  };
  const editConsultationRequest = (consultationRequestRow) => {
    setEditValues({
      id: consultationRequestRow.id,
      status: consultationRequestRow.status,
    });
    setEditModal(!editModal);
  };
  const handleUpdateConsultationRequests = (e: any) => {
    e.preventDefault();
    var payload = {
      id: editValues.id,
      status: editValues.status,
    };
    dispatch(updateConsultationRequest(payload));

    setEditModal(!editModal);
  };

  useEffect(() => {
    dispatch(
      fetchConsultationRequests(page, rowsPerPage, search)
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
        fetchConsultationRequests(newPage, rowsPerPage, search)
    );
  };

  const handleStatusChange = (status: number | null) => {
    // @ts-ignore
    setStatusFilter(status);
    dispatch(fetchConsultationRequests(page, rowsPerPage , search));
  };


  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    dispatch(
        fetchConsultationRequests(
        page,
        parseInt(event.target.value, 10),
        search
      )
    );
  };

  const getVisibleConsultationRequests = (
    consultationRequests: ConsultationRequestType[],
    ConsultationRequestCount: number,
    ConsultationRequestSearch: string,
    perPage: number,
    page: number
  ) => {
    return consultationRequests;
  };
  const handelSearchKey = (consultationRequestSearch: string) => {
    setSearch(consultationRequestSearch);
    dispatch(
        fetchConsultationRequests(page, rowsPerPage, consultationRequestSearch)
    );
  };
  const consultationRequests = useSelector((state) =>
    getVisibleConsultationRequests(
      state.consultationRequestReducer.consultationRequests,
      state.consultationRequestReducer.pageCount,
      state.consultationRequestReducer.consultationRequestSearch,
      rowsPerPage,
      page
    )
  );
  const totalRows = Math.ceil(
    useSelector((state) => state.consultationRequestReducer.pageCount / rowsPerPage)
  );

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - consultationRequests?.length) : 0;


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
      {consultationRequests && consultationRequests.length ? (
        <CustomTable
          rowsHeaderText={rowsHeaderText}
          totalRows={totalRows}
          handleChangePage={handleChangePage}
        >
          {consultationRequests.map((consultationRequest) => (
            <TableRow key={consultationRequest.id} hover>
              <TableCell>{consultationRequest.id}</TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {consultationRequest.name}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {consultationRequest.job_position}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {consultationRequest.email}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {consultationRequest.phone}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {consultationRequest.org_status}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {consultationRequest.org_name}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {consultationRequest.org_type}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {consultationRequest.establishment_date}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {consultationRequest.ownership_type}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {consultationRequest.means_type}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {consultationRequest.headquarter_country}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {consultationRequest.employees_number}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {consultationRequest.external_offices_number}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {consultationRequest.annual_budget}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {consultationRequest.suffers_area}
                  </Typography>
                </Box>
              </TableCell>




              <TableCell align="right">
                <Tooltip title="Edit">
                  <IconButton onClick={(e) => handleEditConsultationRequest(consultationRequest.id)}>
                    <IconPencil size="18" stroke={1.3} />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </CustomTable>
      ) : !consultationRequests ? (
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
            No ConsultationRequests
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
          {"Edit ConsultationRequest"}
        </DialogTitle>
        <DialogContent>
          <Box mt={3}>
            <form onSubmit={handleUpdateConsultationRequests}>
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

export default ConsultationRequestsListing;
