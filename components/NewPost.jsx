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
import useCreatePost from "../hook/useCreatePost";
import { useGetPosts } from "../hook/useFetchPosts";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const NewPost = ({ chapters }) => {
  const createPost = useCreatePost()
  const fetchPost = useGetPosts()
  const initialValues = {
    chapters: chapters ? chapters + 1 : "",
    body: "",
  };
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const onSubmitHandler = async (value) => {
    handleClose();
    const response = await createPost(value)
    if(response) return fetchPost.posts
  }
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
          <Formik
            initialValues={initialValues}
            validationSchema={yupCreateNewPostSchema}
            onSubmit={onSubmitHandler}
          >
            {({ handleChange, handleBlur }) => (
              <Form>
                <Box mt={2} mb={4}>
                  <FastField
                    name="chapters"
                    component={TextField}
                    variant="standard"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    id="chapters"
                    label="Add Chapters No"
                    fullWidth
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
                <Box mt={4} sx={{ display: "flex", justifyContent: "center" }}>
                  <Button type="submit" color="success" variant="contained">Add</Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>
    </>
  );
};

export default NewPost;
