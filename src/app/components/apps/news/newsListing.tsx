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
  fetchNews,
  DeleteNews,
  addNews,
  updateNews,
  getNews,
} from "@/store/apps/news/NewsSlice";
import { IconTrash } from "@tabler/icons-react";
import { NewsType } from "@/app/(DashboardLayout)/types/apps/News";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomSelect from "../../forms/theme-elements/CustomSelect";
import ApiService from "@/services/apiService";
import { IconPencil } from "@tabler/icons-react";
import CustomTable from "@/app/components/shared/CustomTable";
import Loader from "@/app/components/shared/Loader";
import Image from "next/image";
const NewsListing = ({ toggleModal, onActionButtonClick }) => {
  const rowsHeaderText = ["Id", "Title", "Field", "Editor Name" ,"Publication Date"];
  const dispatch = useDispatch();
  const theme = useTheme();
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const [search, setSearch] = React.useState("");
  const [relatedNews, setRelatedNews] = React.useState([]);
  const [editModal, setEditModal] = React.useState(false);

  const toggle = () => {
    onActionButtonClick();
  };
  const toggleEdit = () => {
    setEditModal(!editModal);
  };
  const [values, setValues] = React.useState({
    field : "" ,
    date : "" ,
    title : "" ,
    publication_date : "" ,
    summary : "" ,
    text : "" ,
    keywords : "" ,
    main_image : "",
    side_image : "" ,
    editor_name :"" ,
    editing_date : "" ,
    relatedNews_id : [],
  });
  const [editValues, setEditValues] = React.useState({
    id: null,
    field : "" ,
    date : "" ,
    title : "" ,
    publication_date : "" ,
    summary : "" ,
    text : "" ,
    keywords : "" ,
    main_image : "",
    side_image : "" ,
    editor_name :"" ,
    editing_date : "" ,
    relatedNews_id : [],
  });

  const handleUpoadMainImage = async (fileInput) => {
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
      setEditValues({ ...editValues, main_image: imageUrl });
      setValues({ ...values, main_image: imageUrl });
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleUpoadSideImage = async (fileInput) => {
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
      setEditValues({ ...editValues, side_image: imageUrl });
      setValues({ ...values, side_image: imageUrl });
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  const handleAddNews = (e: any) => {
    e.preventDefault();
    var payload = {
      field : values.field,
      date :values.date,
      title :values.title,
      publication_date : values.publication_date,
      summary : values.summary,
      text : values.text,
      keywords : values.keywords,
      main_image : values.main_image,
      side_image : values.side_image,
      editor_name :values.editor_name,
      editing_date : values.editing_date,
      relatedNews_id : values.relatedNews_id,
    };
    dispatch(addNews(payload));
    onActionButtonClick();
  };
  const handleEditNews = async (itemId: number) => {
    try {
      const response = await ApiService(
        "get",
        "/admin/v1/news/" + itemId,
        null,
        {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      );
      editNews(response.data);
    } catch (e) {
      console.log(e);
    }
  };
  const editNews = (newRow) => {
    setEditValues({
      id: newRow.id,
      field : newRow.field,
      date :newRow.date,
      title :newRow.title,
      publication_date : newRow.publication_date,
      summary : newRow.summary,
      text : newRow.text,
      keywords : newRow.keywords,
      main_image : newRow.main_image,
      side_image : newRow.side_image,
      editor_name :newRow.editor_name,
      editing_date : newRow.editing_date,
      relatedNews_id : newRow.relatedNews_id,
    });
    setEditModal(!editModal);
  };
  const handleUpdateNews = (e: any) => {
    e.preventDefault();
    var payload = {
      id: editValues.id,
      field : editValues.field,
      date :editValues.date,
      title :editValues.title,
      publication_date : editValues.publication_date,
      summary : editValues.summary,
      text : editValues.text,
      keywords : editValues.keywords,
      main_image : editValues.main_image,
      side_image : editValues.side_image,
      editor_name :editValues.editor_name,
      editing_date : editValues.editing_date,
      relatedNews_id : editValues.relatedNews_id,
    };
    dispatch(updateNews(payload));

    setEditModal(!editModal);
  };

  useEffect(() => {
    dispatch(
      fetchNews(page, rowsPerPage, search)
    );
    const fetchNewsAsync = async () => {
      const data = await ApiService("get", "/admin/v1/dropdown/news", null, {
        Authorization: "Bearer " + localStorage.getItem("token"),
      });
      setRelatedNews(data.data);
    };
    fetchNewsAsync();

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
        fetchNews(newPage, rowsPerPage, search)
    );
  };

  const handleStatusChange = (status: number | null) => {
    // @ts-ignore
    setStatusFilter(status);
    dispatch(fetchNews(page, rowsPerPage , search));
  };


  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    dispatch(
        fetchNews(
        page,
        parseInt(event.target.value, 10),
        search
      )
    );
  };
  const getVisibleNews = (
    news: NewsType[],
    NewsCount: number,
    NewsSearch: string,
    perPage: number,
    page: number
  ) => {
    return news;
  };
  const handelSearchKey = (newSearch: string) => {
    setSearch(newSearch);
    dispatch(
        fetchNews(page, rowsPerPage, newSearch)
    );
  };
  const news = useSelector((state) =>
    getVisibleNews(
      state.newsReducer.news,
      state.newsReducer.pageCount,
      state.newsReducer.newsSearch,
      rowsPerPage,
      page
    )
  );
  const totalRows = Math.ceil(
    useSelector((state) => state.newsReducer.pageCount / rowsPerPage)
  );

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - news?.length) : 0;


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
      {news && news.length ? (
        <CustomTable
          rowsHeaderText={rowsHeaderText}
          totalRows={totalRows}
          handleChangePage={handleChangePage}
        >
          {news.map((newItem) => (
            <TableRow key={newItem.id} hover>
              <TableCell>{newItem.id}</TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {newItem.title}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {newItem.field}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {newItem.editor_name}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {newItem.publication_date}
                  </Typography>
                </Box>
              </TableCell>


              <TableCell align="right">
                <Tooltip title="Delete Page">
                  <IconButton onClick={() => dispatch(DeleteNews(newItem.id))}>
                    <IconTrash size="18" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit">
                  <IconButton onClick={(e) => handleEditNews(newItem.id)}>
                    <IconPencil size="18" stroke={1.3} />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </CustomTable>
      ) : !news ? (
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
            No News
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
          {"Add New News"}
        </DialogTitle>
        <DialogContent>
          <Box mt={3}>
            <form onSubmit={handleAddNews}>
              <Grid spacing={3} container>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Field</FormLabel>
                  <TextField
                      id="field"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={values.field}
                      onChange={(e) => setValues({...values, field: e.target.value})}
                  />
                </Grid>

                <Grid item xs={12} lg={6}>
                  <FormLabel>Date</FormLabel>
                  <TextField
                      id="date"
                      type="date"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={values.date}
                      onChange={(e) => setValues({...values, date: e.target.value})}
                  />
                </Grid>

                <Grid item xs={12} lg={6}>
                  <FormLabel>Title</FormLabel>
                  <TextField
                      id="title"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={values.title}
                      onChange={(e) => setValues({...values, title: e.target.value})}
                  />
                </Grid>

                <Grid item xs={12} lg={6}>
                  <FormLabel>Publication Date</FormLabel>
                  <TextField
                      id="publication_date"
                      type="date"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={values.publication_date}
                      onChange={(e) => setValues({...values, publication_date: e.target.value})}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormLabel>Summary</FormLabel>
                  <TextField
                      id="summary"
                      size="small"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={3}
                      value={values.summary}
                      onChange={(e) => setValues({...values, summary: e.target.value})}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormLabel>Text</FormLabel>
                  <TextField
                      id="text"
                      size="small"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={6}
                      value={values.text}
                      onChange={(e) => setValues({...values, text: e.target.value})}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormLabel>Keywords</FormLabel>
                  <TextField
                      id="keywords"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={values.keywords}
                      onChange={(e) => setValues({...values, keywords: e.target.value})}
                  />
                </Grid>

                <Grid item xs={12} lg={6}>
                  <FormLabel>Main Image</FormLabel>
                  <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleUpoadMainImage(e.target)}
                  />
                  {values.main_image && (
                      <Image
                          src={values.main_image}
                          alt="Selected"
                          width={400}
                          height={400}
                          style={{ width: "100%", marginTop: "10px" }}
                      />
                  )}
                </Grid>

                <Grid item xs={12} lg={6}>
                  <FormLabel>Side Image</FormLabel>
                  <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleUpoadSideImage(e.target)}
                  />
                  {values.side_image && (
                      <Image
                          src={values.side_image}
                          alt="Selected"
                          width={400}
                          height={400}
                          style={{ width: "100%", marginTop: "10px" }}
                      />
                  )}
                </Grid>

                <Grid item xs={12} lg={6}>
                  <FormLabel>Editor Name</FormLabel>
                  <TextField
                      id="editor_name"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={values.editor_name}
                      onChange={(e) => setValues({...values, editor_name: e.target.value})}
                  />
                </Grid>

                <Grid item xs={12} lg={6}>
                  <FormLabel>Editing Date</FormLabel>
                  <TextField
                      id="editing_date"
                      type="date"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={values.editing_date}
                      onChange={(e) => setValues({...values, editing_date: e.target.value})}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormLabel>Related News</FormLabel>
                  <CustomSelect
                      id="relatedNews_id"
                      multiple
                      value={values.relatedNews_id}
                      onChange={(e) => setValues({...values, relatedNews_id: e.target.value})}
                      fullWidth
                  >
                    {relatedNews.map((related) => (
                        <MenuItem key={related?.id} value={related?.id}>
                          {related?.name}
                        </MenuItem>
                    ))}
                  </CustomSelect>
                </Grid>

                <Grid item xs={12}>
                  <Button
                      variant="contained"
                      color="primary"
                      sx={{mr: 1}}
                      type="submit"
                      disabled={values.title.length === 0}
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
          {"Edit News"}
        </DialogTitle>
        <DialogContent>
          <Box mt={3}>
            <form onSubmit={handleUpdateNews}>
              <Grid spacing={3} container>
                <Grid item xs={12} lg={6}>
                  <FormLabel>Field</FormLabel>
                  <TextField
                      id="field"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={editValues.field}
                      onChange={(e) => setEditValues({...editValues, field: e.target.value})}
                  />
                </Grid>

                <Grid item xs={12} lg={6}>
                  <FormLabel>Date</FormLabel>
                  <TextField
                      id="date"
                      type="date"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={editValues.date}
                      onChange={(e) => setEditValues({...editValues, date: e.target.value})}
                  />
                </Grid>

                <Grid item xs={12} lg={6}>
                  <FormLabel>Title</FormLabel>
                  <TextField
                      id="title"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={editValues.title}
                      onChange={(e) => setEditValues({...editValues, title: e.target.value})}
                  />
                </Grid>

                <Grid item xs={12} lg={6}>
                  <FormLabel>Publication Date</FormLabel>
                  <TextField
                      id="publication_date"
                      type="date"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={editValues.publication_date}
                      onChange={(e) => setEditValues({...editValues, publication_date: e.target.value})}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormLabel>Summary</FormLabel>
                  <TextField
                      id="summary"
                      size="small"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={3}
                      value={editValues.summary}
                      onChange={(e) => setEditValues({...editValues, summary: e.target.value})}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormLabel>Text</FormLabel>
                  <TextField
                      id="text"
                      size="small"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={6}
                      value={editValues.text}
                      onChange={(e) => setEditValues({...editValues, text: e.target.value})}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormLabel>Keywords</FormLabel>
                  <TextField
                      id="keywords"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={editValues.keywords}
                      onChange={(e) => setEditValues({...editValues, keywords: e.target.value})}
                  />
                </Grid>

                <Grid item xs={12} lg={6}>
                  <FormLabel>Main Image</FormLabel>
                  <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleUpoadMainImage(e.target)}
                  />
                  {editValues.main_image && (
                      <Image
                          src={editValues.main_image}
                          alt="Selected"
                          width={400}
                          height={400}
                          style={{ width: "100%", marginTop: "10px" }}
                      />
                  )}
                </Grid>

                <Grid item xs={12} lg={6}>
                  <FormLabel>Side Image</FormLabel>
                  <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleUpoadSideImage(e.target)}
                  />
                  {editValues.side_image && (
                      <Image
                          src={editValues.side_image}
                          alt="Selected"
                          width={400}
                          height={400}
                          style={{ width: "100%", marginTop: "10px" }}
                      />
                  )}
                </Grid>

                <Grid item xs={12} lg={6}>
                  <FormLabel>Editor Name</FormLabel>
                  <TextField
                      id="editor_name"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={editValues.editor_name}
                      onChange={(e) => setEditValues({...editValues, editor_name: e.target.value})}
                  />
                </Grid>

                <Grid item xs={12} lg={6}>
                  <FormLabel>Editing Date</FormLabel>
                  <TextField
                      id="editing_date"
                      type="date"
                      size="small"
                      variant="outlined"
                      fullWidth
                      value={editValues.editing_date}
                      onChange={(e) => setEditValues({...editValues, editing_date: e.target.value})}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormLabel>Related News</FormLabel>
                  <CustomSelect
                      id="relatedNews_id"
                      multiple
                      value={editValues.relatedNews_id}
                      onChange={(e) => setEditValues({...editValues, relatedNews_id: e.target.value})}
                      fullWidth
                  >
                    {relatedNews.map((related) => (
                        <MenuItem key={related?.id} value={related?.id}>
                          {related?.name}
                        </MenuItem>
                    ))}
                  </CustomSelect>
                </Grid>

                <Grid item xs={12}>
                  <Button
                      variant="contained"
                      color="primary"
                      sx={{mr: 1}}
                      type="submit"
                      disabled={editValues.title.length === 0}
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

export default NewsListing;
