import axios from 'axios'
import useSwr from 'swr'
import jwtDecode from 'jwt-decode';
import Cookie from 'js-cookie'
import { useEffect, useState } from 'react';

const useGetUserInfo = () => {
  const [userId, setUserId] = useState('')
  
  const userToken = Cookie.get('token')

  useEffect(() => {
    if(userToken) {
      const {id} = jwtDecode(userToken);

      return setUserId(id)
    }
  }, [userToken])

  const fetcher = (url, token) => axios.get(url, {headers: {
    authorization: `Bearer ${token}`
  }}).then(res => res.data);

  const {data, error} = useSwr([`/users/${userId}`, userToken], fetcher)

  return {
    user: data?.user,
    isLoading: !error && !data,
    isError: error
  }
}

export default useGetUserInfo