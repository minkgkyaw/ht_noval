import { Typography } from "@mui/material";
import { Divider } from "@mui/material";
import { Box } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import CarouselImage from "../components/Carousel";
import NovelInfo from "../components/NovelInfo";
import PointOfView from "../components/PointOfView";
import useGetUserInfo from "../hook/useGetUserInfo";
import useLogin from "../hook/useLogin";

const Home = () => {
  const { token } = useLogin();
  const [isAuthUser, setIsAuthUser] = useState(false);
  const {user} = useGetUserInfo()

  useEffect(() => {
    if (token) return setIsAuthUser(true);
    return setIsAuthUser(false);
  }, [token]);

  return (
    <>
      <Box
        sx={{
          display: { md: "flex", xs: "block" },
          gap: 10,
          alignItems: "center",
        }}
      >
        {/* image carousel */}
        <CarouselImage />
        {/* info */}
        <NovelInfo />
      </Box>

      {/* Author's point of view and beginning of story/review */}
      <PointOfView />
      {/* chapters  */}
      
      <Box className="chapters">
      <Divider flexItem variant="inset" light />
        <Typography variant="h4" sx={{textTransform: 'uppercase', py: 1}}  align="justify">Chapters</Typography>
        <Divider flexItem variant="inset" light />

        
      </Box>
      {/* pagination */}
    </>
  );
};

export default Home;
