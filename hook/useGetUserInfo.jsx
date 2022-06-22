import axios from 'axios'
import useSwr from 'swr'
import jwtDecode from 'jwt-decode';
import Cookie from 'js-cookie'
import { useEffect, useState } from 'react';

const useGetUserInfo = () => {
  const [userId, setUserId] = useState('')
  
  const token = Cookie.get('token')

  useEffect(() => {
    if(token) {
      const {id} = jwtDecode(token);

      return setUserId(id)
    }
  }, [])

  const fetcher = (url, token) => axios.get(url, {headers: {
    authorization: `Bearer ${token}`
  }}).then(res => res.data);

  const {data, error} = useSwr([`api/user/${userId}`, token], fetcher)

  return {
    user: data?.user,
    isLoading: !error && !data,
    isError: error
  }
}

export default useGetUserInfo