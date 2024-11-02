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
  FormControlLabel,
  Checkbox,
  FormGroup,
} from "@mui/material";
import {
  fetchRoles,
  DeleteRole,
  addRole,
  updateRole,
} from "@/store/apps/roles/RoleSlice";
import { IconTrash } from "@tabler/icons-react";
import { RoleType } from "../../../(DashboardLayout)/types/apps/role";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomSelect from "../../forms/theme-elements/CustomSelect";
import ApiService from "@/services/apiService";
import { IconPencil } from "@tabler/icons-react";
import Pagination from "@mui/material/Pagination";
import CustomTable from "@/app/components/shared/CustomTable";
import Loader from "@/app/components/shared/Loader";

const RoleListing = ({ toggleModal, onActionButtonClick }) => {
  const rowsHeaderText = ["Id", "Name", "Status", "Features"];
  const dispatch = useDispatch();
  const theme = useTheme();
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const [statusFilter, setStatusFilter] = React.useState(-1);
  const [search, setSearch] = React.useState("");

  const [editModal, setEditModal] = React.useState(false);
  const [features, setFeatures] = React.useState([]);

  const toggle = () => {
    onActionButtonClick();
  };
  const toggleEdit = () => {
    setEditModal(!editModal);
  };
  const [values, setValues] = React.useState({
    status: 1,
    features: [],
    name: "",
  });
  const [editValues, setEditValues] = React.useState({
    id: null,
    status: 1,
    features: [],
    name: "",
  });

  const handleAddRoles = (e: any) => {
    e.preventDefault();
    var payload = {
      status: values.status,
      features: values.features,
      name: values.name
    };
    console.log("values: " + JSON.stringify(values));
    dispatch(addRole(payload));
    // setModal(!modal);
  };
  const handleEditRole = async (roleId: number) => {
    try {
      const response = await ApiService(
        "get",
        "/admin/v1/roles/" + roleId,
        null,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      editRole(response.data);
    } catch (e) {
      console.log(e);
    }
  };
  const editRole = (roleRow) => {
    setEditValues({
      id: roleRow.id,
      status: roleRow.status,
      features: roleRow.permissions,
      name: roleRow.name,
    });
    setEditModal(!editModal);
  };
  const handleUpdateRoles = (e: any) => {
    e.preventDefault();
    var payload = {
      id: editValues.id,
      status: editValues.status,
      features: editValues.features,
      name: editValues.name,
    };
    dispatch(updateRole(payload));

    setEditModal(!editModal);
  };

  useEffect(() => {
    dispatch(fetchRoles(page, rowsPerPage, statusFilter, search));
    const fetchFeatureAsync = async () => {
      const data = await ApiService("get", "/admin/v1/dropdown/feature", null, {
        Authorization: "Bearer " + localStorage.getItem("token"),
      });
      setFeatures(data.data);
    };
    fetchFeatureAsync();
  }, [dispatch, page, rowsPerPage, statusFilter, search]);

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
    dispatch(fetchRoles(newPage, rowsPerPage, statusFilter, search));
  };

  const handleStatusChange = (status: number | null) => {
    setStatusFilter(status);
    dispatch(fetchRoles(page, rowsPerPage, status, search));
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    dispatch(
      fetchRoles(page, parseInt(event.target.value, 10), statusFilter, search)
    );
  };
  const getVisibleRoles = (
    roles: RoleType[],
    pageCount: number,
    roleSearch: string,
    perPage: number,
    page: number
  ) => {
    return roles;
  };
  const handelSearchKey = (roleSearch: string) => {
    setSearch(roleSearch);
    dispatch(fetchRoles(page, rowsPerPage, statusFilter, roleSearch));
  };
  const roles = useSelector((state) =>
    getVisibleRoles(
      state.roleReducer.roles,
      state.roleReducer.pageCount,
      state.roleReducer.roleSearch,
      rowsPerPage,
      page
    )
  );
  const totalRows = Math.ceil(
    useSelector((state) => state.roleReducer.pageCount / rowsPerPage) ?? 1
  );

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - roles?.length) : 0;
  const RoleBadge = (role: RoleType) => {
    return role.status === 1
      ? theme.palette.success.light
      : role.status === 0
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
        </Grid>
      </Box>

      {roles && roles.length ? (
        <CustomTable
          rowsHeaderText={rowsHeaderText}
          totalRows={totalRows}
          handleChangePage={handleChangePage}
        >
          {roles.map((role) => (
            <TableRow key={role.id} hover>
              <TableCell>{role.id}</TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {role.name}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Chip
                  sx={{
                    backgroundColor: RoleBadge(role),
                  }}
                  size="small"
                  label={role.status == 1 ? "Active" : "Inactive"}
                />
              </TableCell>
              <TableCell>
                <Typography variant="subtitle1">{role.features}</Typography>
              </TableCell>
              <TableCell align="right">
                <Tooltip title="Delete Role">
                  <IconButton onClick={() => dispatch(DeleteRole(role.id))}>
                    <IconTrash size="18" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit">
                  <IconButton onClick={(e) => handleEditRole(role.id)}>
                    <IconPencil size="18" stroke={1.3} />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </CustomTable>
      ) : !roles ? (
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
            No Plans
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
          {"Add New Role"}
        </DialogTitle>
        <DialogContent>
          <Box mt={3}>
            <form onSubmit={handleAddRoles}>
              <Grid spacing={3} container>
                <Grid item xs={12} lg={6}>
                  <Typography
                    variant="subtitle1"
                    style={{ fontWeight: "bold" }}
                  >
                    Name In English
                  </Typography>
                  <TextField
                    id="nameEn"
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
                  <Typography
                    variant="subtitle1"
                    style={{ fontWeight: "bold" }}
                  >
                    Status
                  </Typography>
                  <CustomSelect
                    id="demo-simple-select-region"
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
                  <Typography
                    variant="subtitle1"
                    style={{ fontWeight: "bold" }}
                  >
                    Features
                  </Typography>
                  {features.map((feature) => (
                    <div key={feature.id}>
                      <Typography
                        variant="subtitle1"
                        style={{ fontWeight: "bold" }}
                      >
                        {feature.name}
                      </Typography>
                      <FormGroup>
                        <FormGroup
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={values.features.some(
                                  (f) => f.id === feature.id && f.has_read === 1
                                )}
                                onChange={(e) => {
                                  const updatedFeatures = [...values.features];
                                  const existingIndex =
                                    updatedFeatures.findIndex(
                                      (f) => f.id === feature.id
                                    );
                                  if (existingIndex !== -1) {
                                    updatedFeatures[existingIndex].has_read = e
                                      .target.checked
                                      ? 1
                                      : 0;
                                  } else {
                                    updatedFeatures.push({
                                      id: feature.id,
                                      has_read: e.target.checked ? 1 : 0,
                                    });
                                  }
                                  setValues({
                                    ...values,
                                    features: updatedFeatures,
                                  });
                                }}
                              />
                            }
                            label="Read"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={values.features.some(
                                  (f) =>
                                    f.id === feature.id && f.has_create === 1
                                )}
                                onChange={(e) => {
                                  const updatedFeatures = [...values.features];
                                  const existingIndex =
                                    updatedFeatures.findIndex(
                                      (f) => f.id === feature.id
                                    );
                                  if (existingIndex !== -1) {
                                    updatedFeatures[existingIndex].has_create =
                                      e.target.checked ? 1 : 0;
                                  } else {
                                    updatedFeatures.push({
                                      id: feature.id,
                                      has_create: e.target.checked ? 1 : 0,
                                    });
                                  }
                                  setValues({
                                    ...values,
                                    features: updatedFeatures,
                                  });
                                }}
                              />
                            }
                            label="Create"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={values.features.some(
                                  (f) =>
                                    f.id === feature.id && f.has_update === 1
                                )}
                                onChange={(e) => {
                                  const updatedFeatures = [...values.features];
                                  const existingIndex =
                                    updatedFeatures.findIndex(
                                      (f) => f.id === feature.id
                                    );
                                  if (existingIndex !== -1) {
                                    updatedFeatures[existingIndex].has_update =
                                      e.target.checked ? 1 : 0;
                                  } else {
                                    updatedFeatures.push({
                                      id: feature.id,
                                      has_update: e.target.checked ? 1 : 0,
                                    });
                                  }
                                  setValues({
                                    ...values,
                                    features: updatedFeatures,
                                  });
                                }}
                              />
                            }
                            label="Update"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={values.features.some(
                                  (f) =>
                                    f.id === feature.id && f.has_delete === 1
                                )}
                                onChange={(e) => {
                                  const updatedFeatures = [...values.features];
                                  const existingIndex =
                                    updatedFeatures.findIndex(
                                      (f) => f.id === feature.id
                                    );
                                  if (existingIndex !== -1) {
                                    updatedFeatures[existingIndex].has_delete =
                                      e.target.checked ? 1 : 0;
                                  } else {
                                    updatedFeatures.push({
                                      id: feature.id,
                                      has_delete: e.target.checked ? 1 : 0,
                                    });
                                  }
                                  setValues({
                                    ...values,
                                    features: updatedFeatures,
                                  });
                                }}
                              />
                            }
                            label="Delete"
                          />
                        </FormGroup>
                      </FormGroup>
                    </div>
                  ))}
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
          {"Edit Role"}
        </DialogTitle>
        <DialogContent>
          <Box mt={3}>
            <form onSubmit={handleUpdateRoles}>
              <Grid spacing={3} container>
                <Grid item xs={12} lg={6}>
                  <Typography
                    variant="subtitle1"
                    style={{ fontWeight: "bold" }}
                  >
                    Name In English
                  </Typography>
                  <TextField
                    id="nameEn"
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
                  <Typography
                    variant="subtitle1"
                    style={{ fontWeight: "bold" }}
                  >
                    Status
                  </Typography>
                  <CustomSelect
                    id="demo-simple-select-region"
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
                  <Typography
                    variant="subtitle1"
                    style={{ fontWeight: "bold" }}
                  >
                    Features
                  </Typography>
                  {features.map((feature) => (
                    <div key={feature.id}>
                      <Typography
                        variant="subtitle1"
                        style={{ fontWeight: "bold" }}
                      >
                        {feature.name}
                      </Typography>
                      <FormGroup>
                        <FormGroup
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={editValues.features.some(
                                  (f) => f.id === feature.id && f.has_read === 1
                                )}
                                onChange={(e) => {
                                  const updatedFeatures = [
                                    ...editValues.features,
                                  ];
                                  const existingIndex =
                                    updatedFeatures.findIndex(
                                      (f) => f.id === feature.id
                                    );
                                  if (existingIndex !== -1) {
                                    updatedFeatures[existingIndex].has_read = e
                                      .target.checked
                                      ? 1
                                      : 0;
                                  } else {
                                    updatedFeatures.push({
                                      id: feature.id,
                                      has_read: e.target.checked ? 1 : 0,
                                    });
                                  }
                                  setEditValues({
                                    ...editValues,
                                    features: updatedFeatures,
                                  });
                                }}
                              />
                            }
                            label="Read"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={editValues.features.some(
                                  (f) =>
                                    f.id === feature.id && f.has_create === 1
                                )}
                                onChange={(e) => {
                                  const updatedFeatures = [
                                    ...editValues.features,
                                  ];
                                  const existingIndex =
                                    updatedFeatures.findIndex(
                                      (f) => f.id === feature.id
                                    );
                                  if (existingIndex !== -1) {
                                    updatedFeatures[existingIndex].has_create =
                                      e.target.checked ? 1 : 0;
                                  } else {
                                    updatedFeatures.push({
                                      id: feature.id,
                                      has_create: e.target.checked ? 1 : 0,
                                    });
                                  }
                                  setEditValues({
                                    ...editValues,
                                    features: updatedFeatures,
                                  });
                                }}
                              />
                            }
                            label="Create"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={editValues.features.some(
                                  (f) =>
                                    f.id === feature.id && f.has_update === 1
                                )}
                                onChange={(e) => {
                                  const updatedFeatures = [
                                    ...editValues.features,
                                  ];
                                  const existingIndex =
                                    updatedFeatures.findIndex(
                                      (f) => f.id === feature.id
                                    );
                                  if (existingIndex !== -1) {
                                    updatedFeatures[existingIndex].has_update =
                                      e.target.checked ? 1 : 0;
                                  } else {
                                    updatedFeatures.push({
                                      id: feature.id,
                                      has_update: e.target.checked ? 1 : 0,
                                    });
                                  }
                                  setEditValues({
                                    ...editValues,
                                    features: updatedFeatures,
                                  });
                                }}
                              />
                            }
                            label="Update"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={editValues.features.some(
                                  (f) =>
                                    f.id === feature.id && f.has_delete === 1
                                )}
                                onChange={(e) => {
                                  const updatedFeatures = [
                                    ...editValues.features,
                                  ];
                                  const existingIndex =
                                    updatedFeatures.findIndex(
                                      (f) => f.id === feature.id
                                    );
                                  if (existingIndex !== -1) {
                                    updatedFeatures[existingIndex].has_delete =
                                      e.target.checked ? 1 : 0;
                                  } else {
                                    updatedFeatures.push({
                                      id: feature.id,
                                      has_delete: e.target.checked ? 1 : 0,
                                    });
                                  }
                                  setEditValues({
                                    ...editValues,
                                    features: updatedFeatures,
                                  });
                                }}
                              />
                            }
                            label="Delete"
                          />
                        </FormGroup>
                      </FormGroup>
                    </div>
                  ))}
                </Grid>
                <Grid item xs={12} lg={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mr: 1 }}
                    type="submit"
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

export default RoleListing;
