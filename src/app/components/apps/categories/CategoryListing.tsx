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
  fetchCategories,
  DeleteCategory,
  addCategory,
  updateCategory,
  getCategory,
} from "@/store/apps/categories/CategorySlice";
import { IconTrash } from "@tabler/icons-react";
import { PageType } from "@/app/(DashboardLayout)/types/apps/page";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomSelect from "../../forms/theme-elements/CustomSelect";
import ApiService from "@/services/apiService";
import { IconPencil } from "@tabler/icons-react";
import CustomTable from "@/app/components/shared/CustomTable";
import Loader from "@/app/components/shared/Loader";

const CategoryListing = ({ toggleModal, onActionButtonClick }) => {
  const rowsHeaderText = ["Id", "Name"];
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
    name: ""
  });
  const [editValues, setEditValues] = React.useState({
    id: null,
    name: ""
  });

  const handleAddCategory = (e: any) => {
    e.preventDefault();
    var payload = {
      name: values.name,
    };
    dispatch(addCategory(payload));
    onActionButtonClick();
  };
  const handleEditCategory = async (pageId: number) => {
    try {
      const response = await ApiService(
        "get",
        "/admin/v1/categories/" + pageId,
        null,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      editCategory(response.data);
    } catch (e) {
      console.log(e);
    }
  };
  const editCategory = (pageRow) => {
    setEditValues({
      id: pageRow.id,
      name: pageRow.name
    });
    setEditModal(!editModal);
  };
  const handleUpdateCategories = (e: any) => {
    e.preventDefault();
    var payload = {
      id: editValues.id,
      name: editValues.name,

    };
    dispatch(updateCategory(payload));

    setEditModal(!editModal);
  };

  useEffect(() => {
    dispatch(
      fetchCategories(page, rowsPerPage, search)
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
        fetchCategories(newPage, rowsPerPage, search)
    );
  };

  const handleStatusChange = (status: number | null) => {
    // @ts-ignore
    setStatusFilter(status);
    dispatch(fetchCategories(page, rowsPerPage , search));
  };


  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    dispatch(
        fetchCategories(
        page,
        parseInt(event.target.value, 10),
        search
      )
    );
  };
  const getVisiblePages = (
    pages: PageType[],
    pageCount: number,
    pageSearch: string,
    perPage: number,
    page: number
  ) => {
    return pages;
  };
  const handelSearchKey = (categorySearch: string) => {
    setSearch(categorySearch);
    dispatch(
        fetchCategories(page, rowsPerPage, categorySearch)
    );
  };
  const pages = useSelector((state) =>
    getVisiblePages(
      state.categoryReducer.categories,
      state.categoryReducer.pageCount,
      state.categoryReducer.categorySearch,
      rowsPerPage,
      page
    )
  );
  const totalRows = Math.ceil(
    useSelector((state) => state.categoryReducer.pageCount / rowsPerPage)
  );

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - pages?.length) : 0;


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
      {pages && pages.length ? (
        <CustomTable
          rowsHeaderText={rowsHeaderText}
          totalRows={totalRows}
          handleChangePage={handleChangePage}
        >
          {pages.map((page) => (
            <TableRow key={page.id} hover>
              <TableCell>{page.id}</TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {page.name}
                  </Typography>
                </Box>
              </TableCell>

              <TableCell align="right">
                <Tooltip title="Delete Page">
                  <IconButton onClick={() => dispatch(DeleteCategory(page.id))}>
                    <IconTrash size="18" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit">
                  <IconButton onClick={(e) => handleEditCategory(page.id)}>
                    <IconPencil size="18" stroke={1.3} />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </CustomTable>
      ) : !pages ? (
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
            No Categories
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
          {"Add New Category"}
        </DialogTitle>
        <DialogContent>
          <Box mt={3}>
            <form onSubmit={handleAddCategory}>
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
          {"Edit Category"}
        </DialogTitle>
        <DialogContent>
          <Box mt={3}>
            <form onSubmit={handleUpdateCategories}>
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

export default CategoryListing;
