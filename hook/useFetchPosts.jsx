import useSWR from "swr";
import axios from "axios";

const fetcher = (url) =>
  axios
    .get(url)
    .then((res) => res.data)

export const usePosts = (url) => {
  const {  data, error } = useSWR(url, fetcher);

  return {
    posts: data,
    isLoading: !error && !data,
    // isLoading: true,
    isError: error?.response ? error.response : error?.message
  }
};
