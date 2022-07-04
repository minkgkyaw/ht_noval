import { createContext, useReducer} from "react";
import Cookie from 'js-cookie'
import axios from "axios";

axios.defaults.baseURL = process.env.BASE_API_URL || 'http://localhost:3000/api';

export const LoginUserContext = createContext({
  token: Cookie.get('token')? Cookie.get('token') : null,
  isLoading: false,
  error: null,
  loginHandler: () => null,
  logoutHandler: () => null
});

const initialState = {
  token: Cookie.get('token')? Cookie.get('token') : null,
  isLoading: false,
  error: null,
};

const actionsType = {
  LOGIN_START: "LOGIN_START",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_FAILED: "LOGIN_FAILED",
  LOGOUT: "LOGOUT",
};

const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case actionsType.LOGIN_START:
      return { ...state, isLoading: true };
    case actionsType.LOGIN_SUCCESS:
      return { ...state, token: payload, isLoading: false, error: null };
    case actionsType.LOGIN_FAILED:
      return { ...state, error: payload, isLoading: false };
    case actionsType.LOGOUT:
      return { initialState };
    default:
      return state;
  }
};
const LoginUserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { token, isAuthUser, error, isLoading } = state;

  const loginHandler = async (body) => {
    dispatch({ type: actionsType.LOGIN_START });
    try {
      const { data } = await axios.post("/auth/login", body, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const {meta, user} = data;
      Cookie.set('token', user.token, {expires: 365});
      return dispatch({ type: actionsType.LOGIN_SUCCESS, payload: user.token });
    } catch (err) {
      const payload = err.response ? err.response.data.message : err.message;
      return dispatch({ type: actionsType.LOGIN_FAILED, payload });
    }
  };

  const logoutHandler = () => {
    Cookie.remove('token');
    localStorage.removeItem('user_id')
    dispatch({type: actionsType.LOGOUT})
  }

  const value = {
    token,
    isAuthUser,
    isLoading,
    error,
    loginHandler,
    logoutHandler
  };
  return <LoginUserContext.Provider value={value}>{children}</LoginUserContext.Provider>;
};

export default LoginUserProvider;
