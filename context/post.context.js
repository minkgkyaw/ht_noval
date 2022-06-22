import React, { createContext, useContext, useReducer } from "react";
import axios from "axios";
import useLogin from "../hook/useLogin";

const PostContext = createContext({
  posts: [],
  totalPosts: 0,
  page: 1,
  limit: 10,
  successMessage: "",
  isLoading: false,
  isError: null,
  isUpdateLoading: false,
  isUpdateError: null,
  isDeleteLoading: false,
  isDeleteError: null,
  isAddNewPostLoading: false,
  isAddNewPostError: null,
  fetchAllPosts: () => null,
  addNewPost: () => null,
  deletePost: () => null,
  updatePost: () => null,
});

const initialState = {
  posts: [],
  totalPosts: 0,
  page: 1,
  limit: 10,
  successMessage: "",
  isLoading: false,
  isError: null,
  isUpdateLoading: false,
  isUpdateError: null,
  isDeleteLoading: false,
  isDeleteError: null,
  isAddNewPostLoading: false,
  isAddNewPostError: null,
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
      };
    case actionTypes.UPDATED_POST_SUCCEED:
      return {
        ...state,
        isUpdateLoading: false,
        isUpdateError: null,
        posts: state.posts.map((post) =>
          post.id === payload.id ? (post = payload) : post
        ),
        successMessage: "Post was successfully updated",
      };
    case actionTypes.UPDATE_POST_FAILED:
      return {
        ...state,
        isUpdateLoading: false,
        isUpdateError: payload,
        successMessage: "",
      };
    case actionTypes.START_DELETE_POST:
      return {
        ...state,
        isDeleteLoading: true,
        isDeleteError: null,
        successMessage: "",
      };
    case actionTypes.DELETE_POST_FAILED:
      return {
        ...state,
        isDeleteLoading: false,
        isDeleteError: payload,
        successMessage: "",
      };
    case actionTypes.DELETE_POST_SUCCEED:
      return {
        ...state,
        isDeleteError: null,
        isDeleteLoading: false,
        posts: state.posts.filter((post) => post.id !== payload),
        successMessage: "Post has been successfully deleted",
      };
    case actionTypes.START_ADD_NEW_POST:
      return {
        ...state,
        isAddNewPostLoading: true,
        isAddNewPostError: null,
        successMessage: "",
      };
    case actionTypes.ADD_NEW_POST_FAILED:
      return {
        ...state,
        isAddNewPostError: payload,
        isAddNewPostLoading: false,
        successMessage: "",
      };
    case actionTypes.ADD_NEW_POST_SUCCEED:
      return {
        ...state,
        isAddNewPostLoading: false,
        isAddNewPostError: null,
        successMessage: "Successfully created new posts",
      };
    default:
      return state;
  }
};

const PostContextProvider = ({ children }) => {
  const { token } = useLogin();

  const { state, dispatch } = useReducer(reducer, initialState);

  const {
    successMessage,
    isLoading,
    isAddNewPostLoading,
    isUpdateLoading,
    isDeleteLoading,
    isError,
    isAddNewPostError,
    isUpdateError,
    isDeleteError,
    posts,
    totalPosts,
    limit,
    page,
  } = state;

  const fetchAllPosts = async (page = 1, limit = 10) => {
    dispatch({ type: actionTypes.START_FETCHING_POSTS });
    try {
      const { data } = await axios.get(
        `/api/posts?page=${page}&limit=${limit}`
      );
      const payload = {
        posts: data?.posts || [],
        totalPosts: data?.meta?.totalPosts || 0,
        page: data?.meta?.page || 1,
        limit: data?.meta?.limit || 10,
      };
      return dispatch({ type: actionTypes.FETCHING_POSTS_SUCCEED, payload });
    } catch (err) {
      const payload = err?.response ? err?.response?.data : err?.message;
      return dispatch({ type: actionTypes.FETCHING_POSTS_FAILED, payload });
    }
  };

  const addNewPost = async (data) => {
    dispatch({ type: actionTypes.START_ADD_NEW_POST });
    try {
      const { data } = await axios.post("/api/posts", data, {
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (data) return dispatch({ type: actionTypes.ADD_NEW_POST_SUCCEED });
      return;
    } catch (err) {
      const payload = err?.response ? err?.response?.data : err?.message;
      return dispatch({ type: actionTypes.ADD_NEW_POST_FAILED, payload });
    }
  };

  const deletePost = async (id) => {
    dispatch({ type: actionTypes.START_DELETE_POST });
    try {
      const { data } = await axios.delete(`/api/posts/${id}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      return dispatch({
        type: actionTypes.DELETE_POST_SUCCEED,
        payload: data?.meta?.id,
      });
    } catch (err) {
      const payload = err?.response ? err?.response?.data : err?.message;
      return dispatch({ type: actionTypes.DELETE_POST_FAILED, payload });
    }
  };

  const updatePost = async (id, data) => {
    try {
      const { data } = await axios.patch(`api/posts/${id}`, data, {
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return dispatch({
        type: actionTypes.UPDATED_POST_SUCCEED,
        payload: data?.posts,
      });
    } catch (err) {
      const payload = err?.response ? err?.response?.data : err?.message;
      return dispatch({ type: actionTypes.UPDATE_POST_FAILED, payload });
    }
  };

  const value = {
    successMessage,
    isLoading,
    isAddNewPostLoading,
    isUpdateLoading,
    isDeleteLoading,
    isError,
    isAddNewPostError,
    isUpdateError,
    isDeleteError,
    posts,
    totalPosts,
    limit,
    page,
    fetchAllPosts,
    addNewPost,
    deletePost,
    updatePost,
  };
  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};

export default PostContextProvider;
