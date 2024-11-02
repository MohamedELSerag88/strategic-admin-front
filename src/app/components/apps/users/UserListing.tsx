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
  useTheme,
} from "@mui/material";
import {
  fetchUsers,
  DeleteUser,
  addUser,
  updateUser,
  getUser,
} from "@/store/apps/users/UserSlice";
import { IconTrash } from "@tabler/icons-react";
import { UserType } from "../../../(DashboardLayout)/types/apps/user";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomSelect from "../../forms/theme-elements/CustomSelect";
import ApiService from "@/services/apiService";
import { IconPencil } from "@tabler/icons-react";
import Pagination from "@mui/material/Pagination";
import CustomTable from "@/app/components/shared/CustomTable";
import Loader from "@/app/components/shared/Loader";

const UserListing = () => {
  const rowsHeaderText = ["Id", "Name", "Email", "Clients", "Status"];
  const dispatch = useDispatch();
  const theme = useTheme();
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const [statusFilter, setStatusFilter] = React.useState(-1);
  const [clientIdFilter, setClientIdFilter] = React.useState(-1);
  const [search, setSearch] = React.useState("");
  const [clients, setClients] = React.useState([]);

  const [editModal, setEditModal] = React.useState(false);

  const toggleEdit = () => {
    setEditModal(!editModal);
  };
  const [values, setValues] = React.useState({
    name: "",
    email: "",
    password:"",
    contact_type: "",
    notification: "",
  });
  const [editValues, setEditValues] = React.useState({
    id: null,
    name: "",
    email: "",
    contact_type: "",
    notification: "",
  });

  const handleEditUser = async (userId: number) => {
    try {
      const response = await ApiService(
        "get",
        "/admin/v1/users/" + userId,
        null,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      editUser(response.data);
    } catch (e) {
      console.log(e);
    }
  };
  const editUser = (userRow) => {
    setEditValues({
      id: userRow.id,
      name: userRow.name,
      email: userRow.email,
      contact_type: userRow.contact_type,
      notification: userRow.notification,
    });
    setEditModal(!editModal);
  };
  const handleUpdateUsers = (e: any) => {
    e.preventDefault();
    var payload = {
      id: editValues.id,
      name: editValues.name,
      email: editValues.email,
      contact_type: editValues.contact_type,
      notification: editValues.notification,
    };
    dispatch(updateUser(payload));

    setEditModal(!editModal);
  };

  useEffect(() => {
    dispatch(
      fetchUsers(page, rowsPerPage, statusFilter, clientIdFilter, search)
    );
    const fetchClientsAsync = async () => {
      const data = await ApiService("get", "/admin/v1/dropdown/client", null, {
        Authorization: "Bearer " + localStorage.getItem("token"),
      });
      setClients(data.data);
    };
    fetchClientsAsync();
  }, [dispatch, page, rowsPerPage, statusFilter, clientIdFilter, search]);

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
      fetchUsers(newPage, rowsPerPage, statusFilter, clientIdFilter, search)
    );
  };

  const handleStatusChange = (status: number | null) => {
    setStatusFilter(status);
    dispatch(fetchUsers(page, rowsPerPage, status, clientIdFilter, search));
  };
  const handleRoleChange = (clientId: number) => {
    setClientIdFilter(clientId);
    dispatch(fetchUsers(page, rowsPerPage, statusFilter, clientId, search));
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    dispatch(
      fetchUsers(
        page,
        parseInt(event.target.value, 10),
        statusFilter,
        clientIdFilter,
        search
      )
    );
  };
  const getVisibleUsers = (
    users: UserType[],
    pageCount: number,
    userSearch: string,
    perPage: number,
    page: number
  ) => {
    return users;
  };
  const handelSearchKey = (userSearch: string) => {
    setSearch(userSearch);
    dispatch(
      fetchUsers(page, rowsPerPage, statusFilter, clientIdFilter, userSearch)
    );
  };
  const users = useSelector((state) =>
    getVisibleUsers(
      state.userReducer.users,
      state.userReducer.pageCount,
      state.userReducer.userSearch,
      rowsPerPage,
      page
    )
  );
  const totalRows = Math.ceil(
    useSelector((state) => state.userReducer.pageCount / rowsPerPage)
  );

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users?.length) : 0;


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
      {users && users.length ? (
        <CustomTable
          rowsHeaderText={rowsHeaderText}
          totalRows={totalRows}
          handleChangePage={handleChangePage}
        >
          {users.map((user) => (
            <TableRow key={user.id} hover>
              <TableCell>{user.id}</TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {user.name}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle1">{user.email}</Typography>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {user.contact_type}
                  </Typography>
                </Box>
              </TableCell>

              <TableCell align="right">
                <Tooltip title="Delete User">
                  <IconButton onClick={() => dispatch(DeleteUser(user.id))}>
                    <IconTrash size="18" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit">
                  <IconButton onClick={(e) => handleEditUser(user.id)}>
                    <IconPencil size="18" stroke={1.3} />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </CustomTable>
      ) : !users ? (
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
            No Users
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
          {"Edit User"}
        </DialogTitle>
        <DialogContent>
          <Box mt={3}>
            <form onSubmit={handleUpdateUsers}>
              <Grid spacing={3} container>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Clients</FormLabel>
                  <CustomTextField
                    multiple={true}
                    id="demo-simple-select-client"
                    value={editValues.name}
                    onChange={(e) =>
                      setEditValues({
                        ...editValues,
                        name: e.target.value,
                      })
                    }
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Clients</FormLabel>
                  <CustomTextField
                      id="demo-simple-select-client"
                      value={editValues.email}
                      onChange={(e) =>
                          setEditValues({
                            ...editValues,
                            email: e.target.value,
                          })
                      }
                      fullWidth
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Status</FormLabel>
                  <CustomSelect
                    id="demo-simple-select-client"
                    value={editValues.contact_type}
                    onChange={(e) =>
                      setEditValues({ ...editValues, contact_type: e.target.value })
                    }
                    fullWidth
                  >
                    <MenuItem value={"PHONE"}>Phone</MenuItem>
                    <MenuItem value={"EMAIL"}>Email</MenuItem>
                  </CustomSelect>
                </Grid>
                <Grid item xs={12} lg={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mr: 1 }}
                    type="submit"
                    disabled={
                      editValues.name?.length === 0 ||
                      editValues.email?.length === 0
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

export default UserListing;
