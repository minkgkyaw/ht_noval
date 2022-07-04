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
import { toast } from "react-toastify";
import { Formik } from "formik";
import { Form } from "formik";
import { TextField } from "formik-mui";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import moment from "moment";
import { Field } from "formik";
import dynamic from "next/dynamic";
import { UserContext } from "../../../../context/user.context";
import { yupUpdateRoleSchema } from "../../../../schemas/user.schema";
import { MenuItem } from "@mui/material";
import useGetUserInfo from "../../../../hook/useGetUserInfo";
import { Backdrop } from "@mui/material";
import { CircularProgress } from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Zoom direction="up" ref={ref} {...props} />;
});

const ViewUserById = () => {
  const router = useRouter();
  const { id } = router.query;

  const { user: loginUser } = useGetUserInfo();
  const {
    deleteUser,
    isDeleteUserLoading,
    isDeleteUserError,
    isDeleteUserSuccess,
    resetDeleteUserState,
    updateUser,
    isUpdateUserError,
    isUpdateUserLoading,
    isUpdateUserSuccess,
    resetUpdateUserState,
    users,
  } = useContext(UserContext);
  const [isEdit, setIsEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [user, setUser] = useState();

  useEffect(() => {
    const filteredUser = users?.filter((user) => user.id === id)[0];
    setUser(filteredUser);
  }, [id, users]);

  // show alert is delete actin
  useEffect(() => {
    const showAlert = () => {
      if (isDeleteUserError) return toast.error(isDeleteUserError?.message);
      else if (isDeleteUserSuccess)
        return toast("Successfully deleted user", { theme: "dark" });
        else if (isDeleteUserLoading)
        return (
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
            onClick={handleClose}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        );
        return;
    };
    resetDeleteUserState();
    showAlert();
  }, [isDeleteUserError, isUpdateUserSuccess, isDeleteUserLoading]);

  // show alert if update action
  useEffect(() => {
    const showAlert = () => {
      if (isUpdateUserError) return toast.error(isUpdateUserError?.message);
      else if (isUpdateUserSuccess)
        return toast("Successfully updated user", { theme: "dark" });
      else if (isUpdateUserLoading)
        return (
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
            onClick={handleClose}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        );
        return;
    };
    resetUpdateUserState();
    showAlert();
  }, [isUpdateUserError, isUpdateUserSuccess, isUpdateUserLoading]);

  const handleEditBtn = () => {
    setIsEdit(!isEdit);
  };
  const handleClickOpenDeleteBtn = () => {
    setOpenDelete(true);
  };

  const handleClickCloseDeleteBtn = () => {
    setOpenDelete(false);
  };

  const deleteUserHandler = async () => {
    await deleteUser(user?.id);
    toast.info("Successfully user have been deleted");
    resetDeleteUserState();
    return router.back();
  };

  const confirmDelete = user && (
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
        {`Do you want to delete ${user?.role} ${user?.name}`}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Please remember you could not be undo after deleted this user.
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
            onClick={deleteUserHandler}
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
    id: user?.id,
    createdAt: moment(user?.createdAt).format("DD/MM/YYYY"),
    updatedAt: moment(user?.updatedAt).format("DD/MM/YYYY"),
    name: user?.name,
    email: user?.email,
    role: user?.role,
  };

  const onSubmitHandler = (value) => {
    updateUser(id, { role: value.role });
    return setIsEdit(false);
  };

  return (
    user && (
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
            {isEdit ? "Cancel" : "Update role"}
          </Button>
          <Button
            variant="contained"
            color="error"
            size="large"
            endIcon={<DeleteForeverIcon fontSize="large" />}
            onClick={handleClickOpenDeleteBtn}
          >
            Delete User
          </Button>
        </Stack>
        <Typography variant="h4" color="teal" align="center">
          Detail of User - {user?.name}
        </Typography>
        <Box sx={{ mx: 5, mt: 5 }}>
          {/* detail and edit */}
          <Formik
            initialValues={initialValues}
            validationSchema={yupUpdateRoleSchema}
            onSubmit={onSubmitHandler}
          >
            {({
              handleChange,
              handleBlur,
              isValid,
              dirty,
              values,
              resetForm,
            }) => {
              const cancelBtn = () => {
                resetForm();
                return setIsEdit(false);
              };
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
                      label="User ID"
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
                      label="User Created Date"
                      InputProps={{
                        readOnly: true,
                      }}
                      variant="standard"
                      disabled
                      helperText={`Created at ${moment(
                        user.createdAt
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
                      label="User Updated Date"
                      maxRows={100}
                      InputProps={{
                        readOnly: true,
                      }}
                      disabled
                      helperText={`Updated at ${moment(
                        user.updatedAt
                      ).fromNow()}`}
                      color="success"
                      variant="standard"
                    />
                  </Stack>
                  <Stack direction={"row"} spacing={15} sx={{ mt: 5, mb: 3 }}>
                    <Field
                      component={TextField}
                      fullWidth
                      label="User Name"
                      id="filled-size-name"
                      name="name"
                      onChange={handleChange}
                      variant="outlined"
                      type={"text"}
                      size="large"
                      disabled
                    />
                    <Field
                      component={TextField}
                      fullWidth
                      label="User Mail"
                      id="filled-size-mail"
                      name="email"
                      onChange={handleChange}
                      variant="outlined"
                      type={"email"}
                      size="large"
                      disabled
                    />
                    <Field
                      component={TextField}
                      fullWidth
                      label="User Role"
                      id="filled-size-role"
                      name="role"
                      onChange={handleChange}
                      variant="outlined"
                      type={"select"}
                      size="large"
                      disabled={!isEdit}
                      select
                    >
                      <MenuItem
                        value={"Admin"}
                        disabled={
                          user?.role === "Admin" || user?.role === "Helper"
                        }
                      >
                        Admin
                      </MenuItem>
                      <MenuItem
                        value={"Developer"}
                        disabled={
                          user?.role === "Developer" || users?.role === "Helper"
                        }
                      >
                        Developer
                      </MenuItem>
                      <MenuItem value={"Helper"}>Helper</MenuItem>
                    </Field>
                  </Stack>
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

export default dynamic(() => Promise.resolve(ViewUserById), { ssr: false });
