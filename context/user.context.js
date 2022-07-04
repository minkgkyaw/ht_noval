import axios from "axios";
import { createContext, useReducer } from "react";
import useLogin from "../hook/useLogin";

axios.defaults.baseURL =
  process.env.BASE_API_URL || "http://localhost:3000/api";

export const UserContext = createContext({
  users: [],
  totalUsers: 0,
  isLoading: false,
  isError: null,
  resetFetchingAllUsersState: () => {},
  fetchAllUsers: async () => [],
  isAddUserLoading: false,
  isAddUserError: null,
  isAddUserSuccess: null,
  resetAddUserState: () => {},
  addNewUser: async (reqBody) => reqBody,
  isUpdateUserLoading: false,
  isUpdateUserError: null,
  isUpdateUserSuccess: null,
  resetUpdateUserState: () => {},
  updateUser: async (id, reqBody) => {
    id, reqBody;
  },
  isDeleteUserLoading: false,
  isDeleteUserError: null,
  isDeleteUserSuccess: null,
  resetDeleteUserState: () => {},
  deleteUser: async (id) => id,
});

const initialState = {
  users: [],
  totalUsers: 0,
  isLoading: false,
  isError: null,
  isAddUserLoading: false,
  isAddUserError: null,
  isAddUserSuccess: null,
  isUpdateUserLoading: false,
  isUpdateUserError: null,
  isUpdateUserSuccess: null,
  isDeleteUserLoading: false,
  isDeleteUserError: null,
  isDeleteUserSuccess: null,
};

const actionTypes = {
  START_FETCHING_USERS: "START_FETCHING_USERS",
  FETCHING_USERS_SUCCEED: "FETCHING_USERS_SUCCEED",
  FETCHING_USERS_FAILED: "FETCHING_USERS_FAILED",
  RESET_FETCHING_USERS_STATE: "RESET_FETCHING_USERS_STATE",
  START_ADD_NEW_USER: "START_ADD_NEW_USER",
  ADD_NEW_USER_SUCCEED: "ADD_NEW_USER_SUCCEED",
  ADD_NEW_USER_FAILED: "ADD_NEW_USER_FAILED",
  RESET_ADD_USER_STATE: "RESET_ADD_USER_STATE",
  START_UPDATE_USER: "START_UPDATE_USER",
  UPDATE_USER_SUCCEED: "UPDATE_USER_SUCCEED",
  UPDATE_USER_FAILED: "UPDATE_USER_FAILED",
  RESET_UPDATE_USER_STATE: "RESET_UPDATE_USER_STATE",
  START_DELETE_USER: "START_DELETE_USER",
  DELETE_USER_SUCCEED: "DELETE_USER_SUCCEED",
  DELETE_USER_FAILED: "DELETE_USER_FAILED",
  RESET_DELETE_USER_STATE: "RESET_DELETE_USER_STATE",
};

