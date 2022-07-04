/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useContext, useEffect } from "react";
import { AccordionSummary } from "@mui/material";
import { AccordionDetails, Alert } from "@mui/material";
import { Typography } from "@mui/material";
import { Accordion } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Formik } from "formik";
import { Form } from "formik";
import { MenuItem } from "@mui/material";
import { FastField } from "formik";
import { yupUserRegisterSchema } from "../schemas/user.schema";
import { Stack } from "@mui/material";
import { TextField } from "formik-mui";
import { LoadingButton } from "@mui/lab";
import { Button } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { UserContext } from "../context/user.context";
import { toast } from "react-toastify";

const initialValues = {
  name: "",
  email: "",
  password: "",
  confirm_password: "",
  role: "Helper",
};

const NewUser = () => {
  const {isAddUserLoading, isAddUserError, addNewUser, resetAddUserState, isAddUserSuccess} = useContext(UserContext)
  
  useEffect(() => {
    const showAlert = () => {
      if(isAddUserError) toast.error(isAddUserError?.message)
      else if(isAddUserSuccess) toast.success('Successfully created new Member')
      return setTimeout(() => resetAddUserState(), 3000)
    };
    showAlert()
  }, [isAddUserError, isAddUserSuccess])

  const onSubmitHandler = async (value, {resetForm}) => {
    await addNewUser(value)
    return resetForm();
    console.log(value)
  }


  return (
    <>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          sx={{alignItem:'center', alignContent: 'center'}}
        >
          <Typography variant="h6" mr={2}>Add New Member</Typography>
          {(isAddUserError || isAddUserSuccess || isAddUserLoading) &&<Alert severity={isAddUserLoading ? 'info' : isAddUserError ? "error" : isAddUserSuccess? 'success': 'warning'}>
          <Typography variant="h6"> 
            {
              isAddUserLoading ? "Loading..., please wait..." : isAddUserError ? isAddUserError?.message : isAddUserSuccess ? "Successfully added" : ''
            }
          </Typography>
          </Alert>}
        </AccordionSummary>
        <AccordionDetails>
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmitHandler}
            validationSchema={yupUserRegisterSchema}
          >
            {({ handleChange, handleBlur, dirty, isValid }) => {
              return (
                <Form>
                  <Stack
                    direction={"row"}
                    spacing={2}
                    justifyItems="center"
                    justifyContent={"space-between"}
                    mb={3}
                  >
                    <FastField
                      component={TextField}
                      name="name"
                      label="Name"
                      id="name"
                      type="text"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      variant="outlined"
                      fullWidth
                    />
                    <FastField
                      component={TextField}
                      name="email"
                      label="Email"
                      id="email"
                      type="email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      variant="outlined"
                      fullWidth
                    />
                  </Stack>
                  <Stack
                    mb={3}
                    direction={"row"}
                    spacing={2}
                    justifyItems="center"
                    justifyContent={"space-between"}
                  >
                    <FastField
                      component={TextField}
                      name="password"
                      label="Password"
                      id="password"
                      type="text"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      variant="outlined"
                      fullWidth
                    />
                    <FastField
                      component={TextField}
                      name="confirm_password"
                      label="Confirm Password"
                      id="confirm_password"
                      type="text"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      variant="outlined"
                      fullWidth
                    />
                  </Stack>
                  <Stack
                    mb={3}
                    direction={"row"}
                    spacing={2}
                    justifyItems="center"
                    justifyContent={"space-between"}
                    alignContent="center"
                    alignItems={"center"}
                  >
                    <FastField
                      component={TextField}
                      sx={{width: '12vw'}}
                      name="role"
                      label="Select Role"
                      id="role"
                      type="select"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      variant="outlined"
                      select
                      // fullWidth
                      >
                        {[ 'Helper', 'Developer', 'Admin'].map((value, index) => <MenuItem  key={index} value={value}>
                          {value}
                        </MenuItem>)}
                    </FastField>
                    <Stack spacing={5} direction={'row'}>
                      <Button variant="outlined" startIcon={<RestartAltIcon/>} color="warning" type="reset">Reset</Button>
                      <LoadingButton loading={isAddUserLoading} disabled={!isValid || !dirty} variant="contained" color="success" type="submit" endIcon={<SaveIcon />}>Submit</LoadingButton>
                      
                    </Stack>
                  </Stack>
                </Form>
              );
            }}
          </Formik>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default NewUser;
