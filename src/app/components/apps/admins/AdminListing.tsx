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
  fetchAdmins,
  DeleteAdmin,
  addAdmin,
  updateAdmin,
  getAdmin,
} from "@/store/apps/admins/AdminSlice";
import { IconTrash } from "@tabler/icons-react";
import { AdminType } from "../../../(DashboardLayout)/types/apps/admin";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomSelect from "../../forms/theme-elements/CustomSelect";
import ApiService from "@/services/apiService";
import { IconPencil } from "@tabler/icons-react";
import CustomTable from "@/app/components/shared/CustomTable";
import Loader from "@/app/components/shared/Loader";

const AdminListing = ({ toggleModal, onActionButtonClick }) => {
  const rowsHeaderText = ["Id", "Name", "Email", "Role", "Status"];
  const dispatch = useDispatch();
  const theme = useTheme();
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const [statusFilter, setStatusFilter] = React.useState(-1);
  const [roleIdFilter, setRoleIdFilter] = React.useState(-1);
  const [search, setSearch] = React.useState("");
  const [roles, setRoles] = React.useState([]);

  const [editModal, setEditModal] = React.useState(false);

  const toggle = () => {
    onActionButtonClick();
  };
  const toggleEdit = () => {
    setEditModal(!editModal);
  };
  const [values, setValues] = React.useState({
    name: "",
    email: "",
    password: null,
    role_id: null,
    status: 1,
  });
  const [editValues, setEditValues] = React.useState({
    id: null,
    name: "",
    email: "",
    password: null,
    role_id: null,
    status: 1,
  });

  const handleAddAdmins = (e: any) => {
    e.preventDefault();
    var payload = {
      role_id: values.role_id,
      status: values.status,
      name: values.name,
      email: values.email,
      password: values.password,
    };
    dispatch(addAdmin(payload));
    onActionButtonClick();
  };
  const handleEditAdmin = async (adminId: number) => {
    try {
      const response = await ApiService(
        "get",
        "/admin/v1/admins/" + adminId,
        null,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      editAdmin(response.data);
    } catch (e) {
      console.log(e);
    }
  };
  const editAdmin = (adminRow) => {
    setEditValues({
      id: adminRow.id,
      role_id: adminRow.role?.id,
      status: adminRow.status,
      name: adminRow.name,
      email: adminRow.email,
      password: adminRow.password,
    });
    setEditModal(!editModal);
  };
  const handleUpdateAdmins = (e: any) => {
    e.preventDefault();
    var payload = {
      id: editValues.id,
      role_id: editValues.role_id,
      status: editValues.status,
      name: editValues.name,
      email: editValues.email,
      password: editValues.password,
    };
    dispatch(updateAdmin(payload));

    setEditModal(!editModal);
  };

  useEffect(() => {
    dispatch(
      fetchAdmins(page, rowsPerPage, statusFilter, roleIdFilter, search)
    );
    const fetchClientsAsync = async () => {
      const data = await ApiService("get", "/admin/v1/dropdown/role", null, {
        Authorization: "Bearer " + localStorage.getItem("token"),
      });
      setRoles(data.data);
    };
    fetchClientsAsync();
  }, [dispatch, page, rowsPerPage, statusFilter, roleIdFilter, search]);

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
      fetchAdmins(newPage, rowsPerPage, statusFilter, roleIdFilter, search)
    );
  };

  const handleStatusChange = (status: number | null) => {
    // @ts-ignore
    setStatusFilter(status);
    dispatch(fetchAdmins(page, rowsPerPage, status, roleIdFilter, search));
  };
  const handleRoleChange = (roleId: number) => {
    setRoleIdFilter(roleId);
    dispatch(fetchAdmins(page, rowsPerPage, statusFilter, roleId, search));
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    dispatch(
      fetchAdmins(
        page,
        parseInt(event.target.value, 10),
        statusFilter,
        roleIdFilter,
        search
      )
    );
  };
  const getVisibleAdmins = (
    admins: AdminType[],
    pageCount: number,
    adminSearch: string,
    perPage: number,
    page: number
  ) => {
    return admins;
  };
  const handelSearchKey = (adminSearch: string) => {
    setSearch(adminSearch);
    dispatch(
      fetchAdmins(page, rowsPerPage, statusFilter, roleIdFilter, adminSearch)
    );
  };
  const admins = useSelector((state) =>
    getVisibleAdmins(
      state.adminReducer.admins,
      state.adminReducer.pageCount,
      state.adminReducer.adminSearch,
      rowsPerPage,
      page
    )
  );
  const totalRows = Math.ceil(
    useSelector((state) => state.adminReducer.pageCount / rowsPerPage)
  );

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - admins?.length) : 0;
  const AdminBadge = (admin: AdminType) => {
    return admin.status === 1
      ? theme.palette.success.light
      : admin.status === 0
      ? theme.palette.error.light
      : "primary";
  };

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
          <Grid item xs={12} sm={6} md={4} sx={{ pt: "0 !important" }}>
            <CustomFormLabel
              id="demo-simple-select-label"
              htmlFor="demo-simple-select-label"
            >
              Select Status
            </CustomFormLabel>
            <CustomSelect
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value)}
              fullWidth
            >
              <MenuItem value={-1}>Select Status</MenuItem>
              <MenuItem value={1}>Active</MenuItem>
              <MenuItem value={0}>Inactive</MenuItem>
            </CustomSelect>
          </Grid>
          <Grid item xs={12} sm={6} md={4} sx={{ pt: "0 !important" }}>
            <CustomFormLabel
              id="demo-simple-select-client"
              htmlFor="demo-simple-select-client"
            >
              Select Client
            </CustomFormLabel>
            <CustomSelect
              labelId="demo-simple-select-client"
              id="demo-simple-select-client"
              value={roleIdFilter}
              onChange={(e) => handleRoleChange(e.target.value)}
              fullWidth
            >
              <MenuItem value={-1}>Select Role</MenuItem>
              {roles.map((role) => (
                <MenuItem key={role?.id} value={role?.id}>
                  {role?.name}
                </MenuItem>
              ))}
            </CustomSelect>
          </Grid>
        </Grid>
      </Box>
      {admins && admins.length ? (
        <CustomTable
          rowsHeaderText={rowsHeaderText}
          totalRows={totalRows}
          handleChangePage={handleChangePage}
        >
          {admins.map((admin) => (
            <TableRow key={admin.id} hover>
              <TableCell>{admin.id}</TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {admin.name}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle1">{admin.email}</Typography>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {admin.role?.name}
                  </Typography>
                </Box>
              </TableCell>

              <TableCell>
                <Chip
                  sx={{
                    backgroundColor: AdminBadge(admin),
                  }}
                  size="small"
                  label={admin.status === 1 ? "Active" : "Inactive"}
                />
              </TableCell>

              <TableCell align="right">
                <Tooltip title="Delete Admin">
                  <IconButton onClick={() => dispatch(DeleteAdmin(admin.id))}>
                    <IconTrash size="18" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit">
                  <IconButton onClick={(e) => handleEditAdmin(admin.id)}>
                    <IconPencil size="18" stroke={1.3} />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </CustomTable>
      ) : !admins ? (
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
            No Admins
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
          {"Add New Admin"}
        </DialogTitle>
        <DialogContent>
          <Box mt={3}>
            <form onSubmit={handleAddAdmins}>
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
                  <FormLabel>Password</FormLabel>
                  <TextField
                    id="password"
                    type="password"
                    size="small"
                    variant="outlined"
                    fullWidth
                    value={values.password}
                    onChange={(e) =>
                      setValues({ ...values, password: e.target.value })
                    }
                  />
                </Grid>

                <Grid item xs={12} lg={6}>
                  <FormLabel>Role</FormLabel>
                  <CustomSelect
                    id="demo-simple-select-client"
                    value={values.role_id}
                    onChange={(e) =>
                      setValues({ ...values, role_id: e.target.value })
                    }
                    fullWidth
                  >
                    {roles.map((role) => (
                      <MenuItem key={role?.id} value={role?.id}>
                        {role?.name}
                      </MenuItem>
                    ))}
                  </CustomSelect>
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Status</FormLabel>
                  <CustomSelect
                    id="demo-simple-select-client"
                    value={values.status}
                    onChange={(e) =>
                      setValues({ ...values, status: e.target.value })
                    }
                    fullWidth
                  >
                    <MenuItem value={1}>Active</MenuItem>
                    <MenuItem value={0}>Inactive</MenuItem>
                  </CustomSelect>
                </Grid>
                <Grid item xs={12} lg={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mr: 1 }}
                    type="submit"
                    disabled={
                      values.name.length === 0 ||
                      values.email.length === 0 ||
                      values.password.length === 0
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
          {"Edit Admin"}
        </DialogTitle>
        <DialogContent>
          <Box mt={3}>
            <form onSubmit={handleUpdateAdmins}>
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
                  <FormLabel>Password</FormLabel>
                  <TextField
                    id="password"
                    type="password"
                    size="small"
                    variant="outlined"
                    fullWidth
                    value={editValues.password}
                    onChange={(e) =>
                      setEditValues({ ...editValues, password: e.target.value })
                    }
                  />
                </Grid>

                <Grid item xs={12} lg={6}>
                  <FormLabel>Role</FormLabel>
                  <CustomSelect
                    id="demo-simple-select-client"
                    value={editValues.role_id}
                    onChange={(e) =>
                      setEditValues({ ...editValues, role_id: e.target.value })
                    }
                    fullWidth
                  >
                    {roles.map((role) => (
                      <MenuItem key={role?.id} value={role?.id}>
                        {role?.name}
                      </MenuItem>
                    ))}
                  </CustomSelect>
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Status</FormLabel>
                  <CustomSelect
                    id="demo-simple-select-client"
                    value={editValues.status}
                    onChange={(e) =>
                      setEditValues({ ...editValues, status: e.target.value })
                    }
                    fullWidth
                  >
                    <MenuItem value={1}>Active</MenuItem>
                    <MenuItem value={0}>Inactive</MenuItem>
                  </CustomSelect>
                </Grid>
                <Grid item xs={12} lg={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mr: 1 }}
                    type="submit"
                    disabled={
                      editValues.name.length === 0 ||
                      editValues.email.length === 0
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

export default AdminListing;
