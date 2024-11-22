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
  fetchMemberships,
  DeleteMembership,
  addMembership,
  updateMembership,
  getMembership,
} from "@/store/apps/memberships/MembershipSlice";
import { IconTrash } from "@tabler/icons-react";
import { MembershipType } from "@/app/(DashboardLayout)/types/apps/Membership";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomSelect from "../../forms/theme-elements/CustomSelect";
import ApiService from "@/services/apiService";
import { IconPencil } from "@tabler/icons-react";
import CustomTable from "@/app/components/shared/CustomTable";
import Loader from "@/app/components/shared/Loader";
import countries from "@/app/components/shared/Countries";
import Image from "next/image";
const MembershipsListing = ({ toggleModal, onActionButtonClick }) => {
  const rowsHeaderText = ["Id", "Name", "Type", "Duration","Job", "Nationality","Status",  "Resident Country", "Email", "phone", "Contact Type","Organization Name"];
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


  const handleEditMembership = async (pageId: number) => {
    try {
      const response = await ApiService(
        "get",
        "/admin/v1/memberships/" + pageId,
        null,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      editMembership(response.data);
    } catch (e) {
      console.log(e);
    }
  };
  const editMembership = (membershipRow) => {
    setEditValues({
      id: membershipRow.id,
      status: membershipRow.status,
    });
    setEditModal(!editModal);
  };
  const handleUpdateMemberships = (e: any) => {
    e.preventDefault();
    var payload = {
      id: editValues.id,
      status: editValues.status,
    };
    dispatch(updateMembership(payload));

    setEditModal(!editModal);
  };

  useEffect(() => {
    dispatch(
      fetchMemberships(page, rowsPerPage, search)
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
        fetchMemberships(newPage, rowsPerPage, search)
    );
  };

  const handleStatusChange = (status: number | null) => {
    // @ts-ignore
    setStatusFilter(status);
    dispatch(fetchMemberships(page, rowsPerPage , search));
  };


  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    dispatch(
        fetchMemberships(
        page,
        parseInt(event.target.value, 10),
        search
      )
    );
  };

  const getVisibleMemberships = (
    memberships: MembershipType[],
    MembershipCount: number,
    MembershipSearch: string,
    perPage: number,
    page: number
  ) => {
    return memberships;
  };
  const handelSearchKey = (membershipSearch: string) => {
    setSearch(membershipSearch);
    dispatch(
        fetchMemberships(page, rowsPerPage, membershipSearch)
    );
  };
  const memberships = useSelector((state) =>
    getVisibleMemberships(
      state.membershipReducer.memberships,
      state.membershipReducer.pageCount,
      state.membershipReducer.membershipSearch,
      rowsPerPage,
      page
    )
  );
  const totalRows = Math.ceil(
    useSelector((state) => state.membershipReducer.pageCount / rowsPerPage)
  );

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - memberships?.length) : 0;


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
      {memberships && memberships.length ? (
        <CustomTable
          rowsHeaderText={rowsHeaderText}
          totalRows={totalRows}
          handleChangePage={handleChangePage}
        >
          {memberships.map((membership) => (
            <TableRow key={membership.id} hover>
              <TableCell>{membership.id}</TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {membership.name}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {membership.type}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {membership.duration}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {membership.job}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {membership.nationality}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {membership.status}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {membership.resident_country}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {membership.email}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {membership.phone}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {membership.contact_type}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {membership.organization_name}
                  </Typography>
                </Box>
              </TableCell>



              <TableCell align="right">
                <Tooltip title="Edit">
                  <IconButton onClick={(e) => handleEditMembership(membership.id)}>
                    <IconPencil size="18" stroke={1.3} />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </CustomTable>
      ) : !memberships ? (
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
            No Memberships
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
          {"Edit Membership"}
        </DialogTitle>
        <DialogContent>
          <Box mt={3}>
            <form onSubmit={handleUpdateMemberships}>
              <Grid spacing={3} container>


                {/* Expert ID */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>Expert </FormLabel>
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

export default MembershipsListing;
