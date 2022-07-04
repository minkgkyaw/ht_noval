import React, { createContext, useReducer } from "react";
import axios from "axios";
import useLogin from "../hook/useLogin"

axios.defaults.baseURL = process.env.BASE_API_URL || 'http://localhost:3000/api';
export const PostContext = createContext({
  posts: [],
  totalPosts: 0,
  page: 1,
  limit: 10,
  isLoading: false,
  isError: null,
  isUpdateLoading: false,
  isUpdateError: null,
  isUpdateSuccess: null,
  isDeleteLoading: false,
  isDeleteError: null,
  isDeleteSuccess: null,
  isAddNewPostLoading: false,
  isAddNewPostError: null,
  isAddNewPostSuccess: null,
  fetchAllPosts: async (page, limit, sort) => null,
  addNewPost: async (reqBody) => null,
  deletePost: async (id) => null,
  updatePost: async (id, reqBody) => null,
});

const initialState = {
  posts: [],
  totalPosts: 0,
  page: 1,
  limit: 10,
  isLoading: false,
  isError: null,
  isUpdateLoading: false,
  isUpdateError: null,
  isUpdateSuccess: null,
  isDeleteLoading: false,
  isDeleteError: null,
  isDeleteSuccess: null,
  isAddNewPostLoading: false,
  isAddNewPostError: null,
  isAddNewPostSuccess: null,
  resetAddPostState: () => null,
  resetDeletePostState: () => null,
  resetUpdatePostState: () => null,
  fetchAllPosts: async () => [],
  addNewPost: async (reqBody) => reqBody,
  updatePost: async (id, reqBody) => {id, reqBody},
  deletePost: async (id) => id,
};

const actionTypes = {
  START_FETCHING_POSTS: "START_FETCHING_POSTS",
  FETCHING_POSTS_SUCCEED: "FETCHING_POSTS_SUCCEED",
  FETCHING_POSTS_FAILED: "FETCHING_POSTS_FAILED",
  START_UPDATE_POST: "START_UPDATE_POST",
  UPDATE_POST_FAILED: "UPDATE_POST_FAILED",
  UPDATED_POST_SUCCEED: "UPDATE_POST_SUCCEED",
  START_DELETE_POST: "START_DELETE_POST",
  DELETE_POST_SUCCEED: "DELETE_POST_SUCCEED",
  DELETE_POST_FAILED: "DELETE_POST_FAILED",
  START_ADD_NEW_POST: "START_ADD_NEW_POST",
  ADD_NEW_POST_SUCCEED: "ADD_NEW_POST_SUCCEED",
  ADD_NEW_POST_FAILED: "ADD_NEW_POST_FAILED",
  RESET_ADD_POST_STATE: "RESET_ADD_POST_STATE",
  RESET_UPDATE_POST_STATE: "RESET_UPDATE_POST_STATE",
  RESET_DELETE_POST_STATE: "RESET_DELETE_POST_STATE",
};

