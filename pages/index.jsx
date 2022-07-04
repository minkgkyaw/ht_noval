import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { Typography } from "@mui/material";
import { Grid } from "@mui/material";
import { Paper } from "@mui/material";
import { styled } from "@mui/material";
import { Box } from "@mui/material";
import axios from "axios";
import CarouselImage from "../components/Carousel";
import NovelInfo from "../components/NovelInfo";
import PointOfView from "../components/PointOfView";
import useLogin from "../hook/useLogin";
import { Tooltip } from "@mui/material";
import { Stack } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import { Card } from "@mui/material";
import { CardContent } from "@mui/material";
import { CardActions } from "@mui/material";
import { useRouter } from "next/router";

axios.defaults.baseURL = process.env.BASE_API_URL || 'http://localhost:3000/api';

const fetcher = (url) => axios.get(url).then((res) => res.data);

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const Home = ({ postsData }) => {
  // const [isAuthUser, setIsAuthUser] = useState(false);
  const { token } = useLogin();
  const router = useRouter();
  // // set user is auth for authorization
  // useEffect(() => {
  //   if (token) return setIsAuthUser(true);
  //   return setIsAuthUser(false);
  // }, [token]);

  const [posts, setPosts] = useState([]);
  const [count, setCount] = useState(0);
  const [pages, setPages] = useState(1);
  const { data, error } = useSWR(
    `/posts?page=${pages}&limit=40&sort=-1`,
    fetcher
  );

  // set posts to posts array
  useEffect(() => {
    const fetchPost = () => {
      if (data) return setPosts(data?.posts);
      return setPosts(postsData?.posts);
    };
    fetchPost();
  }, [data, postsData]);

  // useEffect(() => {

  // }, []);

  // set pages number to counts for pagination
  useEffect(() => {
    const countPosts = () => {
      const totalPosts = data?.meta?.total || 50;
      const limit = data?.meta?.limit || 20;

      const totalPages = Math.ceil(totalPosts / limit);

      return setCount(totalPages);
    };
    countPosts();
  }, [data]);

  if (error)
    return (
      <Stack justifyContent={"center"}>
        <Typography align="center" variant="h3" color={"error"} py={5}>
          {error?.response?.data?.message || error?.message}
        </Typography>
      </Stack>
    );

  const handlePageChange = (e, page) => {
    setPages(page);
  };

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

      <Card>
        {/* chapters  */}
        <CardContent className="chapters">
          <Typography
            variant="h5"
            sx={{ textTransform: "uppercase", pb: 3, mt: { xs: 5, md: 0 } }}
            align="center"
          >
            Chapters
          </Typography>
          <Grid
            container
            rowSpacing={3}
            // ml={{xs: 2, md: 3, lg: 4}}
            // justifyItems={posts.length < 10 ? 'flex-start' : "space-between"}
            // justifyContent={posts.length < 10 ? 'flex-start' : "space-between"}
            columns={12}
            columnGap={2}
          >
            {posts?.map((post) => (
              <Grid
                item
                xs={2}
                md={1}
                key={post?.id}
                onClick={() => router.push(`/posts/chapters/${post.chapters}`)}
              >
                <Tooltip
                  title={`Go to chapters ${post.chapters}`}
                  arrow
                  placement="top"
                >
                  <Item elevation={10} sx={{ cursor: "pointer" }}>
                    <Typography variant="button">
                      Ch - {post?.chapters}
                    </Typography>
                  </Item>
                </Tooltip>
              </Grid>
            ))}
          </Grid>
        </CardContent>
        {/* pagination */}
        <CardActions>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "row",
              width: "full",
              minWidth: "-webkit-fill-available",
              marginTop: "2rem",
              marginBottom: "1rem",
            }}
          >
            <Pagination
              count={count}
              variant="outlined"
              color="primary"
              showFirstButton
              showLastButton
              defaultPage={1}
              onChange={handlePageChange}
            />
          </div>
        </CardActions>
      </Card>
    </>
  );
};

export default Home;

export async function getServerSideProps() {
  const { data } = await axios.get("/posts?page=1&limit=40");

  if (!data) return { notFound: true };

  return {
    props: { postsData: data },
  };
}