const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case actionTypes.START_FETCHING_USERS:
      return { ...state, isLoading: true };
    case actionTypes.FETCHING_USERS_FAILED:
      return { ...state, isLoading: false, isError: payload };
    case actionTypes.FETCHING_USERS_SUCCEED:
      return {
        ...state,
        isLoading: false,
        users: payload?.users,
        totalUsers: payload?.meta?.total,
      };
    case actionTypes.RESET_FETCHING_USERS_STATE:
      return { ...state, isLoading: false, isError: null };
    case actionTypes.START_ADD_NEW_USER:
      return { ...state, isAddUserLoading: true };
    case actionTypes.ADD_NEW_USER_FAILED:
      return {
        ...state,
        isAddUserError: payload,
        isAddUserLoading: false,
        isAddUserSuccess: false,
      };
    case actionTypes.ADD_NEW_USER_SUCCEED:
      return {
        ...state,
        isAddUserLoading: false,
        users: [payload, ...state.users],
        isAddUserSuccess: true,
      };
    case actionTypes.RESET_ADD_USER_STATE:
      return {
        ...state,
        isAddUserError: null,
        isAddUserLoading: false,
        isAddUserSuccess: null,
      };
    case actionTypes.START_UPDATE_USER:
      return { ...state, isUpdateUserLoading: true };
    case actionTypes.UPDATE_USER_FAILED:
      return {
        ...state,
        isUpdateUserError: payload,
        isUpdateUserLoading: false,
        isUpdateUserSuccess: false,
      };
    case actionTypes.UPDATE_USER_SUCCEED:
      return {
        ...state,
        isUpdateUserLoading: false,
        isUpdateUserSuccess: true,
        users: state.users.map((user) =>
          user.id === payload.id ? (user = payload) : user
        ),
      };
    case actionTypes.RESET_UPDATE_USER_STATE:
      return {
        ...state,
        isUpdateUserError: null,
        isUpdateUserLoading: false,
        isUpdateUserSuccess: null,
      };
    case actionTypes.START_DELETE_USER:
      return { ...state, isDeleteUserLoading: true };
    case actionTypes.DELETE_USER_FAILED:
      return {
        ...state,
        isDeleteUserError: payload,
        isDeleteUserLoading: false,
        isDeleteUserSuccess: false,
      };
    case actionTypes.DELETE_USER_SUCCEED:
      return {
        ...state,
        isDeleteUserLoading: false,
        users: state.users.filter((user) => user.id !== payload),
        totalUsers: state.totalUsers - 1,
        isDeleteUserSuccess: true,
      };
    case actionTypes.RESET_DELETE_USER_STATE:
      return {
        ...state,
        isDeleteUserError: null,
        isDeleteUserLoading: false,
        isDeleteUserSuccess: null,
      };
    default:
      state;
  }
};
const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { token } = useLogin();

  // fetch all users
  const fetchAllUsers = async () => {
    dispatch({ type: actionTypes.START_FETCHING_USERS });
    try {
      const { data } = await axios.get("/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return dispatch({
        type: actionTypes.FETCHING_USERS_SUCCEED,
        payload: data,
      });
    } catch (err) {
      const payload = err?.response ? err?.response?.data : err;
      return dispatch({ type: actionTypes.FETCHING_USERS_FAILED, payload });
    }
  };

  // reset all users state
  const resetFetchingAllUsersState = () =>
    dispatch({ type: actionTypes.RESET_FETCHING_USERS_STATE });

  // add new user
  const addNewUser = async (reqBody) => {
    dispatch({ type: actionTypes.START_ADD_NEW_USER });
    try {
      const { data } = await axios.post("/auth/register", reqBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return dispatch({
        type: actionTypes.ADD_NEW_USER_SUCCEED,
        payload: data?.user,
      });
    } catch (err) {
      const payload = err?.response ? err?.response?.data : err;

      return dispatch({ type: actionTypes.ADD_NEW_USER_FAILED, payload });
    }
  };

  // reset add new user state
  const resetAddUserState = () =>
    dispatch({ type: actionTypes.RESET_ADD_USER_STATE });
  // update user
  const updateUser = async (id, reqBody) => {
    try {
      const { data } = await axios.patch(`/users/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return dispatch({
        type: actionTypes.UPDATE_USER_SUCCEED,
        payload: data?.user,
      });
    } catch (err) {
      const payload = err?.response ? err?.response?.data : err;
      return dispatch({ type: actionTypes.UPDATE_USER_FAILED, payload });
    }
  };

  // reset updated user state
  const resetUpdateUserState = () =>
    dispatch({ type: actionTypes.RESET_UPDATE_USER_STATE });

  // delete user
  const deleteUser = async (id) => {
    try {
      const { data } = await axios.delete(`/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return dispatch({
        type: actionTypes.DELETE_USER_SUCCEED,
        payload: data?.meta?.id,
      });
    } catch (err) {
      const payload = err?.response ? err?.response?.data : err;
      return dispatch({ type: actionTypes.DELETE_USER_FAILED, payload });
    }
  };

  // reset delete user state
  const resetDeleteUserState = () =>
    dispatch({ type: actionTypes.RESET_DELETE_USER_STATE });

  const value = {
    ...state,
    resetDeleteUserState,
    deleteUser,
    resetUpdateUserState,
    updateUser,
    resetFetchingAllUsersState,
    fetchAllUsers,
    resetAddUserState,
    addNewUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserProvider;
