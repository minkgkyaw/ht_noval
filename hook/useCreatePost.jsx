import * as React from "react";
import axios from "axios";
import useLogin from "./useLogin";

const useCreatePost = () => {
  const {token} = useLogin()

  const createPost = async (data) =>
    await axios.post("/api/posts", data, {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  return createPost;
};

export default useCreatePost;
