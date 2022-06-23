import { Box } from '@mui/material'
import { Typography } from '@mui/material'
import React, { useContext, useEffect } from 'react'
import { PostContext } from '../context/post.context'
import ManagePosts from './ListPosts'
import NewPost from './NewPost'

const ManageAllPosts = () => {
  // const {isLoading, isError, isAddNewPostLoading, isAddNewPostError, isDeleteError, isDeleteLoading, isUpdateError, isUpdateLoading, totalPosts, successMessage, page, limit, fetchAllPosts, addNewPost, updatePost, deletePost} = useContext(PostContext)
  return (
    <>
    <Typography variant="h4" align="center">
          Manage All Post/Chapters
        </Typography>
        <Box p={3}>
          <NewPost />
          <ManagePosts/>
        </Box>
    </>
  )
}

export default ManageAllPosts