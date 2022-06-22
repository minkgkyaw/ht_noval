import { useContext } from 'react'
import { LoginUserContext } from '../context/login.context'

const useLogin = () => {
  const {loginHandler, token, isLoading, error, logoutHandler} = useContext(LoginUserContext)
  return {login: loginHandler, isLoading, token, error, logout: logoutHandler }
}

export default useLogin