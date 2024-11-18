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
  fetchForums,
  DeleteForum,
  addForum,
  updateForum,
  getForum,
} from "@/store/apps/forums/ForumSlice";
import { IconTrash } from "@tabler/icons-react";
import { ForumType } from "@/app/(DashboardLayout)/types/apps/Forum";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomSelect from "../../forms/theme-elements/CustomSelect";
import ApiService from "@/services/apiService";
import { IconPencil } from "@tabler/icons-react";
import CustomTable from "@/app/components/shared/CustomTable";
import Loader from "@/app/components/shared/Loader";
import countries from "@/app/components/shared/Countries";
import Image from "next/image";

const ForumsListing = ({ toggleModal, onActionButtonClick }) => {
  const rowsHeaderText = ["Id", "Title", "Subject", "Domain", "Start Date" ,"End Date"];
  const dispatch = useDispatch();
  const theme = useTheme();
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const [search, setSearch] = React.useState("");
  const [categories, setCategories] = React.useState([]);
  const [relatedForums, setRelatedForums] = React.useState([]);
  const [services, setServices] = React.useState([]);
  const [editModal, setEditModal] = React.useState(false);

  const toggle = () => {
    onActionButtonClick();
  };
  const toggleEdit = () => {
    setEditModal(!editModal);
  };
  const [values, setValues] = React.useState({

    title : "",
    subject : "",
    domain: "",
    start_date: "",
    end_date: "",
    forum_ids : [],
    serviceable_data :[]
  });
  const [editValues, setEditValues] = React.useState({
    id: null,
    title : "",
    subject : "",
    domain: "",
    start_date: "",
    end_date: "",
    forum_ids : [],
    serviceable_data :[]
  });

  const handleAddForum = (e: any) => {
    e.preventDefault();
    var payload = {
      title : values.title,
      subject : values.subject,
      domain : values.domain,
      start_date: values.start_date,
      end_date: values.end_date,
      forum_ids : values.forum_ids,
      serviceable_data : values.serviceable_data,
    };
    dispatch(addForum(payload));
    onActionButtonClick();
  };
  const handleEditForum = async (pageId: number) => {
    try {
      const response = await ApiService(
        "get",
        "/admin/v1/discussion_forums/" + pageId,
        null,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      editForum(response.data);
    } catch (e) {
      console.log(e);
    }
  };
  const editForum = (forumRow) => {
    setEditValues({
      id: forumRow.id,
      title : forumRow.title,
      subject : forumRow.subject,
      domain : forumRow.domain,
      start_date: forumRow.start_date,
      end_date: forumRow.end_date,
      forum_ids : forumRow.forum_ids,
      serviceable_data : forumRow.related_services,
    });
    setEditModal(!editModal);
  };
  const handleUpdateForums = (e: any) => {
    e.preventDefault();
    var payload = {
      id: editValues.id,
      title : editValues.title,
      subject : editValues.subject,
      domain : editValues.domain,
      start_date: editValues.start_date,
      end_date: editValues.end_date,
      forum_ids : editValues.forum_ids,
      serviceable_data : editValues.serviceable_data,
    };
    dispatch(updateForum(payload));

    setEditModal(!editModal);
  };

  useEffect(() => {
    dispatch(
      fetchForums(page, rowsPerPage, search)
    );


    const fetchForumsAsync = async () => {
      const data = await ApiService("get", "/admin/v1/dropdown/DiscussionForum", null, {
        Authorization: "Bearer " + localStorage.getItem("token"),
      });
      setRelatedForums(data.data);
    };
    const fetchServicesAsync = async () => {
      const data = await ApiService("get", "/admin/v1/serviceable", null, {
        Authorization: "Bearer " + localStorage.getItem("token"),
      });
      setServices(data.data);
    };
    fetchServicesAsync();
    fetchForumsAsync();

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
        fetchForums(newPage, rowsPerPage, search)
    );
  };

  const handleStatusChange = (status: number | null) => {
    // @ts-ignore
    setStatusFilter(status);
    dispatch(fetchForums(page, rowsPerPage , search));
  };


  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    dispatch(
        fetchForums(
        page,
        parseInt(event.target.value, 10),
        search
      )
    );
  };

  const getVisibleForums = (
    forums: ForumType[],
    ForumCount: number,
    ForumSearch: string,
    perPage: number,
    page: number
  ) => {
    return forums;
  };
  const handelSearchKey = (forumSearch: string) => {
    setSearch(forumSearch);
    dispatch(
        fetchForums(page, rowsPerPage, forumSearch)
    );
  };
  const forums = useSelector((state) =>
    getVisibleForums(
      state.forumReducer.forums,
      state.forumReducer.pageCount,
      state.forumReducer.forumSearch,
      rowsPerPage,
      page
    )
  );
  const totalRows = Math.ceil(
    useSelector((state) => state.forumReducer.pageCount / rowsPerPage)
  );

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - forums?.length) : 0;


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
      {forums && forums.length ? (
        <CustomTable
          rowsHeaderText={rowsHeaderText}
          totalRows={totalRows}
          handleChangePage={handleChangePage}
        >
          {forums.map((forum) => (
            <TableRow key={forum.id} hover>
              <TableCell>{forum.id}</TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {forum.title}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {forum.subject}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {forum.domain}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {forum.start_date}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {forum.end_date}
                  </Typography>
                </Box>
              </TableCell>



              <TableCell align="right">
                <Tooltip title="Delete Page">
                  <IconButton onClick={() => dispatch(DeleteForum(forum.id))}>
                    <IconTrash size="18" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit">
                  <IconButton onClick={(e) => handleEditForum(forum.id)}>
                    <IconPencil size="18" stroke={1.3} />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </CustomTable>
      ) : !forums ? (
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
            No Forums
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
          {"Add New Forum"}
        </DialogTitle>
        <DialogContent>
          <Box mt={3}>
            <form onSubmit={handleAddForum}>
              <Grid spacing={3} container>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Title</FormLabel>
                  <TextField
                      id="subject"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={values.title}
                      onChange={(e) => setValues({ ...values, title: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Subject</FormLabel>
                  <TextField
                      id="subject"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={values.subject}
                      onChange={(e) => setValues({ ...values, subject: e.target.value })}
                  />
                </Grid>

                {/* Domain */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>Domain</FormLabel>
                  <TextField
                      id="domain"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={values.domain}
                      onChange={(e) => setValues({ ...values, domain: e.target.value })}
                  />
                </Grid>



                {/* Start Date */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>Start Date</FormLabel>
                  <TextField
                      id="start_date"
                      type="date"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={values.start_date}
                      onChange={(e) => setValues({ ...values, start_date: e.target.value })}
                  />
                </Grid>

                {/* End Date */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>End Date</FormLabel>
                  <TextField
                      id="end_date"
                      type="date"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={values.end_date}
                      onChange={(e) => setValues({ ...values, end_date: e.target.value })}
                  />
                </Grid>

                {/* Related Forums */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>Related Forums </FormLabel>
                  <CustomSelect
                      id="forum_ids"
                      multiple
                      value={values.forum_ids}
                      onChange={(e) =>
                          setValues({ ...values, forum_ids: e.target.value })
                      }
                      fullWidth
                  >
                    {relatedForums.map((relatedForum) => (
                        <MenuItem key={relatedForum?.id} value={relatedForum?.id}>
                          {relatedForum?.name}
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
          {"Edit Forum"}
        </DialogTitle>
        <DialogContent>
          <Box mt={3}>
            <form onSubmit={handleUpdateForums}>
              <Grid spacing={3} container>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Title</FormLabel>
                  <TextField
                      id="subject"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={editValues.title}
                      onChange={(e) => setEditValues({ ...editValues, title: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Subject</FormLabel>
                  <TextField
                      id="subject"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={editValues.subject}
                      onChange={(e) => setEditValues({ ...editValues, subject: e.target.value })}
                  />
                </Grid>

                {/* Domain */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>Domain</FormLabel>
                  <TextField
                      id="domain"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={editValues.domain}
                      onChange={(e) => setEditValues({ ...editValues, domain: e.target.value })}
                  />
                </Grid>

                {/* Start Date */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>Start Date</FormLabel>
                  <TextField
                      id="start_date"
                      type="date"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={editValues.start_date}
                      onChange={(e) => setEditValues({ ...editValues, start_date: e.target.value })}
                  />
                </Grid>

                {/* End Date */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>End Date</FormLabel>
                  <TextField
                      id="end_date"
                      type="date"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={editValues.end_date}
                      onChange={(e) => setEditValues({ ...editValues, end_date: e.target.value })}
                  />
                </Grid>

                {/* Related Forums */}
                <Grid item xs={12} lg={6}>
                  <FormLabel>Related Forums </FormLabel>
                  <CustomSelect
                      id="forum_ids"
                      multiple
                      value={editValues.forum_ids}
                      onChange={(e) =>
                          setEditValues({ ...editValues, forum_ids: e.target.value })
                      }
                      fullWidth
                  >
                    {relatedForums.map((relatedForum) => (
                        <MenuItem key={relatedForum?.id} value={relatedForum?.id}>
                          {relatedForum?.name}
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

export default ForumsListing;
