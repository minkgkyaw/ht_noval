import { Card } from "@mui/material";
import { CardContent } from "@mui/material";
import { Typography } from "@mui/material";
import { Container } from "@mui/material";
import React from "react";
import Lottie from "react-lottie";
import * as animationData from "../animations/loading.json";

const Loading = () => {
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
          <Typography variant="h5" color="text.secondary" align="center">
            Loading ...
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Loading;
