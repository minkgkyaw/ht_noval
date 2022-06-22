import { Container } from "@mui/material";
import { Typography } from "@mui/material";
import { Paper } from "@mui/material";
import { Box } from "@mui/material";
import { FastField } from "formik";
import { Form } from "formik";
import { Formik } from "formik";
import TextField from "@mui/material/TextField";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import { yupLoginSchema } from "../../schemas/user.schema";
import { Button } from "@mui/material";
import Link from "next/link";
import { ErrorMessage } from "formik";
import useLogin from "../../hook/useLogin";
import { useRouter } from "next/router";
import { useEffect } from "react";

const initialValues = {
  email: "",
  password: "",
};

const LoginPage = () => {
  const router = useRouter();

  const {login, token, isLoading, error} = useLogin()

  useEffect(() => {
      if(token) router.back()
  }, [token, router])

  const onSubmit = async (value) => {
    await login(value)
  };

  return (
    <Container maxWidth="sm" sx={{ mx: "auto" }}>
      <Paper elevation={24}>
        <Typography variant="h4" align="center" sx={{ py: 5 }}>
          Welcome Back
        </Typography>
        <Typography variant="subtitle2" color={isLoading ? 'secondary' : 'error'} align="center" py={2}>
          {isLoading ? 'Loading...' : error ? error : ''}
        </Typography>
        {/* login form  */}
        <Formik
          initialValues={initialValues}
          validationSchema={yupLoginSchema}
          onSubmit={onSubmit}
        >
          {({ handleChange, errors, touched }) => {
            return (
              <Form>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    mx: 5,
                    pb: 10,
                  }}
                >
                  {/* for email */}
                  <Box pb={5}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-end",
                      }}
                    >
                      <AccountCircle
                        fontSize="large"
                        sx={{ color: "action.active", mr: 3 }}
                      />
                      <FastField
                        component={TextField}
                        name="email"
                        id="email"
                        label="Username"
                        type="email"
                        variant="standard"
                        fullWidth
                        onChange={handleChange}
                        error={errors.email && touched.email ? true : false}
                      />
                    </Box>
                    <ErrorMessage
                      name="email"
                      component={Typography}
                      align="right"
                      mt={1}
                      variant="subtitle1"
                      color="error"
                    />
                  </Box>
                  {/* for password  */}
                  <Box sx={{ pb: 5 }}>
                    <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                      <LockIcon
                        fontSize="large"
                        sx={{ color: "action.active", mr: 3 }}
                      />
                      <FastField
                        component={TextField}
                        name="password"
                        id="password"
                        label="Password"
                        type="password"
                        variant="standard"
                        fullWidth
                        onChange={handleChange}
                        error={errors.password && touched.email ? true : false}
                      />
                    </Box>
                    <ErrorMessage
                      component={Typography}
                      align="right"
                      mt={1}
                      variant="subtitle1"
                      color="error"
                      name="password"
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyItems: "center",
                      mx: "auto",
                    }}
                  >
                    <Button variant="contained" type="submit">
                      Login
                    </Button>
                    <Typography align="center" sx={{ my: 1 }}>
                      OR
                    </Typography>
                    <Link href={"/admin/login/forget_password"} passHref>
                      <Button>Forget password</Button>
                    </Link>
                  </Box>
                </Box>
              </Form>
            );
          }}
        </Formik>
      </Paper>
    </Container>
  );
};

export default LoginPage;
