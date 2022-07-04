import { Card } from "@mui/material";
import { CardContent } from "@mui/material";
import { Typography } from "@mui/material";
import { Button } from "@mui/material";
import { CardActions } from "@mui/material";
import { Container } from "@mui/material";
import React from "react";
import Lottie from "react-lottie";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import * as animationData from "../animations/server_error.json";
import { useRouter } from "next/router";

const InternalServerErrorPage = () => {
  const router = useRouter();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <Container>
      <Card>
        <CardContent>
          <Lottie
            height={400}
            width={400}
            options={defaultOptions}
            loop={true}
          />
          <Typography variant="h6" color="text.secondary" align="center">
            We&apos;re sorry, something went wrong (hope fix it soon).
          </Typography>
        </CardContent>
        <CardActions sx={{ alignItems: "center", alignContent: "center" }}>
          <Button
            startIcon={<HomeOutlinedIcon />}
            sx={{ borderRadius: 30, px: 2, mb: 2, mx: "auto" }}
            size="large"
            variant="contained"
            color="info"
            onClick={() => router.push("/")}
          >
            Go to Home
          </Button>
        </CardActions>
      </Card>
    </Container>
  );
};

export default InternalServerErrorPage;
