/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Paper } from "@mui/material";
import { Typography } from "@mui/material";
import { Box } from "@mui/material";
import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Stack } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import RateReviewIcon from "@mui/icons-material/RateReview";
import { Dialog } from "@mui/material";
import { DialogTitle } from "@mui/material";
import { DialogContent } from "@mui/material";
import { DialogContentText } from "@mui/material";
import { DialogActions } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { Tooltip } from "@mui/material";
import { Zoom } from "@mui/material";
import { PostContext } from "../../../../context/post.context";
import { toast } from "react-toastify";
import { Formik } from "formik";
import { Form } from "formik";
import { yupUpdatePostSchema } from "../../../../schemas/post.schema";
import { TextField } from "formik-mui";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import moment from "moment";
import { Field } from "formik";
import dynamic from "next/dynamic";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Zoom direction="up" ref={ref} {...props} />;
});

const ViewPostById = () => {
  const router = useRouter();
  const { id } = router.query;
  const {
    deletePost,
    updatePost,
    posts,
    resetDeletePostState,
    resetUpdatePostState,
    isUpdateError,
    isUpdateSuccess
  } = useContext(PostContext);
  const [isEdit, setIsEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [post, setPost] = useState()

  useEffect(() => {
    const filteredPost = posts?.filter((post) => post.id === id)[0];
    setPost(filteredPost)
  }, [id, posts])

  useEffect(() => {
    isUpdateSuccess
    const showAlert = () => {
      if(isUpdateError) return toast.error(isUpdateError?.message, {

      })
      else if(isUpdateSuccess) return toast('Successfully updated post', {theme: 'dark'})
      return;
    }
    resetUpdatePostState();
    showAlert();
  }, [isUpdateError, isUpdateSuccess])

  const handleEditBtn = () => {
    setIsEdit(!isEdit);
  };
  const handleClickOpenDeleteBtn = () => {
    setOpenDelete(true);
  };

  const handleClickCloseDeleteBtn = () => {
    setOpenDelete(false);
  };

  const deletePostHandler = async () => {
    await deletePost(post?.id);
    toast.info("Successfully post have been deleted");
    resetDeletePostState();
    return router.back()
  };

  const confirmDelete = post && (
    <Dialog
      TransitionComponent={Transition}
      keepMounted
      sx={{ py: 2 }}
      open={openDelete}
      onClose={handleClickCloseDeleteBtn}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {`Do you want to delete this chapter ${post?.chapters}`}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Please remember you could not be undo after deleted this post.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Tooltip title="Not delete" arrow>
          <Button
            sx={{ mx: 1 }}
            onClick={handleClickCloseDeleteBtn}
            variant="contained"
            color="info"
            size="large"
            startIcon={<CancelIcon fontSize="large" />}
          >
            Cancel
          </Button>
        </Tooltip>
        <Tooltip title="Delete forever" arrow>
          <Button
            sx={{ mx: 1 }}
            onClick={deletePostHandler}
            autoFocus
            color="error"
            size="large"
            endIcon={<DeleteForeverIcon fontSize="large" />}
          >
            Delete
          </Button>
        </Tooltip>
      </DialogActions>
    </Dialog>
  );

  const initialValues = {
    id: post?.id,
    createdAt: moment(post?.createdAt).format("DD/MM/YYYY"),
    updatedAt: moment(post?.updatedAt).format("DD/MM/YYYY"),
    chapters: post?.chapters,
    body: post?.body,
  };

  const onSubmitHandler = (value) => {
    updatePost(id, { chapters: value.chapters, body: value.body });
    return setIsEdit(false);
  };

  return (
    post && (
      <Paper elevation={5} sx={{ py: 5 }}>
        <Stack spacing={7} direction="row" sx={{ mx: 5, mb: 5 }}>
          <Button
            onClick={() => router.back()}
            variant={"outlined"}
            startIcon={<ArrowBackIcon fontSize="large" />}
            size="large"
          >
            Go Back
          </Button>
          <Button
            variant={isEdit ? "outlined" : "contained"}
            color="warning"
            size="large"
            startIcon={
              isEdit ? (
                <HighlightOffIcon fontSize="large" />
              ) : (
                <RateReviewIcon fontSize="large" />
              )
            }
            onClick={handleEditBtn}
          >
            {isEdit ? "Cancel" : "Edit Post"}
          </Button>
          <Button
            variant="contained"
            color="error"
            size="large"
            endIcon={<DeleteForeverIcon fontSize="large" />}
            onClick={handleClickOpenDeleteBtn}
          >
            Delete Post
          </Button>
        </Stack>
        <Typography variant="h4" color="teal" align="center">
          Detail of Chapter - {post?.chapters}
        </Typography>
        <Box sx={{ mx: 5, mt: 5 }}>
          {/* detail and edit */}
          <Formik
            initialValues={initialValues}
            validationSchema={yupUpdatePostSchema}
            onSubmit={onSubmitHandler}
          >
            {({ handleChange, handleBlur, isValid, dirty, values, resetForm }) => {
              const cancelBtn = () => {
                resetForm()
                return setIsEdit(false)
              }
              return (
                <Form>
                  <Stack direction={"row"} spacing={15}>
                    <Field
                      component={TextField}
                      size="large"
                      fullWidth
                      sx={{ cursor: "not-allowed" }}
                      id="read-only-id"
                      name="id"
                      label="Post ID"
                      variant="standard"
                      InputProps={{
                        readOnly: true,
                      }}
                      helperText="Auto generated unique uuid"
                      disabled
                    />
                    <Field
                      name="createdAt"
                      component={TextField}
                      size="large"
                      fullWidth
                      sx={{ cursor: "not-allowed" }}
                      id="read-only-createdAt"
                      label="Post Created Date"
                      InputProps={{
                        readOnly: true,
                      }}
                      variant="standard"
                      disabled
                      helperText={`Created at ${moment(
                        post.createdAt
                      ).fromNow()}`}
                      color="success"
                    />
                    <Field
                      name="updatedAt"
                      component={TextField}
                      size="large"
                      fullWidth
                      sx={{ cursor: "not-allowed" }}
                      id="read-only-updatedAt"
                      label="Post Updated Date"
                      maxRows={100}
                      InputProps={{
                        readOnly: true,
                      }}
                      disabled
                      helperText={`Updated at ${moment(
                        post.updatedAt
                      ).fromNow()}`}
                      color="success"
                      variant="standard"
                    />
                  </Stack>
                  <div>
                    <Field
                      component={TextField}
                      sx={{ mt: 5, mb: 3 }}
                      label="Post Chapters"
                      id="filled-size-chapters"
                      name="chapters"
                      onChange={handleChange}
                      variant="outlined"
                      type={"number"}
                      size="large"
                      disabled={!isEdit}
                    />
                  </div>
                  <div>
                    <Field
                      component={TextField}
                      fullWidth
                      id="filled-multiline-body"
                      label={"Body"}
                      type="text"
                      name="body"
                      multiline
                      maxRows={80}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={!isEdit}
                    />
                  </div>
                  {isEdit && (
                    <Stack direction={"row"} spacing={5} flex mt={5} sx={{}}>
                      <Box sx={{ flexGrow: 1 }}></Box>
                      <Button
                      type="reset"
                        startIcon={<HighlightOffIcon fontSize="large" />}
                        size="large"
                        color="error"
                        variant="outlined"
                        sx={{ textTransform: "capitalize" }}
                        onClick={cancelBtn}
                      >
                        Cancel
                      </Button>
                      <Button
                        startIcon={<UpgradeIcon fontSize={"large"} />}
                        size="large"
                        color="success"
                        variant="contained"
                        sx={{ textTransform: "capitalize" }}
                        type="submit"
                      >
                        {" "}
                        Update{" "}
                      </Button>
                    </Stack>
                  )}
                </Form>
              );
            }}
          </Formik>
        </Box>
        {confirmDelete}
      </Paper>
    )
  );
};

export async function getServerSideProps({ params }) {
  return {
    props: { params },
  };
}

export default dynamic(() => Promise.resolve(ViewPostById), { ssr: false });