const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case actionTypes.START_FETCHING_POSTS:
      return {
        ...state,
        isLoading: true,
        isError: null,
      };
    case actionTypes.FETCHING_POSTS_FAILED:
      return {
        ...state,
        isLoading: false,
        isError: payload,
      };
    case actionTypes.FETCHING_POSTS_SUCCEED: {
      const { posts, totalPosts, page, limit } = payload;
      return {
        ...state,
        isLoading: false,
        isError: null,
        posts,
        totalPosts,
        page,
        limit,
      };
    }
    case actionTypes.START_UPDATE_POST:
      return {
        ...state,
        isUpdateLoading: true,
        successMessage: "",
        isUpdateError: null,
        isUpdateSuccess: null,
      };
    case actionTypes.UPDATED_POST_SUCCEED: {
      return {
        ...state,
        isUpdateLoading: false,
        isUpdateError: null,
        isUpdateSuccess: true,
        posts: state.posts.map((post) =>
          post.id === payload.id ? (post = payload) : post
        ),
      };
    }
    case actionTypes.UPDATE_POST_FAILED:
      return {
        ...state,
        isUpdateLoading: false,
        isUpdateError: payload,
        isUpdateSuccess: false,
      };
    case actionTypes.START_DELETE_POST:
      return {
        ...state,
        isDeleteLoading: true,
        isDeleteError: null,
        isDeleteSuccess: null,
      };
    case actionTypes.DELETE_POST_FAILED:
      return {
        ...state,
        isDeleteLoading: false,
        isDeleteError: payload,
        isDeleteSuccess: false,
      };
    case actionTypes.DELETE_POST_SUCCEED:
      return {
        ...state,
        isDeleteError: null,
        isDeleteLoading: false,
        isDeleteSuccess: true,
        posts: state.posts.filter((post) => post.id !== payload),
      };
    case actionTypes.START_ADD_NEW_POST:
      return {
        ...state,
        isAddNewPostLoading: true,
        isAddNewPostError: null,
        isAddNewPostSuccess: null,
      };
    case actionTypes.ADD_NEW_POST_FAILED:
      return {
        ...state,
        isAddNewPostError: payload,
        isAddNewPostLoading: false,
        isAddNewPostSuccess: false,
      };
    case actionTypes.ADD_NEW_POST_SUCCEED: {
      return {
        ...state,
        isAddNewPostLoading: false,
        isAddNewPostError: null,
        isAddNewPostSuccess: true,
      };
    }
    case actionTypes.RESET_ADD_POST_STATE:
      return {
        ...state,
        isAddNewPostError: null,
        isAddNewPostLoading: false,
        isAddNewPostSuccess: null,
      };
    case actionTypes.RESET_DELETE_POST_STATE:
      return {
        ...state,
        isDeleteError: null,
        isDeleteLoading: false,
        isDeleteSuccess: null,
      };
    case actionTypes.RESET_UPDATE_POST_STATE:
      return {
        ...state,
        isUpdateError: null,
        isUpdateSuccess: null,
        isUpdateLoading: false,
      };
    default:
      return state;
  }
};

const PostContextProvider = ({ children }) => {
  const { token } = useLogin();

  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchAllPosts = async (page = 1, limit = 10, sort = 1) => {
    dispatch({ type: actionTypes.START_FETCHING_POSTS });
    try {
      const { data } = await axios.get(
        `/posts?page=${page}&limit=${limit}&sort=${sort}`
      );
      const payload = {
        posts: data?.posts || [],
        totalPosts: data?.meta?.total || 0,
        page: data?.meta?.page || 1,
        limit: data?.meta?.limit || 10,
      };
      return dispatch({ type: actionTypes.FETCHING_POSTS_SUCCEED, payload });
    } catch (err) {
      const payload = err?.response ? err?.response?.data : err;
      return dispatch({ type: actionTypes.FETCHING_POSTS_FAILED, payload });
    }
  };

  const addNewPost = async (reqBody) => {
    dispatch({ type: actionTypes.START_ADD_NEW_POST });
    try {
      const { data } = await axios.post("/posts", reqBody, {
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      dispatch({ type: actionTypes.ADD_NEW_POST_SUCCEED, payload: data.post });
      return fetchAllPosts(1, 5, -1);
    } catch (err) {
      const payload = err?.response ? err?.response?.data : err;
      return dispatch({ type: actionTypes.ADD_NEW_POST_FAILED, payload });
    }
  };

  const deletePost = async (id) => {
    dispatch({ type: actionTypes.START_DELETE_POST });
    try {
      const { data } = await axios.delete(`/posts/${id}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      return dispatch({
        type: actionTypes.DELETE_POST_SUCCEED,
        payload: data?.meta?.id,
      });
    } catch (err) {
      const payload = err?.response ? err?.response?.data : err;
      return dispatch({ type: actionTypes.DELETE_POST_FAILED, payload });
    }
  };

  const updatePost = async (id, reqBody) => {
    try {
      const url = `/posts/${id}`;

      const { data } = await axios.patch(url, reqBody, {
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return dispatch({
        type: actionTypes.UPDATED_POST_SUCCEED,
        payload: data?.post,
      });
    } catch (err) {
      const payload = err?.response ? err?.response?.data : err;
      return dispatch({ type: actionTypes.UPDATE_POST_FAILED, payload });
    }
  };

  const resetAddPostState = () =>
    dispatch({ type: actionTypes.RESET_ADD_POST_STATE });

  const resetUpdatePostState = () =>
    dispatch({ type: actionTypes.RESET_UPDATE_POST_STATE });

  const resetDeletePostState = () =>
    dispatch({ type: actionTypes.RESET_DELETE_POST_STATE });

  const value = {
    ...state,
    fetchAllPosts,
    addNewPost,
    deletePost,
    updatePost,
    resetAddPostState,
    resetDeletePostState,
    resetUpdatePostState,
  };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};

export default PostContextProvider;
