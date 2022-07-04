import { useRouter } from "next/router";
import React from "react";
import axios from "axios";
import { Card } from "@mui/material";
import { CardHeader } from "@mui/material";
import { Avatar } from "@mui/material";
import moment from "moment";
import { Box } from "@mui/material";
import KeyboardBackspaceSharpIcon from "@mui/icons-material/KeyboardBackspaceSharp";
import { Button } from "@mui/material";
import { CardContent } from "@mui/material";
import { Typography } from "@mui/material";
import { CardActions } from "@mui/material";
import { Stack } from "@mui/material";
import SkipNextSharpIcon from "@mui/icons-material/SkipNextSharp";
import SkipPreviousSharpIcon from "@mui/icons-material/SkipPreviousSharp";
import useSWR from "swr";
import InternalServerErrorPage from "../500";

const fetcher = (url) => axios.get(url).then((res) => res.data);

const PostByChapters = ({ post }) => {
  const { data, error } = useSWR(`/posts`, fetcher);

  const router = useRouter();

  if(error) <InternalServerErrorPage/>

  return (
    <Box>
      <Stack direction={"row"} spacing={2} my={2}>
        <Button
          variant="outlined"
          startIcon={<KeyboardBackspaceSharpIcon />}
          onClick={() => router.push("/")}
        >
          Back
        </Button>
        <Button
          variant="outlined"
          color="info"
          size="large"
          onClick={() => router.push(`/posts/chapters/${post?.chapters - 1}`)}
          startIcon={<SkipPreviousSharpIcon fontSize="large" />}
          disabled={post.chapters <= 1}
        >
          Previous
        </Button>
        <Button
          variant="outlined"
          color="info"
          size="large"
          onClick={() => router.push(`/posts/chapters/${post?.chapters + 1}`)}
          endIcon={<SkipNextSharpIcon fontSize="large" />}
          disabled={data?.meta?.total === post?.chapters}
        >
          Next
        </Button>
      </Stack>
      <Card>
        <CardHeader
          avatar={<Avatar src="/images/hein_htet2.jpg" />}
          title="ကောင်းကင်ဘုံသို့ ခြေဆန့်ခြင်း (လုအိုကျန်း)"
          subheader={moment(post?.updatedAt).fromNow()}
        />
        <CardContent>
          <Typography
            gutterBottom
            textAlign={"center"}
            variant="h6"
            color="text.secondary"
          >
            Chapters - {post?.chapters}
          </Typography>
          <Typography
            variant="body"
            color="text.secondary"
            paragraph
            sx={{ whiteSpace: "pre-wrap" }}
          >
            {post.body}
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: "space-between" }}>
          <Button
            variant="outlined"
            color="info"
            size="large"
            onClick={() => router.push(`/posts/chapters/${post?.chapters - 1}`)}
            startIcon={<SkipPreviousSharpIcon fontSize="large" />}
            disabled={post?.chapters <= 1}
          >
            Previous
          </Button>
          <Button
            variant="outlined"
            color="info"
            size="large"
            onClick={() => router.push(`/posts/chapters/${post?.chapters + 1}`)}
            endIcon={<SkipNextSharpIcon fontSize="large" />}
            disabled={data?.meta?.total === post?.chapters}
          >
            Next
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default PostByChapters;

export async function getServerSideProps(context) {
  const { params } = context.query;
  const { data } = await axios.get(`/posts/chapters/${params[1]}`);

  if (!data) {
    return {
      notFound: true,
    };
  }

  const post = data && data?.post;

  return {
    props: {
      post: post || {},
    },
  };
}
