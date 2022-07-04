/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import { Button } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Box } from "@mui/material";
import { Formik } from "formik";
import { Form } from "formik";
import { FastField } from "formik";
import { yupCreateNewPostSchema } from "../schemas/post.schema";
import { TextField } from "formik-mui";
import { PostContext } from "../context/post.context";
import { LoadingButton } from "@mui/lab";
import SaveIcon from "@mui/icons-material/Save";
import { toast } from "react-toastify";
import { Alert, AlertTitle } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  border: "1px solid green",
  borderRadius: 3,
  boxShadow: 50,
  p: 4,
};

const NewPost = () => {
  const {
    totalPosts,
    addNewPost,
    isLoading,
    isAddNewPostLoading,
    isAddNewPostError,
    isAddNewPostSuccess,
    resetAddPostState,
  } = React.useContext(PostContext);

  React.useEffect(() => {
    const showAlert = () => {
      if (isAddNewPostError) toast.error(isAddNewPostError?.message);
      else if (isAddNewPostSuccess)
        toast.success("Successfully created a new chapter.");
      return setTimeout(() => resetAddPostState(), 3000);
    };
    showAlert();
  }, [isAddNewPostError, isAddNewPostSuccess]);

  const initialValues = {
    chapters: totalPosts + 1,
    body: "",
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const onSubmitHandler = async (value) => {
    await addNewPost(value);
  };

  return (
    <>
      <Button
        variant="contained"
        color="success"
        sx={{ p: 2 }}
        startIcon={<AddCircleOutlineIcon fontSize="larger" />}
        onClick={handleOpen}
      >
        Add New Chapter
      </Button>

      {/* display form modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h5" align="center" py={2}>
            Add New Chapters
          </Typography>
          <Formik
            initialValues={initialValues}
            validationSchema={yupCreateNewPostSchema}
            onSubmit={onSubmitHandler}
          >
            {({ handleChange, handleBlur, isValid, dirty }) => {
              return (
                <Form>
                  {isAddNewPostError && (
                    <Alert severity="error">
                      <AlertTitle>Error</AlertTitle>
                      {isAddNewPostError.message}
                    </Alert>
                  )}

                  <Box mt={2} mb={4}>
                    <FastField
                      name="chapters"
                      component={TextField}
                      variant="standard"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      id="chapters"
                      label="Add Chapters No"
                      type="number"
                    />
                  </Box>
                  <Box mt={4} mb={2}>
                    <FastField
                      name="body"
                      component={TextField}
                      variant="filled"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      id="body"
                      label="Add Body Text"
                      fullWidth
                      my={2}
                      multiline
                      rows={6}
                      type="text"
                    />
                  </Box>
                  <Box
                    mt={4}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <LoadingButton
                      disabled={!dirty || !isValid}
                      type="submit"
                      color="success"
                      variant="contained"
                      loading={isAddNewPostLoading || isLoading}
                      loadingPosition="start"
                      startIcon={<SaveIcon />}
                    >
                      Save
                    </LoadingButton>
                  </Box>
                </Form>
              );
            }}
          </Formik>
        </Box>
      </Modal>
    </>
  );
};

export default NewPost;
